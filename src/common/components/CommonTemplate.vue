<template>
  <div v-loading="$store.state.loading"
    :class="{commonTempleteModelOne: styleSelect == '1', commonTempleteModelTwo: styleSelect == '2'}"
    element-loading-background="rgba(0, 0, 0, 0.01)"
    element-loading-spinner="el-icon-loading">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "common-template",
  data () {
    return {
      // 默认基础模板样式
      styleSelect: '1',
    }
  },
  created: function () {
    // 设置对应的全局模板样式
    if (['roleData'].some(el => el == this.$route.name)) {
      this.styleSelect = '2'
    }
  },
};
</script>

<style scoped lang="less">
  // 对应this.styleSelect === '1' 的样式
  .commonTempleteModelOne {
    min-width: 1000px;
    min-height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
  // 特殊的需要自动撑开的模板不需要最小1000出现滚动条, 另一种样式风格
  // 对应this.styleSelect === '2' 的样式
  .commonTempleteModelTwo {
    height: 100%;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
  }
</style>
