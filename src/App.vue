<template>
  <div id="app" class="mainView">
    <router-view/>
  </div>
</template>

<script>
  // 引入原型扩展方法
  import '@/common/js/extend_proto.js';
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    created: function () {
    },
    methods: {
    },
    watch: {
    },
  }
</script>
