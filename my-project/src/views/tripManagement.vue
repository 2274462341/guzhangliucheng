<template>
  <div class="tripManagement">
    <div class="element-top">
      <el-select v-model="search" placeholder="搜索字段" class="search" @change="searchchang">
        <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
      </el-select>
      <el-input placeholder="关键字" class="top-input" v-model="screen" slot=" " clearable></el-input>
      <span class="demonstration">跳闸时间</span>
      <el-date-picker
        v-model="value1"
        type="date"
        value-format="yyyy/MM/dd"
        @change="value1change"
        placeholder="选择日期"
      ></el-date-picker>
      <span class="time">至</span>
      <el-date-picker
        v-model="value2"
        type="date"
        value-format="yyyy/MM/dd"
        @change="value2change"
        placeholder="选择日期"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="searchclick">搜索</el-button>
    </div>
    <el-table
      :data="TripList.slice((currentPage-1)*pagesize, currentPage*pagesize)"
      style="width: 100%;height:760px;"
      @cell-dblclick="tableDbEdit"
      :row-class-name="celcolor"
    >
      <el-table-column prop="ZXLX" label="序号" width="180">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="SSZX" label="所属站线" width="180"></el-table-column>
      <el-table-column prop="DYDJ" label="电压等级"></el-table-column>
      <el-table-column prop="TZSB" label="跳闸设备"></el-table-column>
      <el-table-column prop="TZSJ" label="跳闸时间"></el-table-column>
      <el-table-column prop="SFHF" label="是否恢复"></el-table-column>
      <el-table-column prop="HFSJ" label="恢复时间"></el-table-column>
      <el-table-column prop="BZ" label="备注"></el-table-column>
      <el-table-column prop="GLRWSL" label="关联任务数量"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span size="mini" @click="handleEdit(scope.$index, scope.row,scope.$id)">备注</span>
          <span size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">新建任务</span>
          <span size="mini" @click="handleMis(scope.$index, scope.row)">误报</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="Management-paging" style="margin-left:30%;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="sizes, prev, pager, next"
        :page-sizes="[2, 5, 10, 20]"
        :total="TripList.length"
      ></el-pagination>
    </div>

    <!--详情弹框-->
    <div class="Tripping-details" v-if="Trippingfflag">
      <div class="Tripping-left">
        <span class="Tripping-span" @click="Trip">></span>
      </div>
      <div class="Tripping-right">
        <p class="Tripping-p">跳闸详情</p>
        <ul class="Tripping-ul">
          <li>所属战线：{{TrippingDetails.SSZX}}</li>
          <li>电压等级：{{TrippingDetails.DYDJ}}</li>
          <li>跳闸设备：{{TrippingDetails.TZSB}}</li>
          <li>设备电压等级：{{TrippingDetails.SBDYDJ}}</li>
          <li>跳闸时间：{{TrippingDetails.TZSJ}}</li>
          <li>是否恢复：{{TrippingDetails.SFHF}}</li>
          <li>恢复时间：{{TrippingDetails.HFSJ}}</li>
          <li>备注：{{TrippingDetails.BZ}}</li>
          <li>关联任务</li>
        </ul>
        <p class="Tripping-ptwo">
          <span>序号</span>
          <span>任务ID</span>
          <span>任务创建时间</span>
          <span>任务状态</span>
        </p>
        <div style="overflow-y:scroll;height:250px;">
          <p class="Tripping-ptwo Ttwo" v-for="(item,index) in TrippingDetails.GLRW" :key="index">
            <span>{{index+1}}</span>
            <span>{{item.RWID}}</span>
            <span>{{item.RWCJSJ}}</span>
            <span>{{item.RWZT}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="zheZhao" v-if="dialogVisible">
      <!--新建任务弹框-->
      <div class="New-task" v-if="flag">
        <p class="task-one">您已成功新建任务：</p>
        <p class="task-two">任务ID：{{TaskID}}</p>
        <button @click="confirm">确认</button>
      </div>
      <!-- 误报 -->
      <div class="False-positives" v-if="flags">
        <p class="positives">确认误报</p>
        <div class="buttonbox">
          <button @click="positivesone">取消</button>
          <button @click="positivestwo">确认</button>
        </div>
      </div>
      <!-- 备注 -->
      <div class="Remarks-box" v-if="Remarksflag">
        <p class="Remarks-boxp">编辑备注</p>
        <el-input type="textarea" :rows="3" placeholder="请输入内容" class="tank" v-model="RemarkBZ"></el-input>
        <div class="buttonbox">
          <button @click="Remarkone">取消</button>
          <button @click="Remarktwo">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import axios from "axios";
import Qs from "qs";
export default {
  name: "",
  data() {
    return {
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
      value: "",
      flag: false,
      flags: false,
      TripList: [],
      TripID: "",
      TaskID: "",
      textarea: "",
      Remarksflag: false,
      dialogVisible: false,
      RemarkBZ: "",
      Trippingfflag: false,
      TrippingDetails: [],
      value1: "",
      value2: "",
      search: "",
      screen: "",
      currentPage: 1,
      pagesize: 5,
      changes: "",
      newvalue1: "",
      newvalue2: "",
      functions: {
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
    };
  },
  components: {},
  methods: {
    handleEdit(index, row) {
      //备注
      this.Remarksflag = true;
      this.dialogVisible = true;
      this.RemarkBZ = row.BZ;
      this.TripID = row.OBJ_ID;
    },
    handleDelete(index, row) {
      //新建任务
      this.flag = true;
      this.dialogVisible = true;

      this.TripID = row.OBJ_ID;
      this.$axios
        .post(
          "api/info/web/zcreateRenwu",
          { tzgl_id: this.TripID },
          this.functions
        )
        .then(res => {
          this.TaskID = res.data.data;
          this.$axios
            .post("api/info/web/kgetTzglList", this.functions)
            .then(res => {
              this.TripList = res.data.data;
            })
            .catch(function(error) {});
        })
        .catch(function(error) {});
    },
    handleMis(index, row) {
      this.flags = true;
      this.dialogVisible = true;
      this.TripID = row.OBJ_ID;
    },
    //新建任务确认
    confirm() {
      this.flag = false;
      this.dialogVisible = false;
    },
    //误报
    positivesone() {
      this.flags = false;
      this.dialogVisible = false;
    },
    positivestwo() {
      this.$axios
        .post(
          "api/info/web/zdealWb",
          { tzgl_id: this.TripID, type: "1" },
          this.functions
        )
        .then(res => {
          this.$axios
            .post("api/info/web/kgetTzglList", this.functions)
            .then(res => {
              this.TripList = res.data.data;
            })
            .catch(function(error) {});
        })
        .catch(function(error) {});
      this.flags = false;
      this.dialogVisible = false;
    },
    //备注
    Remarkone() {
      this.Remarksflag = false;
      this.dialogVisible = false;
    },
    Remarktwo() {
      this.$axios
        .post(
          "api/info/web/zupdateTzglBz",
          {
            tzgl_id: this.TripID,
            bz: this.RemarkBZ
          },
          this.functions
        )
        .then(res => {
          this.Remarksflag = false;
          this.$axios
            .post("api/info/web/kgetTzglList", this.functions)
            .then(res => {
              this.TripList = res.data.data;
            })
            .catch(function(error) {});
        })
        .catch(function(error) {});
    },
    tableDbEdit(row, column, cell, event) {
      this.$axios
        .post(
          "api/info/web/zgetTzglDetail",
          {
            tzgl_id: row.OBJ_ID
          },
          this.functions
        )
        .then(res => {
          this.Trippingfflag = true;
          this.TrippingDetails = res.data.data;
        })
        .catch(function(error) {});
    },
    Trip() {
      this.Trippingfflag = false;
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
    searchclick() {
      this.$axios
        .post(
          "api/info/web/kgetTzglList",
          {
            type: this.changes,
            value: this.screen,
            starttime: this.value1,
            endtime: this.value2
          },
          this.functions
        )
        .then(res => {
          this.TripList = res.data.data;
        })
        .catch(function(error) {});
    },
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    value1change(value) {
      if (value == "") {
        value = "";
      } else {
      }
    },
    value2change(value) {
      if (value == "") {
        value = "";
      } else {
      }
    },
    celcolor(row) {
      if (row.number === 1 && this.isActive) {
        return "warning-row";
      } else {
        return "";
      }
    }
  },
  mounted() {
    this.$axios
      .post("api/info/web/kgetTzglList", this.functions)
      .then(res => {
        this.TripList = res.data.data;
      })
      .catch(function(error) {});
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
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.element-top {
  display: flex;
}
.search {
  margin-left: 200px;
}
.sel {
  width: 100px;
}
.inp {
  width: 150px;
}
.Projectin {
  display: flex;
  justify-content: space-around;
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
.el-main {
  position: relative;
}
.Tripping-details {
  width: 600px;
  height: 700px;
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  bottom: 65px;
  right: 0;
  display: flex;
  border: 1px solid #ccc;
}
.Tripping-left {
  width: 20px;
  height: 100%;
  background: #ccc;
}
.Tripping-right {
  margin-left: 20px;
  width: 550px;
}
.Tripping-ul li {
  height: 40px;
  line-height: 40px;
}
.Tripping-span {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 700px;
  text-align: center;
}
.Tripping-p {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
}
.Tripping-ptwo {
  width: 100%;
  display: flex;
}
.Tripping-ptwo span {
  display: block;
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: #ccc;
  margin-left: 10px;
}
.Tripping-ptwo span:nth-child(1) {
  width: 50px;
  margin-left: 0;
}
.Tripping-ptwo span:nth-child(2) {
  width: 180px;
}
.Tripping-ptwo span:nth-child(3) {
  width: 180px;
}
.Tripping-ptwo span:nth-child(4) {
  width: 100px;
}
.Ttwo {
  border-bottom: 1px solid #ccc;
}
.Ttwo span {
  background: #fff;
  margin-top: 10px;
}
.Ttwo span:nth-child(2) {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.New-task {
  width: 500px;
  height: 200px;
  background: #000;
  position: relative;
  position: fixed;
  left: 40%;
  top: 25%;
}

.New-task button {
  border: 0;
  height: 50px;
  width: 100%;
  position: absolute;
  bottom: 0;
  background: #999999;
  outline: none;
}
.task-one {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}
.task-two {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
}
.el-button {
  width: 90px;
  height: 40px;
}
.False-positives {
  width: 500px;
  height: 200px;
  background: #000;
  position: relative;
  position: fixed;
  left: 40%;
  top: 25%;
}
.False-positives button {
  border: 0;
  height: 50px;
  width: 50%;
  background: #999999;
  outline: none;
}
.positives {
  width: 100%;
  height: 150px;
  text-align: center;
  line-height: 150px;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}
.buttonbox button:nth-child(1) {
  position: absolute;
  left: 0;
  bottom: 0;
}
.buttonbox button:nth-child(2) {
  position: absolute;
  right: 0;
  bottom: 0;
}
.Remarks-box {
  width: 500px;
  height: 200px;
  background: #000;
  position: relative;
  position: fixed;
  left: 40%;
  top: 25%;
}
.Remarks-box button {
  border: 0;
  height: 50px;
  width: 50%;
  background: #999999;
  outline: none;
}
.Remarks-boxp {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  color: #fff;
}
.top-input {
  width: 200px;
}
.el-table .warning-row {
  background: #f00;
}
.RemarksAmendment {
  position: fixed;
  right: 0;
  bottom: 80px;
}
.tank {
  width: 80%;
  margin-left: 10%;
}
</style>
