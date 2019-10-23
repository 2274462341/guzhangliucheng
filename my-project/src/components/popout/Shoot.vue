<template>
  <div>
    <div class="element-top" style="margin-top:20px;">
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
        <el-table-column prop="PCFZR" label="排查负责人"></el-table-column>
        <el-table-column prop="CL" label="车辆"></el-table-column>

        <el-table-column prop="BZ" label="备注"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <span size="mini" @click="shootCheck(scope.row)">排查完成</span>
            <span size="mini" @click="shootDelete(scope.row)">删除</span>
            <span size="mini" @click="shootRemark(scope.row)">备注</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currpage"
          :page-size="pagesize"
          :page-sizes="[2,5,10,20]"
          layout="sizes,prev, pager, next"
          :total="tableData.length"
        ></el-pagination>
      </div>
    </div>
    <div class="zheZhao" v-if="dialogVisible">
      <div class="shootBox" v-if="flag">
        <h4>排查完成</h4>
        <div class="touble-pai">
          <el-form label-width="100px">
            <el-form-item label="排查完成时间">
              <div class="block">
                <el-date-picker
                  v-model="value3"
                  class="shootTime"
                  type="datetime"
                  value-format="yyyy/mm/dd HH:mm:ss"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="排查结论">
              <el-input type="textarea" v-model="desc" class="shootDesc"></el-input>
            </el-form-item>
            <el-form-item label="故障设备">
              <div class="gzStyle">
                <!-- 一 -->
                <el-select
                  v-model="values"
                  filterable
                  placeholder="电站"
                  class="el-selectG"
                  @change="eqmonitoring"
                >
                  <el-option v-for="item in options" :key="item.value" :value="item.label"></el-option>
                </el-select>

                <!--二-->
                <el-select
                  v-model="state2"
                  filterable
                  placeholder="北xx线路"
                  class="el-selectG"
                  @change="eqmonitoring2"
                >
                  <el-option v-for="item in Linedata" :key="item.value" :value="item.ZXMC"></el-option>
                </el-select>
                <!--三-->
                <el-select
                  v-model="value"
                  filterable
                  placeholder="设备类型"
                  class="el-selectG"
                  @change="sbSearch"
                >
                  <el-option v-for="item in sbsj" :key="item.value" :value="item.sbmc"></el-option>
                </el-select>
                <!--四-->

                <el-select
                  v-model="state1"
                  filterable
                  placeholder="设备名称"
                  class="el-selectG"
                  @change="eqmonitoring3"
                >
                  <el-option v-for="item in sbData" :key="item.value" :value="item.SBMC"></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="touble-btn">
          <el-button
            @click="zqxClick"
            :disabled="closeIsDisabled"
            class="buttons"
            v-bind="tableDatas"
          >转抢修</el-button>
          <el-button @click="gdClick" :disabled="closeIsDisabled" class="buttons">归档</el-button>
          <el-button @click="openOut" class="buttons">取消</el-button>
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
        <el-button @click="editOut" class="buttons">取消</el-button>
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
        <el-button class="buttons" @click="redOut">取消</el-button>
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
              <span v-for="(item,index) in pcxx.PCSB" :key="index">{{item.PCSB}}</span>
            </span>
          </li>
          <li>
            排查负责人：
            <span class="Taskdetails-ulspan">
              <span v-for="(item,index) in pcxx.PCFZR" :key="index">{{item.PCFZR}}:{{item.CPH}}</span>
            </span>
          </li>
          <li>排查完成时间：{{pcxx.PCWCSJ}}</li>
          <li>排查结论：{{pcxx.PCJL}}</li>
        </ul>
        <p class="Taskdetails-p">抢修记录</p>
        <ul class="Taskdetails-ul">
          <li>故障设备：{{qxxx.GZSB}}</li>
          <li>抢修负责人：{{qxxx.QXFZE}}</li>
          <li>开工时间：{{qxxx.KGSJ}}</li>
          <li>完工时间：{{qxxx.WGSJ}}</li>
        </ul>
        <p class="Taskdetails-p">运行记录</p>
        <ul class="Taskdetails-ul">
          <li>运行负责人：{{zyxxx.YXFZR}}</li>
          <li>送电时间：{{zyxxx.SDSJ}}</li>
        </ul>
        <p class="Taskdetails-p">备注</p>
        <ul class="Taskdetails-ul">
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
import "../../assets/css/main.css";
// import "../../assets/css/ongoing.css";
import Qs from "qs";

