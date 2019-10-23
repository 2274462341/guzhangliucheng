<template>
  <div class="ongoing">
    <ul class="tab-tilte">
      <li @click="curd(0)" :class="{active:cur==0}">
        通知中
        <b v-if="flag">
          (
          <span @change="informSpan">{{inform}}</span>)
        </b>
      </li>
      <li @click="curd(1)" :class="{active:cur==1}">
        排查中
        <b v-if="flag">
          (
          <span>{{shoot}}</span>)
        </b>
      </li>
      <li @click="curd(2)" :class="{active:cur==2}">
        转抢修
        <b v-if="flag">
          (
          <span @change="rapairSpan">{{repair}}</span>)
        </b>
      </li>
      <li @click="curd(3)" :class="{active:cur==3}">
        开工
        <b v-if="flag">
          (
          <span>{{start}}</span>)
        </b>
      </li>
      <li @click="curd(4)" :class="{active:cur==4}">
        完工
        <b v-if="flag">
          (
          <span>{{out}}</span>)
        </b>
      </li>
      <li @click="curd(5)" :class="{active:cur==5}">
        转运行
        <b v-if="flag">
          (
          <span>{{run}}</span>)
        </b>
      </li>
    </ul>

    <div class="tab-content">
      <div v-show="cur==0">
        <Inform></Inform>
      </div>
      <div v-show="cur==1">
        <Shoot :tableData="tableData"></Shoot>
      </div>
      <div v-show="cur==2">
        <Repair :tableData="tableData"></Repair>
      </div>
      <div v-show="cur==3">
        <Start :tableData="tableData"></Start>
      </div>
      <div v-show="cur==4">
        <Out :tableData="tableData"></Out>
      </div>
      <div v-show="cur==5">
        <Run :tableData="tableData"></Run>
      </div>
    </div>
  </div>
</template>
)
<script>
import Inform from "../components/popout/Inform";
import Shoot from "../components/popout/Shoot";
import Repair from "../components/popout/Repair";
import Start from "../components/popout/Start";
import Out from "../components/popout/Out";
import Run from "../components/popout/Run";
import "../assets/css/ongoing.css";
import "../assets/css/main.css";

export default {
  name: "",
  data() {
    return {
      el: "#app",
      cur: 0,
      value: "",
      list1: [
        { id: 1, title: "通知中" },
        { id: 2, title: "排查中" },
        { id: 3, title: "转抢修" },
        { id: 4, title: "开工" },
        { id: 5, title: "完工" },
        { id: 6, title: "转运行" }
      ],
      inform: "",
      shoot: "",
      repair: "",
      start: "",
      out: "",
      run: "",
      flag: true,
      tableData: []
    };
  },
  mounted() {
    this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
      this.tableData = res.data.data;
      this.inform = this.tableData.length;
    });
    this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
      this.tableData = res.data.data;
      this.shoot = this.tableData.length;
    });
    this.$axios.post("api/info/web/kgetQXZQXList").then(res => {
      this.tableData = res.data.data;
      this.repair = this.tableData.length;
    });
    this.$axios.post("api/info/web/kgetQXKGList").then(res => {
      this.tableData = res.data.data;
      this.start = this.tableData.length;
    });
    this.$axios.post("api/info/web/kgetQXWGList").then(res => {
      this.tableData = res.data.data;
      this.out = this.tableData.length;
    });
    this.$axios.post("api/info/web/kgetQXZYXList").then(res => {
      this.tableData = res.data.data;
      this.run = this.tableData.length;
    });
  },
  methods: {
    curd(ver) {
      this.cur = ver;
      if (ver === 0) {
        this.$axios.post("api/info/web/kgetQXTZZList").then(res => {
          this.tableData = res.data.data;
          this.inform = this.tableData.length;
        });
      } else if (ver === 1) {
        this.$axios.post("api/info/web/kgetQXPCZList").then(res => {
          this.tableData = res.data.data;
        });
      } else if (ver === 2) {
        this.$axios.post("api/info/web/kgetQXZQXList").then(res => {
          this.tableData = res.data.data;
        });
      } else if (ver === 3) {
        this.$axios.post("api/info/web/kgetQXKGList").then(res => {
          this.tableData = res.data.data;
        });
      } else if (ver === 4) {
        this.$axios.post("api/info/web/kgetQXWGList").then(res => {
          this.tableData = res.data.data;
        });
      } else if (ver === 5) {
        this.$axios.post("api/info/web/kgetQXZYXList").then(res => {
          this.tableData = res.data.data;
        });
      }
    },
    informSpan() {
      if (this.inform == 0) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    rapairSpan() {
      if (this.repair == 0) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    }
  },
  components: {
    Inform,
    Shoot,
    Repair,
    Start,
    Out,
    Run
  }
};
</script>

<style scoped>
.tab-tilte {
  width: 700px;
  display: flex;
  margin-left: 58%;
  margin-top: 10px;
}

.tab-tilte li {
  width: 110px;
  height: 30px;
  border-radius: 20px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: center;
  margin: 0 10px;
}

/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active {
  background-color: #ccc;
  color: #fff;
}
.el-form-item__content {
  margin: 0px;
}
</style>
