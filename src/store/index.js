import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isHiddenSidebar: false, // 是否切换侧边栏
    loading: false, // 全屏加载效果
  },
  actions: {
  },
  mutations: {
  }
})
