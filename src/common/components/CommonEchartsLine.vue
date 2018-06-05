<template>
  <div class="common-echarts-line-tmpl">
    <!-- 图区域 -->
    <div ref="test" class="echarts-content">
    </div>
    <!-- 控制线条显示隐藏区域 -->
    <section class="display-line-selected">
      <ul class="clearfloat">
        <li @click="displayLine(item.prop)" v-for="(item, index) in displayLineSelectList" :key="index">
          <span class="pic" :style="{ backgroundColor: item.bkColor }">
            <img v-show="displayLineSelected[item.prop]" src="../images/selected.png" alt="">
          </span>
          <span class="title">{{ displayLineChineseName[item.prop] }}</span>
        </li>
      </ul>
    </section>
    <!-- 备注信息弹出框 -->
    <common-move-popup v-model="isShowPopup" selfClass="remarkContent">
      <h4 slot="title" class="remark-tool-tip-title">添加备注</h4>
      <div slot="content" class="remark-tool-tip-content">
        <textarea v-model="remarkMsg"></textarea>
        <div class="el-button-class">
          <el-button class="comfirm-remark" type="warning" @click="comfirmRemark">确定</el-button>
          <el-button class="cancel-remark" @click="isShowPopup = false; remarkMsg=''">关闭</el-button>
        </div>
      </div>
    </common-move-popup>
  </div>
</template>

