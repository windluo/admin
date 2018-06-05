import axios from 'axios'
import domain from './domain'
import Vue from 'vue'
import Qs from 'qs'
Vue.prototype.$axios = axios;
import { Message } from 'element-ui'
const $message = Message

axios.interceptors.request.use(config => {
  return config
}, error => Promise.reject(error))

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

// 用来判断是否需要这里默认的提示语 默认true, 使用默认的不需要传true, 不使用false
let msgTip = true;

function checkStatus(response) {
  if (response == undefined) {
    // 中断链接请求，不做任何处理
    return
  }
  if (response && (response.status === 200 || response.status === 304)) {
    return response
  }
  let errRes = {
    code: 'error',
    msg: (response && response.statusText) || domain.errMsg,
    data: (response && response.data) || domain.errMsg
  }
  if (msgTip === true) {
    // 网络异常处理
    $message({
      message: errRes.msg,
      type: 'error'
    })
  }
  return Promise.reject(errRes);
}

function checkCode(res) {
  // 返回有数据成功的提示语
  if (msgTip === true && !(['0', 'OK'].some(el => el === res.data.code))) {
    $message({
      message: res.data.msg,
      type: 'error'
    })
  }
  return res.data
}

// 登录页本地登录信息存储形式
// let loginMsg = {
//   loginId: resData.data.loginId,
//   sessionId: resData.data.sessionId,
//   userName: resData.data.userName,
//   refreshKey: resData.data.refreshKey,
// };
// sessionStorage.setItem('loginMsg', JSON.stringify(loginMsg));
// 获取本地登录信息的函数
function getLoginMsg () {
  let loginMsg = sessionStorage.getItem('loginMsg');
  if (loginMsg) {
    return JSON.parse(loginMsg);
  } else {
    return {};
  }
}

export default {
  /*
    url 请求地址
    data 请求数据
    cancelToken 取消ajax请求标识
    flag 是否需要用到默认的提示语, 传入false不用到, 自定义
  */
  post(url, data, cancelToken, flag = true) {
    msgTip = flag;
    // 统一配置入参
    // console.log(getLoginMsg());
    // if (sessionStorage.getItem('loginMsg')) {
    //   data.loginId = getLoginMsg().loginId;
    //   data.sessionId = getLoginMsg().sessionId;
    // }
    return axios({
      method: 'post',
      url: url,
      data: Qs.stringify(data),
      timeout: domain.timeout,
      cancelToken: cancelToken
    }).then(checkStatus).then(checkCode)
  },
  postWithFile(url, data, cancelToken, flag = true) {
    msgTip = flag;
    // 统一配置入参
    // console.log(getLoginMsg());
    return axios({
      method: 'post',
      url: url,
      data,
      timeout: domain.timeout,
      cancelToken: cancelToken,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(checkStatus).then(checkCode)
  },
  get(url, params, cancelToken, flag = true) {
    // 统一配置入参
    // console.log(getLoginMsg());
    // if (sessionStorage.getItem('loginMsg')) {
    //   params.loginId = getLoginMsg().loginId;
    //   params.sessionId = getLoginMsg().sessionId;
    // }
    msgTip = flag;
    return axios({
      method: 'get',
      url: url,
      params,
      cancelToken: cancelToken,
      timeout: domain.timeout
    }).then(checkStatus).then(checkCode)
  }
}
