<template>
  <div class="remove">
    <div class="element-top">
      <el-select v-model="search" placeholder="搜索字段" class="search" @change="searchchang">
        <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
      </el-select>
      <el-input placeholder="关键字" v-model="screen" slot=" " style="width:200px" clearable></el-input>
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
      <el-button type="primary" icon="el-icon-search" @click="searchclick">搜索</el-button>
    </div>
    <div class="alldata">
      <el-table
        :data="tableData.slice((currpage-1)*pagesize,currpage*pagesize)"
        style="width: 100%;color:#33333;height:760px"
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
        <el-table-column prop="SCYY" label="删除原因"></el-table-column>
        <el-table-column prop="BZ" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span size="mini" type="danger" @click="removeDelete(scope.row)">恢复任务</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-block">
        <!-- <span class="demonstration">直接前往</span> -->
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
      <div class="delete" v-if="remove">
        <h4>删除</h4>
        <p style="margin:5px 40px;">是否确认恢复该任务</p>
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
          <el-button
            style="padding:0;width:49%;margin:0;background:#999999;border:none;height:40px;"
            @click="redOut"
          >取消</el-button>
          <el-button
            style="padding:0;width:50%;margin:0;background:#999999;border:none;height:40px;"
            @click="trues"
          >确认</el-button>
        </div>
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
)
<script>
import "../assets/css/ongoing.css";
import "../assets/css/main.css";
import Qs from "qs";
export default {
  name: "",
  data() {
    return {
      remove: false,
      dialogVisible: false,
      textareaSc: "",
      flag: false,
      currpage: 1,
      pagesize: 5,
      db: false,
      options: [
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

      search: "",
      value1: "",
      value2: "",
      changes: "",
      screen: "",
      list: [],
      options2: [],
      loading: false,
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
      shanId: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [],
      tzxx: "", //任务详情
      qxxx: "", //排查记录
      pcxx: "", //抢修记录
      zyxxx: "", //运行记录
      bzxx: "" //备注信息
    };
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  },
  created() {
    this.$axios.post("api/info/web/kgetTaskDelList").then(res => {
      this.tableData = res.data.data;
    });
  },
  methods: {
    //分页-每页条数
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //当前页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
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
    removeDelete(row) {
      this.shanId = row.RWID;
      this.remove = true;
      this.dialogVisible = true;
    },
    //恢复删除
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
            type: 2,
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
          this.$axios.post("api/info/web/kgetTaskDelList").then(res => {
            this.tableData = res.data.data;
          });
        });
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
    },
    redOut() {
      this.remove = false;
      this.dialogVisible = false;
    },
    openOut() {
      this.flag = false;
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
</style>
