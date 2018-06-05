import Vue from 'vue';

import Router from 'vue-router';

import axios from 'axios';

import Qs from 'qs';

// 引入转驼峰命名的方法
import { transferMenuCodeToPath } from '@/common/js/filters.js';

// 一级菜单模板承载页, 如果一级菜单是直接的页面, 需要参考该模板的一些样式设置
import Template from '@/common/components/CommonTemplate.vue';

Vue.use(Router);

// 登录页
const login = resolve => require.ensure([], () => {resolve(require('@/views/login/login'))}, 'login');

// 承载主页
const index = resolve => require.ensure([], () => {resolve(require('@/views/index'))}, 'index');

// 引入所有菜单栏组件
import vueComponent from './config/importMenuItem.js';

// 测试demo及他的路由配置
import test from './test/test.js';

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

let route = [];

// 获取登录之后的菜单列表
try {
  if (sessionStorage.getItem('loginMsg') && sessionStorage.getItem('loadMenuList')) {
    let data = {
      loginId: getLoginMsg().loginId,
      sessionId: getLoginMsg().sessionId,
      userName: getLoginMsg().userName,
      refreshKey: getLoginMsg().refreshKey,
    };
    // 获取菜单栏数据, 根据后台返回参数动态生成路由
    let routeList = window.JSON.parse(sessionStorage.getItem('loadMenuList'));
    // routeItem为以及路由下面的子项 twoRouteChildren二级子路由列表 twoRouteChild 二级子路由某项 threeRouteChildren三级子路由列表 threeRouteChild三级路由某项
    let routeItem, twoRouteChildren, twoRouteChild, threeRouteChildren, threeRouteChild;
    routeList.forEach((item, index) => {
      routeItem = route[index] = {};
      routeItem.path = `/${transferMenuCodeToPath(item.menuCode)}`;
      // 判断是否有二级菜单
      if (item.nodes.length > 0) {
        // 设置二级菜单的公共组件
        routeItem.component = Template;
        // 设置二级子菜单
        twoRouteChildren = routeItem.children = [];
        item.nodes.forEach((child, count) => {
          twoRouteChild = twoRouteChildren[count] = {};
          twoRouteChild.path = transferMenuCodeToPath(child.menuCode);
          twoRouteChild.name = transferMenuCodeToPath(child.menuCode);
          // 如果没有三级菜单则点击时加载当前菜单对应的组件
          if (child.nodes.length <= 0) {
            twoRouteChild.component = vueComponent[transferMenuCodeToPath(child.menuCode)];
          } else {
            // 设置三级子菜单
            threeRouteChildren = twoRouteChild.children = [];
            child.nodes.forEach((threeItem, threeIndex) => {
              threeRouteChild = threeRouteChildren[threeIndex] = {};
              threeRouteChild.path = transferMenuCodeToPath(threeItem.menuCode);
              threeRouteChild.name = transferMenuCodeToPath(threeItem.menuCode);
            });
            // 如果没有四级子菜单直接加载当前三级菜单内容
            if (threeItem.nodes.length <= 0) {
              threeRouteChild.component = vueComponent[transferMenuCodeToPath(threeItem.menuCode)];
            }
          }
        });
      } else {
        // 如果没有二级菜单直接加载当前配置的菜单
        routeItem.component = vueComponent[transferMenuCodeToPath(item.menuCode)];
      }
    });
  }
} catch (e) {
  console.log(e);
}

let routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta:{
      title: "登录页",
    },
  },
  {
    path: '/',
    component: index,
    meta: {
      title: "管理首页",
    },
    // redirect: '',
    children: [
      // 加上测试案例路由
      ...route.concat(test),
    ],
  },
];

let routerApi = new Router({ routes });

// 每次跳转前验证登录
routerApi.beforeEach((to, from, next) => {
  if (to.name != 'login' && !window.sessionStorage.getItem('loginMsg')) {
    next('/login');
  } else {
    next();
  }
})

export default routerApi;
