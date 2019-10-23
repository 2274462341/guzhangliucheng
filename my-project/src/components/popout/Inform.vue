<template>
  <div>
    <div class="element-top" style="margin:5px 0;">
      <el-select
        v-model="search"
        placeholder="搜索字段"
        class="search"
        @change="searchchang"
        style="margin-left:200px;width:200px;"
      >
        <el-option v-for="item in optionss" :key="item.value" :value="item.value"></el-option>
      </el-select>
      <el-input
        placeholder="关键字"
        class="top-input"
        v-model="screen"
        slot=" "
        clearable
        style="margin-left:0;width:200px;"
      ></el-input>
      <span class="demonstration">跳闸时间</span>
      <el-date-picker
        v-model="value1"
        @change="value1change"
        value-format="yyyy/MM/dd"
        type="date"
        placeholder="选择日期"
      ></el-date-picker>
      <span class="time">至</span>
      <el-date-picker
        v-model="value2"
        value-format="yyyy/MM/dd"
        type="date"
        @change="value2change"
        placeholder="选择日期"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="searchclick" class="searchB">搜索</el-button>
    </div>
    <div class="alldata">
      <el-table
        :data="tableData.slice((currpage-1)*pagesize,currpage*pagesize)"
        style="width: 100%;color:#33333"
        class="table"
        @cell-dblclick="tableDbEdit"
      >
        <el-table-column prop="name" label="序号" width="180">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="RWID" label="任务ID"></el-table-column>
        <el-table-column prop="SSZX" label="所属站线"></el-table-column>
        <el-table-column prop="DYDJ" label="电压等级"></el-table-column>
        <el-table-column prop="TZSB" label="跳闸设备"></el-table-column>
        <el-table-column prop="TZSJ" label="跳闸时间" sortable width="180"></el-table-column>
        <el-table-column prop="PCSB" label="排查设备"></el-table-column>
        <el-table-column prop="BZ" label="备注"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <span size="mini" @click="informCheck(scope.row)">排查</span>
            <span size="mini" @click="informDelete(scope.row)">删除</span>
            <span size="mini" @click="informRemark(scope.row)">备注</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currpage"
          :page-size="5"
          :page-sizes="[2,5,10,20]"
          layout="sizes,prev, pager, next"
          :total="tableData.length"
        ></el-pagination>
      </div>
    </div>

    <div>
      <div class="zheZhao" v-if="dialogVisible">
        <div class="RemarksAmendment" v-if="flag">
          <p class="Investi">新建排查项目</p>
          <!-- 大盒子 -->
          <div class="bigbox">
            <!--排查设备-->
            <div class="Projectin">
              <div v-for="(item,index) in alertShebeiData" :key="index" class="proStyle">
                <span class="equipment">排查设备</span>
                <el-select
                  v-for="(val,ind) in item"
                  :key="ind"
                  v-model="val.value"
                  filterable
                  :placeholder="val.pltext"
                  :class="val.class"
                  @change="selectFn(index,ind)"
                >
                  <el-option
                    v-for="(v,i) in val.data"
                    :key="i"
                    :value="v[val.opval]"
                    :label="v[val.oppl]"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <p class="addto" @click="addto">+添加排查设备</p>

            <div class="charge">
              <div v-for="(item,index) in alertPersonData" :key="index" class="changeStyle">
                <span class="Personto">排查负责人</span>
                <el-select
                  v-for="(val,ind) in item"
                  :key="ind"
                  v-model="val.value"
                  filterable
                  :placeholder="val.pltext"
                  :class="val.class"
                  @change="selectPerSonFn(index,ind)"
                >
                  <el-option
                    v-for="(v,i) in val.data"
                    :key="i"
                    :value="v[val.opval]"
                    :label="v[val.oppl]"
                  ></el-option>
                </el-select>
              </div>
              <p class="addto" @click="addFu">+添加负责人</p>
            </div>
          </div>

          <div class="footer">
            <button @click="click" class="buttons">取消</button>
            <button @click="saveIn" class="buttons">保存</button>
          </div>
        </div>
      </div>
    </div>
    <div class="edit" v-if="edit">
      <h4>编辑备注</h4>
      <div class="touble-choose">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          v-model="textareaBz"
          style="width:80%;margin: 0 40px;"
        ></el-input>
      </div>
      <div class="touble-btn">
        <el-button class="buttons" @click="editOut">取消</el-button>
        <el-button @click="bzSell" class="buttons">保存</el-button>
      </div>
    </div>
    <div class="delete" v-if="remove">
      <h4>删除</h4>
      <p style="margin:5px 40px;">是否确认删除该任务</p>
      <div class="touble-choose">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="textareaSc"
          style="width:80%;margin: 0 40px;"
        ></el-input>
      </div>
      <div class="touble-btn">
        <el-button @click="redOut" class="buttons">取消</el-button>
        <el-button @click="trues" class="buttons">确认</el-button>
      </div>
    </div>

    <div class="Taskdetails-details" v-if="db">
      <div class="Taskdetails-left">
        <span class="Taskdetails-span" @click="shouqi">></span>
      </div>
      <div class="Taskdetails-right">
        <p class="Taskdetails-p">任务详情</p>
        <ul class="Taskdetails-ul">
          <li>跳闸时间：{{tzxx.TZSJ}}</li>
          <li>跳闸设备：{{tzxx.TZSB}}</li>
          <li>任务创建时间：{{tzxx.START_TIME}}</li>
          <li>任务ID：{{tzxx.RWID}}</li>
        </ul>
        <p class="Taskdetails-p">排查记录</p>
        <ul class="Taskdetails-ul">
          <li>
            排查设备：
            <span class="Taskdetails-ulspan">
              <span>1</span>
            </span>
          </li>
          <li>排查负责人：</li>
          <li>排查完成时间：</li>
          <li>排查结论：</li>
        </ul>
        <p class="Taskdetails-p">抢修记录</p>
        <ul class="Taskdetails-ul">
          <li>故障设备：</li>
          <li>抢修负责人：</li>
          <li>开工时间：</li>
          <li>完工时间：</li>
        </ul>
        <p class="Taskdetails-p">运行记录</p>
        <ul class="Taskdetails-ul">
          <li>运行负责人：</li>
          <li>送电时间：</li>
        </ul>
        <p class="Taskdetails-p">备注</p>
        <ul class="Taskdetails-ul Taskdetails-ulli">
          <li v-for="(v,i) in bzxx" :key="i">
            <span class="Taskdetails-spanone">{{v.STATUSMC}}</span>
            {{v.BZ}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import { MessageBox } from "element-ui";
export default {
  name: "",
  data() {
    return {
      // shou:true,
      addshow: false,
      dialogVisible: false,
      flag: false,
      db: false,
      edit: false,
      remove: false,
      currpage: 1,
      pagesize: 5,
      textareaSc: "", //删除的value
      textareaBz: "", //备注的value
      list: [],
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
      ],
      // value: "",
      optionss: [
        {
          value: "所属站线",
          label: "1"
        },
        {
          value: "电压等级",
          label: "2"
        },
        {
          value: "跳闸设备",
          label: "3"
        }
      ],
      tableData: [],
      delTime: "", //记录删除时间
      bzArr: [], //多条备注信息数组
      paiId: "",
      shanId: "",
      beiId: "",
      statu: "", //状态
      input: "",
      restaurants: [],
      state1: "",
      state2: "",
      state3: "",
      state4: "",
      value: "",
      earch: "",
      value1: "",
      value2: "",
      changes: "",
      screen: "",
      search: "",
      values: "", //战线类型
      tzxx: "", //任务详情
      bzxx: "", //备注信息
      options: [
        {
          label: "电站",
          id: 1
        },
        {
          label: "线路",
          id: 2
        }
      ],
      dzId: "", //电站线路的id
      //设备类型
      sbsj: [],
      sbId: "", //获取的设备类型的id
      dz: "", //电站
      Linedata: [], //电站线路的数据
      sbData: [], //设备名称的数据
      ryData: [], //排查负责人的数据
      clData: [], //车辆的数据
      xxId: "", //这是选中的电站或线路的第二个下拉框的value
      sbobjId: "", //这是设备类型后面的设备名称选中的的id
      ryobjId: "", //选中人员id
      clobjId: "", //选中车辆id
      sbArr: [],
      addfu: false,

      alertShebeiData: [
        [
          {
            value: "",
            data: [
              {
                label: "电站",
                id: 1
              },
              {
                label: "线路",
                id: 2
              }
            ],
            pltext: "电站",
            opval: "id",
            oppl: "label",
            class: "el-selectss"
          },
          {
            value: "",
            data: [],
            pltext: "北xx线路",
            opval: "ZXMC",
            oppl: "ZXMC",
            id: "",
            class: "el-select"
          },
          {
            value: "",
            data: [
              { id: 1, sbmc: "变压器" },
              { id: 2, sbmc: "断路器" },
              { id: 3, sbmc: "隔离开关" },
              { id: 4, sbmc: "电容器" },
              { id: 5, sbmc: "电抗器" },
              { id: 6, sbmc: "避雷器" },
              { id: 7, sbmc: "开关柜" },
              { id: 8, sbmc: "变压器" },
              { id: 9, sbmc: "变压器" }
            ],
            pltext: "设备类型",
            opval: "id",
            oppl: "sbmc",
            class: "el-select"
          },
          {
            value: "",
            data: [],
            pltext: "设备名称",
            opval: "SBMC",
            oppl: "SBMC",
            class: "demo-autocomplete",
            id: ""
          }
        ]
      ],
      alertPersonData: [
        [
          {
            value: "",
            data: [],
            pltext: "负责人名称(必填)",
            class: "demo-autocomplete one",
            opval: "RYMC",
            oppl: "RYMC",
            id: ""
          },
          {
            value: "",
            data: [],
            pltext: "车辆",
            class: "demo-autocomplete two",
            opval: "CPH",
            oppl: "CPH",
            id: ""
          }
        ]
      ]
    };
  },

  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
    // 负责人模糊查询
    this.getPerson();
    //车辆模糊查询
    this.getCar();
  },

  created() {
    this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
      this.tableData = res.data.data;
    });
  },
  methods: {
    // axioapost() {
    // },
    getPerson(params = "", index = 0, ind = 0) {
      this.$axios
        .post(
          "api/info/web/zsearchFzr",
          {
            name: params
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.alertPersonData[index][ind].data = res.data.data;
          let list = this.alertPersonData[index][ind].data.filter(
            item => item.RYMC == this.alertPersonData[index][ind].value
          );
          if (list.length == 1) {
            this.alertPersonData[index][ind].id = list[0]["OBJ_ID"];
          }
        });
    },
    getCar(params = "", index = 0, ind = 1) {
      this.$axios
        .post(
          "api/info/web/zsearchCar",
          {
            cph: params
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.alertPersonData[index][ind].data = res.data.data;
          let list = this.alertPersonData[index][ind].data.filter(
            item => item.CPH == this.alertPersonData[index][ind].value
          );
          if (list.length === 1) {
            this.alertPersonData[index][ind].id = list[0]["OBJ_ID"];
          }
        });
    },
    selectFn(index, ind) {
      if (ind == 0 || ind == 1) {
        this.$axios
          .post(
            "api/info/web/zsearchDzOrXl",
            {
              zxlx: this.alertShebeiData[index][0].value,
              zxmc: this.alertShebeiData[index][1].value
            },
            {
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded"
              },
              transformRequest: [
                function(data) {
                  return Qs.stringify(data);
                }
              ]
            }
          )
          .then(res => {
            this.alertShebeiData[index][1].data = res.data.data;
            if (this.alertShebeiData[index][0].value == 1) {
              this.alertShebeiData[index][2].data = [
                { id: 1, sbmc: "变压器" },
                { id: 2, sbmc: "断路器" },
                { id: 3, sbmc: "隔离开关" },
                { id: 4, sbmc: "电容器" },
                { id: 5, sbmc: "电抗器" },
                { id: 6, sbmc: "避雷器" },
                { id: 7, sbmc: "开关柜" },
                { id: 8, sbmc: "组合电器" },
                { id: 9, sbmc: "电流互感器" },
                { id: 10, sbmc: "电压互感器" },
                { id: 11, sbmc: "站用变" },
                { id: 12, sbmc: "母线" },
                { id: 13, sbmc: "变电在线监测装置" }
              ];
            } else if (this.alertShebeiData[index][0].value == 2) {
              this.alertShebeiData[index][2].data = [
                { id: 14, sbmc: "杆塔" },
                { id: 15, sbmc: "导线" },
                { id: 16, sbmc: "地线" },
                { id: 17, sbmc: "绝缘子" },
                { id: 18, sbmc: "输电在线监测装置" },
                { id: 19, sbmc: "线路避雷器" }
              ];
            }
            if (ind == 1) {
              let list = this.alertShebeiData[index][1].data.filter(
                item => item.ZXMC == this.alertShebeiData[index][1].value
              );
              if (list.length == 1) {
                this.alertShebeiData[index][1].id = list[0]["OBJ_ID"];
              }
            }
          });
      }
      if (ind == 2 || ind == 3) {
        this.$axios
          .post(
            "api/info/web/zsearchDevice",
            {
              type: this.alertShebeiData[index][2].value,
              sbmc: this.alertShebeiData[index][3].value,
              zxid: this.alertShebeiData[index][1].id
            },
            {
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded"
              },
              transformRequest: [
                function(data) {
                  return Qs.stringify(data);
                }
              ]
            }
          )
          .then(res => {
            this.alertShebeiData[index][3].data = res.data.data;
            let arr2 = this.alertShebeiData[index][3].data.filter(
              item => item.SBMC == this.alertShebeiData[index][3].value
            );
            if ((ind = 3 && arr2.length == 1)) {
              this.alertShebeiData[index][3].id = arr2[0]["OBJ_ID"];
            }
          });
      }
    },
    selectPerSonFn(index, ind) {
      if (ind == 0) {
        this.getPerson(this.alertPersonData[index][0].value, index);
      }
      if (ind == 1) {
        this.getCar(this.alertPersonData[index][1].value, index);
      }
    },
    addto() {
      //   this.addshow = !this.addshow;
      this.alertShebeiData.push([
        {
          value: "",
          data: [
            {
              label: "电站",
              id: 1
            },
            {
              label: "线路",
              id: 2
            }
          ],
          pltext: "电站",
          opval: "id",
          oppl: "label",
          class: "el-selectss"
        },
        {
          value: "",
          data: [],
          pltext: "北xx线路",
          opval: "ZXMC",
          oppl: "ZXMC",
          id: "",
          class: "el-select"
        },
        {
          value: "",
          data: [
            { id: 1, sbmc: "变压器" },
            { id: 2, sbmc: "断路器" },
            { id: 3, sbmc: "隔离开关" },
            { id: 4, sbmc: "电容器" },
            { id: 5, sbmc: "电抗器" },
            { id: 6, sbmc: "避雷器" },
            { id: 7, sbmc: "开关柜" },
            { id: 8, sbmc: "组合电器" },
            { id: 9, sbmc: "电流互感器" },
            { id: 10, sbmc: "电压互感器" },
            { id: 11, sbmc: "站用变" },
            { id: 12, sbmc: "母线" },
            { id: 13, sbmc: "变电在线监测装置" }
          ],
          pltext: "设备类型",
          opval: "id",
          oppl: "sbmc",
          class: "el-select",
          id: ""
        },
        {
          value: "",
          data: [],
          pltext: "设备名称",
          opval: "SBMC",
          oppl: "SBMC",
          class: "demo-autocomplete",
          id: ""
        }
      ]);
    },

    addFu() {
      //   this.addfu = !this.addfu;
      this.alertPersonData.push([
        {
          value: "",
          data: [],
          pltext: "负责人名称(必填)",
          class: "demo-autocomplete one",
          opval: "RYMC",
          oppl: "RYMC",
          id: ""
        },
        {
          value: "",
          data: [],
          pltext: "车辆",
          class: "demo-autocomplete two",
          opval: "CPH",
          oppl: "CPH",
          id: ""
        }
      ]);
      this.getPerson("", this.alertPersonData.length - 1);
      this.getCar("", this.alertPersonData.length - 1);
    },

    //排查显示
    informCheck(row) {
      this.flag = true;
      this.dialogVisible = true;
      this.paiId = row.RWID;
      this.getPerson()
      this.getCar()
    },
    //新建任务保存按钮
    saveIn() {
      let sbStr = this.alertShebeiData
        .map(item => {
          return item
            .map((val, ind) => {
              console.log(val);
              if (item[2].value != "" && item[3].id != "") {
                if (ind == 2) {
                  return val.value + "_";
                }
                if (ind == 3) {
                  return val.id + ",";
                }
              }
              return "";
            })
            .join("");
        })
        .join("");
      let cpStr = this.alertPersonData
        .map(item => {
          return item
            .map((val, ind) => {
              if (item[0].id != "" && item[1].id != "") {
                if (ind == 0) {
                  return val.id + "_";
                }
                if (ind == 1) {
                  return val.id + ",";
                }
              }
              return "";
            })
            .join("");
        })
        .join("");
      if (sbStr == "" || cpStr == "") {
      }
      this.$axios
        .post(
          "api/info/web/zrenwuXjpc",
          {
            renwu_id: this.paiId,
            sbStr,
            cpStr
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.clear();
          this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
            this.tableData = res.data.data;
          });

       
        });
      let sbxiang = {
        one: this.values,
        two: this.state2,
        three: this.value,
        fore: this.state1
      };
      this.sbArr.push(sbxiang);
      this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
        let tableData = res.data.data;
        this.$bus.$emit("onsd", tableData);
      });
      this.flag = false;
      this.dialogVisible = false;
    },
    //删除
    informDelete(row) {
      this.shanId = row.RWID;
      this.remove = true;
      this.dialogVisible = true;
    },
    //删除弹框的确认按钮
    trues() {
      this.delTime = new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      // console.log(this.textarea); //输入的删除原因
      // console.log(this.delTime); //删除的时间
      this.$axios
        .post(
          "api/info/web/zdealSc",
          {
            renwu_id: this.shanId,
            type: 1,
            scyy: this.textareaSc
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
            this.tableData = res.data.data;
          });
        });
      this.remove = false;
      this.dialogVisible = false;
    },
    //备注
    informRemark(res) {
      this.statu = res.STATUS;
      this.beiId = res.RWID;
      this.textareaBz = res.BZ;
      this.edit = true;
      this.dialogVisible = true;
    },

    //备注保存按钮
    bzSell() {
      this.bzArr.push(this.textareaBz); //收集每一条的备注
      this.$axios
        .post(
          "api/info/web/zupdateRenwuBz",
          {
            renwu_id: this.beiId,
            status: this.statu,
            bz: this.textareaBz
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
            this.tableData = res.data.data;
          });
        });
      this.edit = false;
      this.dialogVisible = false;
    },

    openOut() {
      this.flag = false;
      this.dialogVisible = false;
    },
    editOut() {
      this.edit = false;
      this.dialogVisible = false;
    },
    redOut() {
      this.remove = false;
      this.dialogVisible = false;
    },
    tableDbEdit(row, column, cell, event) {
      this.$axios
        .post(
          "api/info/web/zgetDetailByRwid",
          { renwu_id: row.RWID },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.db = true;
          res.data.data.forEach(a => {
            this.tzxx = a.TZXX; //任务详情
            this.bzxx = a.BZXX; //备注信息
          });
        });
    },
    //分页-每页条数
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //当前页
    handleCurrentChange(val) {
      this.currpage = val;
    },

    handleSelect(item) {
    },
    click() {
      this.clear();
      this.flag = false;
      this.dialogVisible = false;
    
    },
    shouqi() {
      this.db = false;
    },
    searchclick() {
      this.$axios
        .post(
          "api/info/web/kgetTaskDelList",
          {
            type: this.changes,
            value: this.screen,
            starttime: this.value1,
            endtime: this.value2
          },
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: [
              function(data) {
                return Qs.stringify(data);
              }
            ]
          }
        )
        .then(res => {
          this.tableData = res.data.data;
        })
        .catch(function(error) {
        });
    },
    value1change(value) {
      if (value == "") {
        value = "";
      } else {
        this.value1 = value;
      }
    },
    value2change(value) {
      if (value == "") {
        value = "";
      } else {
        this.value2 = value;
      }
    },
    searchchang(value) {
      if (value == "所属战线") {
        this.changes = 1;
      } else if (value == "电压等级") {
        this.changes = 2;
      } else {
        this.changes = 3;
      }
    },
    clear() {
      this.alertShebeiData = [[
        {
          value: "",
          data: [
            {
              label: "电站",
              id: 1
            },
            {
              label: "线路",
              id: 2
            }
          ],
          pltext: "电站",
          opval: "id",
          oppl: "label",
          class: "el-selectss"
        },
        {
          value: "",
          data: [],
          pltext: "北xx线路",
          opval: "ZXMC",
          oppl: "ZXMC",
          id: "",
          class: "el-select"
        },
        {
          value: "",
          data: [
            { id: 1, sbmc: "变压器" },
            { id: 2, sbmc: "断路器" },
            { id: 3, sbmc: "隔离开关" },
            { id: 4, sbmc: "电容器" },
            { id: 5, sbmc: "电抗器" },
            { id: 6, sbmc: "避雷器" },
            { id: 7, sbmc: "开关柜" },
            { id: 8, sbmc: "变压器" },
            { id: 9, sbmc: "变压器" }
          ],
          pltext: "设备类型",
          opval: "id",
          oppl: "sbmc",
          class: "el-select"
        },
        {
          value: "",
          data: [],
          pltext: "设备名称",
          opval: "SBMC",
          oppl: "SBMC",
          class: "demo-autocomplete",
          id: ""
        }
      ]],
        this.alertPersonData = [[
          {
            value: "",
            data: [],
            pltext: "负责人名称(必填)",
            class: "demo-autocomplete one",
            opval: "RYMC",
            oppl: "RYMC",
            id: ""
          },
          {
            value: "",
            data: [],
            pltext: "车辆",
            class: "demo-autocomplete two",
            opval: "CPH",
            oppl: "CPH",
            id: ""
          }
        ]];
    }
  }
};
</script>

