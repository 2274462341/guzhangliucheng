<template>
  <el-container>
    <el-header>故障跳闸任务记录</el-header>
    <el-container>
      <el-aside width="200px">
        <div class="aside-management">
          <router-link to="/tripManagement" tag="p">跳闸抢修管理</router-link>
          <router-link to="/mistakeManagement" tag="p">误报管理</router-link>
          <p @click="showBtn">抢修任务管理</p>
          
        </div>
        <div class="router-task" v-if="flag">
          <router-link
            v-for="(item,index) in arr"
            :key="index"
            :to="item.path"
            tag="li"
          >{{item.title}}</router-link>
        </div>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import "../assets/css/home.css";

export default {
  name: "",
  data() {
    return {
      flag:true,
      arr: [
        { path: "/ongoingTask", title: "进行中任务" },
        { path: "/archivingTask", title: "已归档任务" },
        { path: "/removeTask", title: "已删除任务" }
      ],
      activeIndex: -1
    };
  },
  methods: {
    showBtn(){
      this.flag =!this.flag;
    }
  },
};
</script>

<style scoped>
.router-link-active{
    font-weight: bold;
  }

</style>