<script>
  import CommonMovePopup from '@/common/components/CommonMovePopup.vue';
  // 引入请求
  let [ actionReportOrderinfomationAddRemark ] = _actionCreator.init(['reportOrderinfomationAddRemark']);
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  require('echarts/lib/component/dataset');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require("echarts/lib/component/legendScroll");
  export default {
    name: "common-echarts-line",
    data () {
      return {
        isShowPopup: false,
        myChart: '',
        remarkMsg: '',
        lineChartTitle: '', // 线性图名称
        // 当前鼠标悬浮时展示的日期
        currentDisplayDate: '',
        // 当前鼠标悬浮时展示的名称
        currentDisplayname: '',
        // 当前鼠标选中的点对应在选中系列的索引位置
        currentDataIndex: '',
      };
    },
    components: {
      CommonMovePopup,
    },
    computed: {
    },
    props: {
      // 线条属性设置, 需要展示的名称设置布尔值
      seriesSet: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 展示项控制设置, 底部控制显示条颜色配置以及需要展示的名称
      displayLineSelectList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 展示项控制设置
      displayLineSelected: {
        type: Object,
        default: function () {
          return {};
        },
      },
      // 对应数据统计项字段需要展示的中文名称
      displayLineChineseName: {
        type: Object,
        default: function () {
          return {};
        },
      },
      // x轴设置
      xAxisData: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 返参数据, 用来追踪备注信息包括取入参数据
      resData: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    created: function () {
    },
    mounted () {
      this.myChart = echarts.init(this.$refs.test);
      window.onresize = this.myChart.resize;
      this.renderEcharts();
    },
    methods: {
      // 当前显示的弹窗备注内容
      toolTipContent (params) {
        let remarkInfo = '';
        // 根据日期和对应的类别找到相应的备注信息, 该处若需要配置要后台配合字段, 如本列的日期和对应的备注信息字段名 totalSuccessAmountRemarkInfo
        this.resData.forEach(item => {
          if (item.informationDate == params.name) {
            for (var key in item) {
              if (key == params.seriesName + 'RemarkInfo') {
                remarkInfo = item[key];
              }
            }
          }
        });
        if (!remarkInfo) return;
        return `<ul><li style="max-width: 200px;word-break: break-all;white-space: normal;">${remarkInfo}</li></ul>`;
      },
      // 确认图上某个点的备注信息
      comfirmRemark () {
        this.resData.forEach(item => {
          if (item.informationDate == this.currentDisplayDate) {
            for (var key in item) {
              if (key == this.currentDisplayname + 'RemarkInfo') {
                let _key = key;
                // 增加备注接口入参
                let data = {
                  seqId: item.seqId, // 标识id
                  remarkInfo: this.remarkMsg, // 备注信息
                  remarkType: this.currentDisplayname + 'Remark', // 对应哪条线增加了备注信息, 末尾加 Remark
                  remarkDate: item.informationDate, // 该条数据的时间
                };
                actionReportOrderinfomationAddRemark(data, false, false, 'get').then(res => {
                  if (res.code == '0') {
                    let resData = res.data;
                    item[_key] = this.remarkMsg;
                    // 添加备注成功后将某点特别标记出来
                    this.setRemarkInfoPoint();
                    this.remarkMsg = '';
                    this.isShowPopup = false;
                    this.$message('您好，添加成功！');
                  } else {
                    this.$message('您好，添加失败：' + res.msg);
                  }
                }, err => {
                  console.log(err);
                  this.$message('您好，添加失败：' + err.msg);
                });
              } else {
                this.$message('您好，该曲线暂时没有查询到备注字段');
              }
            }
          }
        });
      },
      // 渲染图函数
      renderEcharts () {
        let vm = this;
        let option = {
          title: {
            text: vm.lineChartTitle,
          },
          tooltip: {
            // trigger: 'axis',
          },
          // 提示框
          tooltip: {
            type: 'line',
            axisPointer: {
              snap: true,
              type: 'cross',
              // axis: 'auto',
            },
            enterable: true,
            // position: [20, 40],
            label: {
              show: false,
            },
            // 是否触发x轴上所有信息项
            // trigger: 'axis',
            // 自定义触发弹出框内容
            formatter: vm.toolTipContent,
          },
          // 数据点强调
          emphasis: {
            itemStyle: {
              color: 'red',
            },
          },
          label: {},
          legend: {
            data: [],
            // 可以点击选中或取消的内容选项
            selected: vm.displayLineSelected,
          },
          // 网格设置
          grid: {
            show: true,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: true,
            },
            // gridIndex: '1',
            data: vm.xAxisData,
          },
          yAxis: {
            type: 'value',
          },
          // 线条属性, 包括颜色, 圆点设置等
          series: vm.seriesSet,
        };
        vm.myChart.setOption(option, true);
        // 点击增加备注信息
        vm.myChart.on('click', function (params) {
          // 取出当前的备注信息, 在此基础上编辑 totalSuccessAmountRemarkInfo
          vm.resData.forEach(item => {
            if (item.informationDate == params.name) {
              // 记录当前选中的线条的x轴,在这里是时间
              vm.currentDisplayDate = params.name;
              for (var key in item) {
                if (key == params.seriesName + 'RemarkInfo') {
                  // console.log(params)
                  // 记录当前选中的线条对应的名称
                  vm.currentDisplayname = params.seriesName;
                  // 记录当前对应数据在哪项
                  vm.currentDataIndex = params.dataIndex;
                  vm.remarkMsg = item[key];
                }
              }
            }
          });
          vm.isShowPopup = true;
        });
      },
      // 当添加备注信息成功后, 将添加成功的点标记出来
      setRemarkInfoPoint () {
        this.resData.forEach((item, index) => {
          // 当前选中的这条数据日期
          if (this.currentDisplayDate == item.informationDate) {
            for (var key in item) {
              this.seriesSet.forEach((serieItem, serieIndex) => {
                // 当前选中的这条线的名称
                if (serieItem.name == key && this.currentDisplayname == key) {
                  // 每次添加需要记录之前这条添加数据对应的是哪项数据, 找到对应的索引
                  let obj = serieItem.data[this.currentDataIndex];
                  if (!!item[`${key}RemarkInfo`]) {
                    obj.itemStyle = {color: '#f00'};
                    obj.symbolSize = 5;
                  } else {
                    obj.symbolSize = 1;
                  }
                }
              });
            }
          }
        });
        this.renderEcharts();
      },
      // 显示展示的线条
      displayLine (key) {
        this.displayLineSelected[key] = !this.displayLineSelected[key];
      },
    },
    watch: {
      displayLineSelected: {
        handler: function (val, oldVal) {
          this.renderEcharts();
        },
        deep: true,
      },
      displayLineSelectList: {
        handler: function (val, oldVal) {
          this.renderEcharts();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="less">
  .common-echarts-line-tmpl {
    background-color: #fff;
    padding-bottom: 15px;
    .echarts-content {
      height: 300px;
      width: 100%;
    }
    // 点击图显示曲线区域
    .display-line-selected {
      background-color: #F0F0F0;
      margin: 15px 20px 0px;
      border-radius: 5px;
      ul {
        padding-left: 30px;
      }
      li {
        float: left;
        cursor: pointer;
        // padding: 0 10px;
        margin-right: 30px;
        font-size: 14px;
        color: #6F6C68;
        line-height: 26px;
        span.pic {
          display: inline-block;
          vertical-align: middle;
          height: 12px;
          line-height: 12px;
          width: 12px;
          background-color: #ccc;
          margin-top: -2px;
          img {
            height: 12px;
            width: 12px;
          }
        }
        span.title {
          line-height: 0;
        }
      }
    }
    // 评论区域样式
    .remarkContent {
      min-width: 276px;
      min-height: 262px;
      z-index: 100000000 !important;
      .remark-tool-tip-title {
        text-align: center;
      }
      .remark-tool-tip-content {
        padding: 16px;
        textarea {
          border: 1px solid #ccc;
          font-size: 14px;
          width: 100%;
          border-radius: 8px;
          height: 9em;
          outline: none;
          resize: none;
          padding: 5px;
          overflow: auto;
          box-sizing: border-box;
        }
      }
      .el-button-class {
        text-align: center;
        padding: 30px 0px 0px;
        .comfirm-remark, .cancel-remark {
          font-size: 16px;
          height: 30px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
          padding: 0 40px;
        }
      }
    }
  }
</style>
