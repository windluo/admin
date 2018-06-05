<template>
  <div class="params-manage-index">
    <div class="pm-item" v-show="detailType!=2">
      <params-manage @getDetailType="getDetailType"></params-manage>
    </div>
    <div class="pm-item" v-show="detailType==2">
      <params-manage-detail
        :current-param-type="detailType"
        :current-param="currentData"
        @getDetailType="getDetailTypeDetail">
      </params-manage-detail>
    </div>
  </div>
</template>

<script>
import ParamsManage from './ParamsManage'
import ParamsManageDetail from './ParamsManageDetail'
export default {
  name: 'params-manage-index',
  data () {
    return{
      currentData: {},
      detailType: 1, // 2:数组参数，要去数组列表，非数组类型随便复制（目前只有1、3两种）
    }
  },

  components: {
    'params-manage': ParamsManage,
    'params-manage-detail': ParamsManageDetail,
  },

  beforeRouteLeave (to, from, next) {
    // 离开页面前，终端ajax请求
    sessionStorage.removeItem('paramsManage')
		next()
  },

  mounted () {
    this.$nextTick(() => {
      let currentPD = sessionStorage.getItem('paramsManage')
      if (currentPD) {
        this.currentData = JSON.parse(currentPD)
        this.detailType = this.currentData.paramType
      }
    })
  },
  
  methods: {
    getDetailType (data) {
      this.currentData = data
			sessionStorage.setItem('paramsManage', JSON.stringify(data))
      this.detailType = data.paramType
    },

    getDetailTypeDetail (type) {
      sessionStorage.removeItem('paramsManage')
      this.detailType = type
    },
  }
}
</script>
