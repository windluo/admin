import Vue from "vue";
import _forIn from "lodash/forIn"

Vue.mixin({
  methods: {
    // 跳转
    toLink (link) {
      let date = Date.now();
      this.$router.push({ path: link, query: {dateTamp: date} });
    },
    showNotify (invalidFields, title, type) {
      // success、warning、info、error
      let msg = ''
      _forIn(invalidFields, (value, key) => {
        msg += `<p>${value[0].message}</p>`
      })
      this.$notify.error({
        title: title,
        type: type,
        dangerouslyUseHTMLString: true,
        message: msg,
        showClose: false,
        duration: 3000,
        position: 'bottom-right'
      })
    },
    // 页面提示信息
    toastMsg (msg, type, time) {
      this.$message({
        message: msg || '您好, 出错了, 请重试!',
        type: type || 'info',
        duration: time || 1800,
      });
    },
  },
})
