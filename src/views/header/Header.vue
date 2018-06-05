<template>
  <div class="header">
    <div class="collapse-btn" @click="sidebarCollapseChage">
      <img src="../../common/images/zhaocaimao_logo.png" alt="">
    </div>
    <div class="logo">管理后台</div>
    <div class="user-info">
      {{ userName }}，欢迎您<span class="split-line">|</span>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          退出
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    name: "top-header",
    data () {
      return {
        userName: '',
      }
    },
    mounted () {
      this.userName = sessionStorage.getItem('userName');
    },
    methods:{
      handleCommand(command) {
        if(command == 'loginout'){
          sessionStorage.removeItem('loginMsg');
          sessionStorage.removeItem('loadMenuList');
          this.toLink('/login');
        }
      },
      sidebarCollapseChage(){
        this.$store.state.isHiddenSidebar = !this.$store.state.isHiddenSidebar;
      }
    }
  }
</script>

<style scoped lang="less">
  .header {
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    font-size: 18px;
    line-height: 46px;
    color: #fff;
  }
  // 切换图标
  .collapse-btn{
    float: left;
    padding: 0 10px 0 20px;
    cursor: pointer;
    height: 46px;
    img {
      height: 40px;
      margin-top: 2px;
    }
  }
  .collapse-btn:hover{
    // background: rgb(40,52,70);
  }
  .header .logo{
    float: left;
    font-weight: 500;
    color: #6F6C68;
  }
  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 12px;
    color: #6F6C68;
    .el-dropdown {
      vertical-align: top;
    }
  }
  .user-info .el-dropdown-link{
    position: relative;
    display: inline-block;
    // padding-left: 40px;
    font-size: 12px;
    color: #6F6C68;
    cursor: pointer;
    vertical-align: top;
  }
  .split-line {
    font-size: 12px;
    padding: 0 10px;
  }
  .user-info .user-logo{
    position: absolute;
    left: 0;
    top: 7px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
  .el-dropdown-menu__item{
      text-align: center;
  }
</style>
