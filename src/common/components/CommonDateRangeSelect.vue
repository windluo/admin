<template>
  <div class="common-date-range-select-tmpl" :class="selfClass">
    <span class="lable-title">{{ label }}</span>
    <el-date-picker class="date-picker-tmpl"
      v-model="emitParams.startDate"
      type="date"
      ref="commonStartDatePicker"
      placeholder="请选择"
      @change="handleBeginDate"
      :picker-options="beginDateOptions"
      format="yyyy-MM-dd">
    </el-date-picker>
    <span class="split-line-date">至</span>
    <el-date-picker class="date-picker-tmpl"
      v-model="emitParams.endDate"
      type="date"
      ref="commonEndDatePicker"
      placeholder="请选择"
      @change="handleEndDate"
      :picker-options="endDateOptions"
      format="yyyy-MM-dd">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: "common-date-range-select",
    data () {
      return {
        // 传出去参数
        emitParams: {
          startDate: '',
          endDate: '',
        },
        // 开始时间备选项
        beginDateOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const today = new Date();
                picker.$emit('pick', today);
              }
            },
            {
              text: '最近七天',
              onClick(picker) {
                const today = new Date();
                picker.$emit('pick', today.addDay(-6));
              }
            }
          ],
        },
        // 结束时间备选项
        endDateOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const today = new Date();
                picker.$emit('pick', today);
              }
            }
          ],
        },
      }
    },
    components: {
    },
    computed: {
    },
    props: {
      // 名称
      label: {
        type: String,
        default: '',
      },
      // 默认时间段
      defaultDate: {
        type: Object,
        default: function () {
          return { startDate: '', endDate: ''};
        }
      },
      // 自定义样式
      selfClass: {
        type: String,
        default: 'common-date-range-select-tmpl',
      },
    },
    created: function () {
    },
    mounted () {
      this.emitParams.startDate = this.defaultDate.startDate;
      this.emitParams.endDate = this.defaultDate.endDate;
      this.$emit('getSelectDate', this.emitParams);
    },
    methods: {
      // 模拟element-ui让弹框消失的形式, 调用此方法可以让其消失
      blur () {
        // 调用element-ui内部暴露的方法, 移动时模拟按取消键的效果让其消失
        this.$refs.commonEndDatePicker.handleKeydown({keyCode: 27, stopPropagation: () => {}});
        this.$refs.commonStartDatePicker.handleKeydown({keyCode: 27, stopPropagation: () => {}});
      },
      // 起期选择变化
      handleBeginDate (d) {
        this.dealWithDate(d, 'startDate');
      },
      // 止期选择变化
      handleEndDate (d) {
        this.dealWithDate(d, 'endDate');
      },
      // 处理选中的时间
      dealWithDate (date, name) {
        if (date instanceof Object) {
          this.emitParams[name] = date.formate();
        } else {
          this.emitParams[name] = '';
        }
        this.$emit('getSelectDate', this.emitParams);
      },
      // 需要全部清除的时候从外部调用清空选择的所有项, 内部单个清除已经在别的地方处理
      clear () {
        for (var key in this.emitParams) {
          this.emitParams[key] = '';
        }
      },
    },
    watch: {
      defaultDate: {
        deep: true,
        handler: function (val) {
          console.log(val);
          this.emitParams.startDate = val.startDate;
          this.emitParams.endDate = val.endDate;
          this.$emit('getSelectDate', this.emitParams);
        }
      },
    },
  };
</script>

<style lang="less">
  .common-date-range-select-tmpl {
    display: inline-block;
    .lable-title {
      font-size: 12px;
      color: #AAAAAA;
    }
    .date-picker-tmpl {
      height: 26px;
      line-height: 26px;
      width: 128px;
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
        line-height: 26px;
      }
    }
    .split-line-date {
      font-size: 12px;
      color: #AAAAAA;
    }
  }
</style>
