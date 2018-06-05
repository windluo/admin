<template>
  <div class="common-date-range-picker">
    <span class="lable-title">{{ label }}</span>
    <el-date-picker
      class="date-picker-tmpl"
      v-model="value"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="getDate"
      :picker-options="pickerOptions"
      ref="daterangepicker">
    </el-date-picker>
  </div>
</template>

<script>
import { leftpad } from '@/common/js/filters'
// 引入时间格式化函数,详情看该方法
import { initDateForm } from '@/common/js/filters'
export default {
  name: 'common-date-range-picker',
  props: {
    label: {type: String, default: ''}, // 标题
    defaultDate: {type: Object, default: () =>{ return {startDate: '', endDate: ''} }} // 默认日期
  },
  data () {
    return{
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  methods: {
    convertDate (date) {
      let time = new Date(date)
      let year = time.getFullYear()
      let month = leftpad(time.getMonth() + 1, 2, '0')
      let day = leftpad(time.getDate(), 2, '0')

      return `${year}-${month}-${day}`
    },
    getDate (val) {
      let start = ''
      let end = ''
      let pickedDate = {
        startDate: start,
        endDate: end
      }
      if (val && val.length >= 2) {
        start = this.convertDate(val[0])
        end = this.convertDate(val[1])
        pickedDate = {
          startDate: start,
          endDate: end
        }
      }

      this.$emit('getSelectDate', pickedDate)
    }
  },
  mounted () {
    this.value = []
    this.value[0] = new Date(...initDateForm(this.defaultDate.startDate))
    this.value[1] = new Date(...initDateForm(this.defaultDate.endDate))
  }
}

</script>
<style lang="less">
  .common-date-range-picker {
    display: inline-block;
    .lable-title {
      font-size: 12px;
      color: #AAAAAA;
    }
    .date-picker-tmpl {
      height: 26px;
      line-height: 26px;
      width: 256px;
      span {
        padding-left: 5px;
      }
      input.el-input__inner {
        height: 26px;
        line-height: 26px;
        padding-left: 30px;
        padding-right: 20px;
        font-size: 12px;
      }
      .el-input__icon {
        line-height: 20px;
      }
    }
    .el-range-separator{
      font-size: 12px;
      color: #AAAAAA;
      line-height: 20px;
    }
    .split-line-date {
      font-size: 12px;
      color: #AAAAAA;
    }
  }
</style>
