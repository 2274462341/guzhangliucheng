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
    <el-table
      :data="Misstatementlist.slice((currentPage-1)*pagesize, currentPage*pagesize)"
      style="width: 100%;height:760px;"
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
      <el-table-column prop="QRWBSJ" label="确认误报时间"></el-table-column>
      <el-table-column prop="SFHF" label="是否恢复"></el-table-column>
      <el-table-column prop="HFSJ" label="恢复时间"></el-table-column>
      <el-table-column prop="BZ" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span size="mini" @click="handleMis(scope.$index, scope.row)">取消误报</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-left:30%;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="sizes, prev, pager, next"
        :page-sizes="[2, 5, 10, 20]"
        :total="data.length"
      ></el-pagination>
    </div>
    <div class="zheZhao" v-if="dialogVisible">
      <div class="false-positives" v-if="fpfalg">
        <p>确定取消误报？</p>
        <button @click="fpcancel">取消</button>
        <button @click="fpDetermine">确定</button>
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
      dialogVisible: false,
      input: "",
      value1: "",
      value2: "",
      Misstatementlist: [],
      fpfalg: false,
      TripID: "",
      search: "",
      changes: "",
      screen: "",
      currentPage: 1,
      pagesize: 5,
      data: ""
    };
  },
  methods: {
    handleMis(index, row) {
      this.TripID = row.TZID;
      this.fpfalg = true;
      this.dialogVisible = true;
    },
    fpcancel() {
      this.fpfalg = false;
      this.dialogVisible = false;
    },
    fpDetermine() {
      this.fpfalg = false;
      this.dialogVisible = false;

      this.$axios
        .post(
          "api/info/web/zdealWb",
          { tzgl_id: this.TripID, type: "2" },
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
          this.$axios
            .post("api/info/web/kgetTzwbList", {
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded"
              },
              transformRequest: [
                function(data) {
                  return Qs.stringify(data);
                  this.TripList = res.data.data;
                }
              ]
            })
            .then(res => {
              this.Misstatementlist = res.data.data;
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
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
          "api/info/web/kgetTzwbList",
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
          this.Misstatementlist = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
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
    }
  },
  mounted() {
    this.$axios
      .post("api/info/web/kgetTzwbList", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        transformRequest: [
          function(data) {
            return Qs.stringify(data);
          }
        ]
      })
      .then(res => {
        this.Misstatementlist = res.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
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
.el-input {
  width: 217px;
}
.element-top {
  display: flex;
}
.el-select {
  margin-left: 200px;
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
.false-positives {
  width: 500px;
  height: 200px;
  background: #000;
  position: relative;
  position: fixed;
  left: 40%;
  top: 25%;
}
.false-positives button {
  background: #999999;
  outline: none;
}
.false-positives button:nth-child(2) {
  border: 0;
  height: 50px;
  width: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.false-positives button:nth-child(3) {
  border: 0;
  height: 50px;
  width: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.false-positives p {
  color: #fff;
  text-align: center;
  height: 150px;
  line-height: 150px;
}
</style>