<style scoped>
.zheZhao {
  width: 1660px;
  height: 900px;
  position: absolute;
  top: 0;
}
.searchB {
  width: 90px;
  height: 40px;
  font-size: 14px;
  background: #409eff;
}
.touble-btn {
  display: flex;
}

.buttons {
  padding: 0;
  width: 50%;
  margin: 0;
  background: #999999;
  border: none;
  height: 40px;
}
.RemarksAmendment {
  width: 700px;
  background: #242433;
  position: absolute;
  top: 240px;
  left: 500px;
}
.element-top {
  display: flex;
}

.demonstration {
  display: block;
  margin: 0 10px 0 50px;
  height: 40px;
  line-height: 40px;
}

.time {
  height: 40px;
  display: block;
  line-height: 40px;
  margin: 0 10px;
}
.Investi {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 5%;
  font-weight: bold;
  color: #fff;
}
.equipment {
  padding-left: 5%;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.Projectin {
  width: 100%;
  height: auto;
  margin-top: 20px;
}

.demo-autocomplete {
  width: 150px;
}
.el-col {
  width: 100%;
}
.el-select {
  width: 130px;
}
.addShow {
  display: flex;
  justify-content: space-between;

  margin-top: 10px;
}
.selects {
  /* margin:0 10px; */
  width: 130px;
}
.addto {
  padding-left: 20px;
  margin-top: 10px;
  text-decoration: underline;
  color: #fff;
}
/* .select {
  width: 130px;
  margin: 0 10px;
} */
.footer {
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0;
  display: flex;
}
button {
  width: 50%;
  border: 0;
  height: 50px;
  font-size: 16px;
  outline: none;
  background: #999999;
}
.charge {
  height: 100%;
  margin-top: 40px;
  margin-bottom: 100px;
}
.changeStyle {
  display: flex;
  margin-top: 20px;
}
.Personto {
  display: flex;
  display: block;
  padding-left: 5%;
  line-height: 40px;
  height: 40px;
  color: #fff;
}
.one {
  margin-left: 20px;
}
.two {
  margin-left: 20px;
}
.el-select {
  margin-left: 0;
}
.el-selectss {
  margin-left: 20px;
}
</style>
