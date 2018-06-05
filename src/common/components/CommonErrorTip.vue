<template>
  <div>
    <!-- 没有数据提示 -->
    <div v-show="loadCode == loadStatus.code_noData" class="no-data-tip">
      您好，没有查询到数据，请刷新或者重新输入查询条件！
    </div>
    <div v-show="loadCode == loadStatus.code_err" class="no-data-tip net-error-tip">
      您好，网络异常，请刷新重试！
    </div>
  </div>
</template>

<script>
  // 引入常量类
  import { loadStatus } from '@/common/js/constant.js'
  export default {
    name: 'common-error-tip',
    data () {
      return {
        loadStatus: loadStatus,
      }
    },
    props: {
      loadCode: {
        type: Number,
        default: loadStatus.code_init,
      },
    },
  };
</script>
