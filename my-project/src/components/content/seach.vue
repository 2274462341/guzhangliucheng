<template>
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
</template>

<script>
export default {
  name: "",
  data() {
    return {
      options: [
        {
          value: "所属战线",
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
    };
  },
  methods: {
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
          console.log(res.data.data);
          this.tableData = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    value1change(value) {
      if (value == "") {
        value = "";
      } else {
        this.value1 = value;
        console.log(value);
      }
    },
    value2change(value) {
      if (value == "") {
        value = "";
      } else {
        this.value2 = value;
        console.log(value);
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
    }
  }
};
</script>

<style scoped>
</style>