export default {
  name: "",
  props: ["tableData"],
  data() {
    return {
      desc: "",
      value3: "",
      db: false,
      dialogVisible: false,
      flag: false, //排查完成
      edit: false, //备注
      remove: false, //删除
      currpage: 1,
      pagesize: 5,
      textareaSc: "",
      textareaBz: "",
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
      value1: "",
      value2: "",
      changes: "",
      screen: "",
      search: "",
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
      // tableData: [],
      gzInput: "", //故障设备内容
      paiId: "", //每条列表的id
      shanId: "",
      beiId: "",
      statu: "", // 每天数据的状态
      closeIsDisabled: false,
      closeIsDisabled: false,
      bzArr: [], //备注数组
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
      tzxx: "", //任务详情
      qxxx: "", //排查记录
      pcxx: "", //抢修记录
      zyxxx: "", //运行记录
      bzxx: "", //备注信息
      sbsj: [],
      zt: "",
      state1: "",
      tableDatas: [], //转抢修的列表
      state2: "",
      value: "",
      values: "", //战线类型
      dzId: "", //电站线路的id
      sbId: "", //获取的设备类型的id
      dz: "", //电站
      Linedata: [], //电站线路的数据
      sbData: [], //设备名称的数据
      xxId: "", //这是选中的电站或线路的第二个下拉框的value
      sbobjId: "", //这是设备类型后面的设备名称选中的的id
      she: ""
    };
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //当前页
    handleCurrentChange(val) {
      this.currpage = val;
    },

    //线路类型
    eqmonitoring2(event) {
      this.Linedata.forEach(v => {
        if (event == v.ZXMC) this.xxId = v.OBJ_ID;
      });
    },
    //电站线路的获取
    eqmonitoring(event) {
      this.options.forEach(item => {
        if (event == item.label) {
          this.dzId = item.id;
        }
      });
      if (this.values == "电站") {
        this.dz = 1;
        //模糊查询电站或线路
        this.$axios
          .post(
            "api/info/web/zsearchDzOrXl",
            {
              zxlx: this.dz,
              zxmc: this.state2
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
            this.Linedata = res.data.data;
          });
        this.sbsj = [
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
        this.sbsj.forEach(item => {
          console.log(item.sbmc);
          this.she = item.sbmc;
        });
      } else {
        this.dz = 2;
        this.$axios
          .post(
            "api/info/web/zsearchDzOrXl",
            {
              zxlx: this.dz,
              zxmc: this.state2
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
            this.Linedata = res.data.data;
          });
        this.sbsj = [
          { id: 14, sbmc: "杆塔" },
          { id: 15, sbmc: "导线" },
          { id: 16, sbmc: "地线" },
          { id: 17, sbmc: "绝缘子" },
          { id: 18, sbmc: "输电在线监测装置" },
          { id: 19, sbmc: "线路避雷器" }
        ];
        this.sbsj.forEach(item => {
          // console.log(item.sbmc);
          this.she = item.sbmc;
        });
      }
    },
    searchclick() {
      this.$axios
        .post(
          "api/info/web/kgetQXPCZList",
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
        .catch(function(error) {});
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
    // 设备类型和设备名称
    sbSearch(event) {
      this.sbsj.forEach(item => {
        if (event == item.sbmc) {
          this.sbId = item.id;
          //模糊查询设备名称
          this.$axios
            .post(
              "api/info/web/zsearchDevice",
              {
                type: this.sbId,
                sbmc: this.state1,
                zxid: this.xxId
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
              this.sbData = res.data.data;
            });
        }
      });
    },
    //设备名称
    eqmonitoring3(event) {
      this.sbData.forEach(v => {
        if (event == v.ZXMC);
        this.sbobjId = v.OBJ_ID;
      });
    },

    //排查完成
    shootCheck(row) {
      let length = row.SSZX;
      let len = length.substring(length.length - 1);
      this.options.forEach(item => {
        let label = item.label;
        if (len == label.substring(label.length - 1)) {
          this.values = item.label;
        }
      });
     this.value=row.TZSB.substring(row.TZSB.length-3)

      this.state2 = row.SSZX;
      this.state1 = row.TZSB;
      this.flag = true;
      this.dialogVisible = true;
      this.paiId = row.RWID;
      this.statu = row.STATUS;
    },
    //点击转抢修按钮
    zqxClick() {
      if (
        this.value != "" &&
        this.values != "" &&
        this.state1 != "" &&
        this.state2 != ""
      ) {
        this.zt = 3;
        this.$axios
          .post(
            "api/info/web/zrenwuPcwc",
            {
              renwu_id: this.paiId,
              pcwcsj: this.value1,
              pcjl: this.desc,
              status: this.zt,
              sbStr: this.sbId + "_" + this.sbobjId //故障设备的设备类型id
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
            this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
              this.tableData = res.data.data;
            });
          });
        this.flag = false;
        this.dialogVisible = false;
        this.value = "";
        this.values = "";
        this.state1 = "";
        this.state2 = "";
        this.value3 = "";
        this.desc = "";
      } else {
        this.openIsDisabled = true;
      }
    },
    //点击归档按钮
    gdClick() {
      if (
        this.value == "" &&
        this.values == "" &&
        this.state1 == "" &&
        this.state2 == ""
      ) {
        this.zt = 7;
        this.$axios
          .post(
            "api/info/web/zrenwuPcwc",
            {
              renwu_id: this.paiId,
              pcwcsj: this.value1,
              pcjl: this.desc,
              status: this.zt,
              sbStr: this.sbId + "_" + this.sbobjId //故障设备的设备类型id
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
            this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
              this.tableData = res.data.data;
            });
          });
        this.flag = false;
        this.dialogVisible = false;
        this.value = "";
        this.values = "";
        this.state1 = "";
        this.state2 = "";
        this.value3 = "";
        this.desc = "";
      } else {
        this.closeIsDisabled = true;
      }
    },
    //删除
    shootDelete(row) {
      this.remove = true;
      this.shanId = row.RWID;
      this.dialogVisible = true;
    },

    //删除弹框的确认按钮
    trues() {
      this.delTime = new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
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
          this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
            this.tableData = res.data.data;
          });
        });
      this.remove = false;
      this.dialogVisible = false;
    },

    // 备注
    shootRemark(row) {
      this.statu = row.STATUS;
      this.beiId = row.RWID;
      this.textareaBz = row.BZ;
      this.edit = true;
      this.dialogVisible = true;
    },
    //备注保存框
    bzSell() {
      this.bzArr.push(this.textareaBz); //收集每一条的备注
      this.edit = false;
      this.dialogVisible = false;

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
          this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
            this.tableData = res.data.data;
          });
        });
    },
    openOut() {
      this.value3 = "";
      this.desc = "";
      this.values = "";
      this.state2 = "";
      this.value = "";
      this.state1 = "";
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
    tableDbEdit(row) {
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
          res.data.data.forEach(x => {
            this.tzxx = x.TZXX; //任务详情
            this.qxxx = x.QXXX; //排查记录
            this.pcxx = x.PCXX; //抢修记录
            this.zyxxx = x.ZYXXX; //运行记录
            this.bzxx = x.BZXX; //备注信息
            this.db = true;
          });
        });
    },
    shouqi() {
      this.db = false;
    }
  } //分页-每页条数
};
</script>

<style scoped>
.zheZhao {
  width: 1660px;
  height: 900px;
  position: absolute;
  top: 0;
}
.shootBox {
  width: 600px;
  height: 340px;
  border: solid 1px #ccc;
  position: absolute;
  top: 300px;
  left: 700px;
  margin: auto;
  background: #000;
  color: #fff;
}
.el-form-item__content {
  margin: 0;
}
.el-form-item__label {
  width: 100px;
}
.shootDesc {
  width: 450px;
}
.touble-pai {
  height: 240px;
}
.gzStyle {
  /* display: flex; */
}
.shootTime {
  width: 450px;
}
.touble-btn {
  width: 100%;
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
.el-selectG {
  margin-left: 0;
  width: 110px;
}
</style>
