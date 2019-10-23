<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin:0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  cursor: pointer;
}
.el-button.is-round {
    padding:0;
}
.el-form-item__content {
  margin: 0px;
}
.el-form-item__label{
  width:100px;
}
/* .el-input__inner{
  height: 120px;
  width:80%;
} */

</style>
