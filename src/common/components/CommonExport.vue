<template>
  <div class="common-export">
    <el-button type="info" @click="download">导出</el-button>
  </div>
</template>
<script>
import domain from '../js/domain'
export default {
  name: 'common-export',
  props: {
    url: {type: String, default: '', required: true}, // 导出文件的请求链接
    params: {type: Object, default: () => { return {} }}, // 请求参数
  },
  data () {
    return {
      source: ''
    }
  },
  created () {
    this.source = this.$axios.CancelToken.source() 
  },
  methods: {
    download () {
      if (!this.url) return
      let url = domain.domain_system + this.url
      this.$axios.get(url, {params: this.params, responseType: 'blob'}, this.source.token)
				.then(res => {
          let export_blob
          if (!res.data) return false
          // let resFile = '\uFEFF' + res.data
          let nameStr = res.headers['content-type']
          let beginIndex = nameStr.indexOf('name=')
          let endIndex = nameStr.indexOf(';', beginIndex)
          let resFile = res.data
          let fileName = nameStr.slice(beginIndex + 5, endIndex) + '.xls';
          try {
            export_blob = new Blob([resFile], {type: 'application/vnd.ms-excel;'})
          } catch (e) {
            alert('您的浏览器版本过低, 暂不支持下载, 请升级您的浏览器!')
          }
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(resFile, fileName)
          } else {
            let urlObject = window.URL || window.webkitURL || window
            let a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            a.href = urlObject.createObjectURL(resFile)
            a.download = fileName
            let ev = document.createEvent('MouseEvents')
            ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(ev)
						urlObject.revokeObjectURL(a.href)
					}
				})
		},
  }
}
</script>
<style lang="less" scoped>
.common-export{
  display: inline-block;
  margin-left: 10px;
}
</style>
