<template>
	<div class="back-end-manage-index">
    <!-- 头部组件 -->
    <top-header></top-header>
    <!-- 侧边栏组件 -->
    <left-sidebar></left-sidebar>
    <section class="right-content" :class="{isHiddenSidebal: $store.state.isHiddenSidebar }">
      <!-- 内容区域 -->
      <router-view :key="$route.query.dateTamp"></router-view>
    </section>
	</div>
</template>

<script>
  import leftSidebar from "@/views/leftSidebar/Sidebar.vue";
  import topHeader from "@/views/header/Header.vue";
  export default {
    name: "index",
    data () {
      return {
      };
    },
    components: {
      leftSidebar,
      topHeader,
    },
    computed: {},
    props: {},
    created: function() {
    },
    methods: {
    },
  };
</script>

<style scoped lang="less">
  .back-end-manage-index {
    height: 100%;
    // 右侧内容展示区域
    .right-content {
      position: absolute;
      left: 200px;
      right: 0px;
      top: 46px;
      padding: 10px;
      bottom: 0px;
      overflow: auto;
      box-sizing: border-box;
      background: none repeat scroll 0 0 #f0f0f0;
      -webkit-transition: left .3s ease-in-out;
      transition: left .3s ease-in-out;
    }
    .isHiddenSidebal {
      left: 65px;
    }
  }
</style>

<!-- 引入基础样式和自定义全局样式 -->
<style lang="less">
  @import '../common/styles/X-element-ui.less';
  @import '../common/styles/base.less';
  @import '../common/styles/tool.less';
  @import '../styles/app.less';
</style>

