// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

// 路由
import router from './router';

// 全局 vuex
import store from './store';

// 引入axios配置
import './common/js/_axios';
import ActionCreator from '@/common/js/ActionCreator'
window._actionCreator = ActionCreator

// 引入element-ui组件
import "./common/js/importElementUi.js";

// import 'element-ui/lib/theme-chalk/index.css';

// 混入相关周期和方法
import "./common/js/vueMixin.js";

window.$App = new Vue({
  el: '#app',
  router,
  store,
  render: r => r(App),
}).$mount('#app');
