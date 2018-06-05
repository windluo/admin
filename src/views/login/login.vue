<template>
  <div class="login-wrap" v-loading.fullscreen="loading"
    element-loading-background="rgba(0, 0, 0, 0.05)"
    element-loading-spinner="el-icon-loading">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入您的名字?"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="pwdType" placeholder="请输入您的密码?" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" @focus="pwdType='password'"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  // 引入本地菜单列表, 仿照后台字段制造, 在登录时获取菜单列表
  // import Menu from '../data/menu.json';
  // 引入请求
  let [ actionSystemAccountKey, actionSystemAccountLogin ] = _actionCreator.init(['accountKey', 'accountLogin']);
  import { loadStatus } from '@/common/js/constant.js';
  import sha256 from 'crypto-js/sha256';
  import hmacMD5 from 'crypto-js/hmac-md5';
  import Qs from 'qs';
  // console.log(sha256('654321').toString().toLocaleUpperCase())

  export default {
    name: "login",
    data: function() {
      return {
        pwdType: 'text',
        ruleForm: {
          userName: '',
          password: '',
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        // 每次请求秘钥的唯一标识, 时间cuo
        timestamp: '',
        secretKey: '',
        // 99 初始值 10 发起请求时, 20请求成功有数据时, 40 没有数据, 80报错时
        loadCode: loadStatus.code_init,
        loading: false,
        // 取消请求参数
        source: '',
      }
    },
    created () {
      // 初始化
      this.init();
    },
    methods: {
      // 取消请求测试按钮
      cancelAxios () {
        this.source.cancel('Operation canceled by the user.');
      },
      init () {
        // 取消请求
        this.source = this.$axios.CancelToken.source();
        this.timestamp = Date.now();
        let data = {
          clientSn: this.timestamp,
          // time: new Date().getTime(),
        };
        // 获取秘钥
        actionSystemAccountKey(data, this.source.token, false).then(res => {
          let resData = res;
          if (resData.code == '0') {
            this.secretKey = resData.data;
          } else {
            this.toastMsg('您好, 获取登录信息失败, 请刷新重试!', 'warning');
          }
        }, err => {
          this.toastMsg('您好, 获取登录信息失败, 请刷新重试!', 'warning');
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 密码加密处理
            let hashDigest = sha256(this.ruleForm.password).toString().toLocaleUpperCase();
            let hmacMd5Str = hmacMD5(hashDigest, this.secretKey).toString();
            // console.log('加密后: ', hmacMd5Str);
            let data = {
              clientSn: this.timestamp,
              userName: this.ruleForm.userName,
              password: hmacMd5Str,
            };
            this.loading = true;
            // 账户登录
            actionSystemAccountLogin(data).then(res => {
              this.loading = false;
              let resData = res.data;
              // 如果返回状态码是0且返回菜单列表存在, 则表示登录成功
              if (res.code == '0' && resData.otherInfo && resData.otherInfo.menuData) {
                // 获取登录信息
                let loginMsg = {
                  loginId: resData.loginId,
                  sessionId: resData.sessionId,
                  userName: resData.userName,
                  refreshKey: resData.refreshKey,
                };
                // 保存该用户菜目录以及登录信息到本地
                sessionStorage.setItem('loginMsg', JSON.stringify(loginMsg));
                sessionStorage.setItem('userName', resData.userName);
                // 存菜单目录到本地
                sessionStorage.setItem('loadMenuList', JSON.stringify(resData.otherInfo.menuData[0].nodes));
                // sessionStorage.setItem('loadMenuList', JSON.stringify(Menu));
                window.location.href = window.location.origin + window.location.pathname;
              } else {
                this.loading = false;
                sessionStorage.removeItem('loginMsg');
                sessionStorage.removeItem('loadMenuList');
                // this.toastMsg('您好, 登录失败, 请重试!');
              }
            }, err => {
              this.loading = false;
              sessionStorage.removeItem('loginMsg');
              sessionStorage.removeItem('loadMenuList');
              // this.toastMsg('您好, 登录失败, 请检查网络是否正确!');
            });
          } else {
            this.toastMsg('您好, 请检查输入信息是否正确!');
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background-color: #324157;
    background: url('../../common/images/background_login.png') no-repeat;
    background-size: 100% 100%;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>

<style lang="less">
  .login-wrap {
    .el-input__inner{
      height: 36px;
      line-height: 36px;
      padding-right: 10px;
      padding-left: 10px;
    }

    .el-form-item__content{
      line-height: 36px;
    }

    .el-input__icon{
      line-height: 36px;
    }

    .el-form-item__label{
      line-height: 36px;
      // color: #aaa;
    }
  }
</style>

<!-- 引入基础样式和自定义全局样式 -->
<style lang="less">
  @import '../../common/styles/X-element-ui.less';
  @import '../../common/styles/base.less';
  @import '../../common/styles/tool.less';
  @import '../../styles/app.less';
</style>
