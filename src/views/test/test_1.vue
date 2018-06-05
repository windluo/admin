<template>
  <div class="tmpl-terminall-statics common-assembly-template-style" v-if="!init">
    <header class="head-title" v-if="(loadCode <= 40 && !init) || loadCode >= 80">
      <span>总数据</span>
    </header>

    <!-- 查询条件区域 -->
    <section class="select-condtion clearfloat" v-if="loadCode <= 40 && !init">
      <!-- 日期选择 -->
      <common-date-range-select label="统计日期：" class="condition-top"
        :defaultDate="defaultDate" @getSelectDate="getSelectDate">
      </common-date-range-select>

      <!-- 地址选择 -->
      <common-address-select class="condition-top"
        @getAddress="getAddress">
      </common-address-select>

      <!-- 运营商选择 -->
      <common-merchant-select class="condition-top"
        :filterConfig="{'provinceId': provinceId, 'cityId': cityId, 'districtId': districtId}"
        @getMerchantSelect="getMerchantSelect">
      </common-merchant-select>

      <!-- 网点名称输入 -->
      <div class="grid-name-style condition-top">
        <span class="grid-title title">网点名称：</span>
        <el-input class="grid-input-style input-text-style" v-model="gridName" clearable placeholder="请输入">
        </el-input>
      </div>

      <!-- 相关按钮 -->
      <div class="el-query condition-top">
        <el-button class="el-query-btn" type="warning" @click="queryData">查询</el-button>
        <!-- 数据导出 -->
        <common-export class="el-query-btn" url="/report/orderinfomation/export" :params="{startDate: startDate, endDate: endDate}"></common-export>
      </div>
    </section>
    <!-- 图区域 displayLineSelected, displayLineSelectList, displayLineChineseName 为线控制板参数, 跟echart关系不大 -->
    <section class="echarts-part" v-show="tableList.length > 1">
      <common-echarts-line class="common-echarts-line" v-if="loadCode <= 20 && !init && echartIsShow"
        :displayLineSelected="displayLineSelected"
        :displayLineSelectList="displayLineSelectList"
        :displayLineChineseName="displayLineChineseName"
        :seriesSet="seriesSet"
        :resData="resData"
        :xAxisData="xAxisData">
      </common-echarts-line>
    </section>

    <!-- 表格区域 headerList表头 tableList表体 -->
    <section class="table-content" v-if="(loadCode <= 20 && !init) || loadCode >= 80">
      <common-list-table @getOrderList="getOrderList"
        :headerList="headerList" :tableList="tableList">
      </common-list-table>
    </section>

    <!-- 分页内容区域 -->
    <section class="pagination-cont clearfloat" v-if="loadCode <= 20 && !init && tableList.length > 1">
      <el-pagination class="fr"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper, slot"
        :total="totalCount">
      </el-pagination>
    </section>

    <!-- 没有数据提示 -->
    <common-error-tip :loadCode="loadCode"></common-error-tip>
  </div>
</template>

<script>
  import CommonListTable from '@/common/components/CommonTableEcharts.vue';
  import CommonErrorTip from '@/common/components/CommonErrorTip'
  // 引入地址组件
  const CommonAddressSelect = resolve => require.ensure([], () => {resolve(require('@/common/components/CommonAddressSelect.vue'))}, 'CommonAddressSelect');
  // 引入时间组件
  // import CommonDateRangeSelect from '@/common/components/CommonDateRangeSelect.vue';
  import CommonDateRangeSelect from '@/common/components/CommonDateRangePicker.vue';
  // 引入单列选择组件
  import CommonMerchantSelect from '@/common/components/CommonMerchantSelect.vue';
  // 引入echarts图表
  const CommonEchartsLine = resolve => require.ensure([], () => {resolve(require('@/common/components/CommonEchartsLine.vue'))}, 'CommonEchartsLine');
  // 导出功能
  import CommonExport from '@/common/components/CommonExport'
  // 引入请求
  let [ actionReportOrderinfomationList ] = _actionCreator.init(['reportOrderinfomationList']);
  // 引入深拷贝文件
  import _cloneDeep from "lodash/cloneDeep";
  import Domain from "@/common/js/domain.js";
  // 引入时间格式化函数,详情看该方法
  import { initDateForm } from '@/common/js/filters'
  let date = new Date();
  export default {
    name: "terminall-statics",
    data () {
      return {
        loading: false,
        startDate: date.addDay(-6).formate(),
        endDate: date.formate(),
        queryStartDate: '',
        queryEndDate: '',
        defaultDate: {
          startDate: date.addDay(-6).formate(),
          endDate: date.formate(),
        },
        provinceId: '',
        cityId: '',
        districtId: '',
        merchantId: '',
        gridName: '', // 网点名称
        // 点击需要显示的线段选择项
        displayLineSelected: {},
        // 设置图表底部控制线对应不同控制按钮, 具体参照案例
        displayLineSelectList: [],
        // 配置字段需要展示出来的中文名称
        displayLineChineseName: {},
        // 图标系列的设置, 精确处理某一点的设置
        seriesSet: [],
        // 图表颜色配置
        colorList: '#FD9938 #3679F5 #FF3A39 #13CA17 #00F7FF #D857FF #9C00FF #FF00A1'.split(' '),
        // x轴设置
        xAxisData: [],
        // 分页组件参数
        pageSize: 10,
        totalCount: 50,
        currentPage: 1,
        // 表头展示
        headerList: [],
        // 表格正文内容
        tableList: [],
        // 表格底部合并项
        statisticObj: {},
        // 每次返参数据
        resData: [],
        order: '', // 升序还是降序
        loadCode: 99, // 99 初始值 10 发起请求时, 20请求成功有数据时, 40 没有数据, 80报错时
        init: true, // 第一次查询
        echartIsShow: true,
        // 取消请求参数
        source: '',
      }
    },
    components: {
      CommonListTable,
      CommonAddressSelect,
      CommonDateRangeSelect,
      CommonMerchantSelect,
      CommonEchartsLine,
      CommonErrorTip,
      CommonExport,
    },
    created () {
      this.$store.state.loading = false;
      this.source = this.$axios.CancelToken.source();
    },
    mounted: function () {
      this.init = true;
      this.queryData();
    },
    beforeRouteLeave (to, from, next) {
      this.cancelAxios();
      next()
    },
    methods: {
      // 获取起止期
      getSelectDate (params) {
        this.startDate = params.startDate;
        this.endDate = params.endDate;
        this.queryStartDate = params.startDate;
        this.queryEndDate = params.endDate;
      },
      // 获取地址
      getAddress (params) {
        this.provinceId = params.provinceId;
        this.cityId = params.cityId;
        this.districtId = params.districtId;
      },
      // 获取运营商Id
      getMerchantSelect (params) {
        this.merchantId = params.merchantId;
      },
      // 每页显示条数改变
      handleSizeChange (val) {
        this.pageSize = val;
        this.currentPage = 1;
        // this.queryStartDate = this.startDate;
        // this.queryEndDate = this.endDate;
        this.queryOrderInformation();
      },
      // 页码发生改变时
      handleCurrentChange (val) {
        this.queryOrderInformation();
      },
      // 查询所有数据
      queryData () {
        this.currentPage = 1;
        this.queryStartDate = this.startDate;
        this.queryEndDate = this.endDate;
        this.order = 'informationDate desc'; // 默认降序 默认时间
        this.queryTotalOrderInformation();
      },
      // 排序查询后台数据
      getOrderList (order, prop) {
        // console.log(order)
        this.order = order ? prop + ' asc' : prop + ' desc';
        this.currentPage = 1;
        this.queryStartDate = this.startDate;
        this.queryEndDate = this.endDate;
        this.queryTotalOrderInformation();
      },
      // 查询时间段内所有数据时调用
      queryTotalOrderInformation () {
        let data = {
          order: this.order,
          startDate: this.queryStartDate,
          endDate: this.queryEndDate,
          // provinceId: this.provinceId,
          // cityId: this.cityId,
          // districtId: this.districtId,
          // merchantId: this.merchantId,
          // orderId: '',
          // pagesize: 0, // 传入0查询所有数据
          // payDetailType: '',
          // 是否需要总页数, 需要传1
          // needTotalCount: 1,
        };
        // 请求数据列表数据
        this.loading = true;
        this.$store.state.loading = true;
        if (this.loadCode === 40) {
          this.echartIsShow = false;
        }
        this.loadCode = 10;
        actionReportOrderinfomationList(data, this.source.token, false).then(res => {
          this.loading = false;
          this.$store.state.loading = false;
          this.init = false;

          // 初始化数据
          // 表头
          this.headerList = [];
          // echart数据集
          this.seriesSet = [];
          // echart线条控制对象
          this.displayLineSelected = {};
          // echart线条控制板样式设置
          this.displayLineSelectList = [];
          // 表格内容列表
          this.tableList = [];

          if (res.code == '0') {
            let resData = res.data;
            if (resData.datas.length == 0) {
              this.loadCode = 40; // 为空时
              return false;
            }
            this.echartIsShow = true;
            // 配置表头 label表头显示项 prop对应属性 subProp附加属性 sortable是否可以排序 percent百分比
            this.headerList = [
              {
                label: '日期',
                prop: 'informationDate',
                sortable: true,
              },
              {
                label: '销售总额(元)',
                prop: 'totalSuccessAmount',
                percent: 'contrastSuccessAmount',
                sortable: true,
                elTip: 'elTip',
              },
              {
                label: '销售数量(张)',
                percent: 'contrastSuccessNum',
                prop: 'totalSuccessNum',
                sortable: true,
              },
              {
                label: '购买人数(人)',
                prop: 'numberOfBuyers',
                percent: 'contrastNumberOfBuyers',
                sortable: true,
              },
              {
                label: '平均购买数量(张)',
                prop: 'avgSuccessNumByPeople',
                percent: 'contrastAvgSuccessNum',
                icon: false,
                sortable: true,
              },
              {
                label: '平均购买金额(元)',
                prop: 'avgSuccessAmountByPeople',
                percent: 'contrastAvgSuccessAmount',
                sortable: true,
              },
              {
                label: '兑奖金额(元)',
                prop: 'totalcashAPrizeAmount',
                sortable: true,
              },
              {
                label: '提现总额(元)',
                prop: 'totalWithDrawCashAmount',
                sortable: true,
              },
              {
                label: '终端布放/总布放',
                prop: 'totalTerminalRelease',
                subProp: 'terminalRelease',
                sortable: false,
              },
              {
                label: '新增网点/总网点',
                prop: 'totalGridRelease',
                subProp: 'gridRelease',
                sortable: false,
              },
              {
                label: '新增运营商/总运营商',
                prop: 'totalMerchantRelease',
                subProp: 'merchantRelease',
                sortable: false,
              },
            ];

            // 表格底部合计项
            this.statisticObj = {
              informationDate: '平均值',
              totalSuccessAmount: 0,
              totalSuccessNum: 0,
              numberOfBuyers: 0,
              avgSuccessNumByPeople: 0,
              avgSuccessAmountByPeople: 0,
              totalcashAPrizeAmount: 0,
              totalWithDrawCashAmount: 0,
            };

            // 图表底部控制线展示的中文名称配置, 根据对应的字段展示中文名字
            this.displayLineChineseName = {
              totalSuccessAmount: '销售总额',
              totalSuccessNum: '销售数量',
              numberOfBuyers: '购买人数',
              avgSuccessNumByPeople: '平均购买数量',
              avgSuccessAmountByPeople: '平均购买金额',
              totalcashAPrizeAmount: '兑奖金额',
              totalWithDrawCashAmount: '提现总额',
            }
            // 定义x轴数组
            let xAxisData = [];

            // 定义echart图数据系列
            let seriesSetData = [];

            // 设置所有线条展示内容, 需要展示的线条跟后台对应的字段
            let seriesArrayList = 'totalSuccessAmount totalSuccessNum numberOfBuyers avgSuccessNumByPeople avgSuccessAmountByPeople totalcashAPrizeAmount totalWithDrawCashAmount'.split(' ');

            seriesArrayList.forEach((item, index) => {
              // 设置图表底部控制线对应不同控制按钮的样式
              this.displayLineSelectList.push({
                prop: item,
                bkColor: this.colorList[index],
              });
              // 设置图表底部控制线开关按钮, 默认打开第一个
              if (index == 0) {
                this.$set(this.displayLineSelected, item, true);
              } else {
                this.$set(this.displayLineSelected, item, false);
              }
              // 设置每条线的所有配置
              let obj = {};
              obj.name = item; // 名称
              obj.stack = item; // 区分每条线的不同之处
              obj.data = []; // data数据从遍历里面获取, 如下后台返参list遍历所示, 每一项格式如 [{value: '', itemStyle: ''}]等配置, 详细查看echart官网
              obj.showAllSymbol = true; // 显示所有点
              obj.type = 'line'; // 线的类型
              obj.lineStyle = { color: this.colorList[index] }; // 线的颜色
              seriesSetData.push(obj);
            });

            // 获取后台返回的列表数据
            let listOrderInformation = resData.datas;
            // 获取总条数
            this.totalCount = listOrderInformation.length;
            // 深拷贝返参列表数据, 传入echart, 用来跟踪每一项数据变化
            this.resData = _cloneDeep(listOrderInformation);

            listOrderInformation.forEach((item, index) => {
              // 显示第一页
              if (index < this.pageSize) {
                // 获取表格内容, 每一行内容以及附加内容
                let date = new Date(...initDateForm(item.informationDate));
                let obj = {};
                obj.totalMerchantRelease = item.totalMerchantRelease; // 总运营商
                obj.merchantRelease = item.merchantRelease || '0'; // 新增运营商
                obj.totalGridRelease = item.totalGridRelease; // 总网点
                obj.gridRelease = item.gridRelease || '0'; // 新增网点
                obj.totalTerminalRelease = item.totalTerminalRelease; // 总布放
                obj.terminalRelease = item.terminalRelease || '0'; // 终端布放
                obj.totalWithDrawCashAmount = item.totalWithDrawCashAmount; // 提现金额
                obj.totalcashAPrizeAmount = item.totalcashAPrizeAmount; // 兑奖金额
                obj.avgSuccessAmountByPeople = item.avgSuccessAmountByPeople; // 平均购买金额(按人数)
                obj.contrastAvgSuccessAmount = item.contrastAvgSuccessAmount; // 平均购买金额比例
                obj.avgSuccessNumByPeople = item.avgSuccessNumByPeople; // 平均购买数量(按人数)
                obj.contrastAvgSuccessNum = item.contrastAvgSuccessNum; // 平均购买数量同比
                obj.numberOfBuyers = item.numberOfBuyers; // 购买人数
                obj.contrastNumberOfBuyers = item.contrastNumberOfBuyers; // 购买人数同比
                obj.totalSuccessNum = item.totalSuccessNum; // 销售数量
                obj.contrastSuccessNum = item.contrastSuccessNum; // 销售数量百分比
                obj.totalSuccessAmount = item.totalSuccessAmount; // 销售总额
                obj.informationDate = item.informationDate; // 统计日期
                obj.avgSuccessNumByPeoplePercent = item.avgSuccessNumByPeoplePercent; // 平均购买金额百分比
                obj.contrastSuccessAmount = item.contrastSuccessAmount; // 销售总额的百分比
                obj.weeks = date.getDay() + '';
                // 获取表体内容
                this.tableList.push(obj);
              }

              // 设置Echart每项数据值, 设置里面data具体的数据, 注意,备注字段后台一定要在相应字段后面加上RemarkInfo后缀
              for (var key in item) {
                seriesSetData.forEach((serieItem, serieIndex) => {
                  if (serieItem.name == key) {
                    let obj = {};
                    obj.value = item[key];
                    obj.itemStyle = {color: this.colorList[serieIndex]};
                    if (!!item[`${key}RemarkInfo`]) {
                      obj.itemStyle = {color: '#f00'};
                      obj.symbolSize = 5;
                    } else {
                      obj.symbolSize = 1;
                    }
                    serieItem.data.push(obj);
                  }
                });
              }

              // 增加时间为x轴
              xAxisData.push(item.informationDate);

              // 表格底部求和
              this.statisticObj.totalSuccessAmount += item.totalSuccessAmount;
              this.statisticObj.totalSuccessNum += item.totalSuccessNum;
              this.statisticObj.numberOfBuyers += item.numberOfBuyers;
              this.statisticObj.avgSuccessNumByPeople += item.avgSuccessNumByPeople;
              this.statisticObj.avgSuccessAmountByPeople += item.avgSuccessAmountByPeople;
              this.statisticObj.totalcashAPrizeAmount += item.totalcashAPrizeAmount;
              this.statisticObj.totalWithDrawCashAmount += item.totalWithDrawCashAmount;
            });

            // 取求和的平均值, 保留两位小数
            for (var key in this.statisticObj) {
              if ('totalSuccessAmount totalSuccessNum numberOfBuyers avgSuccessNumByPeople avgSuccessAmountByPeople totalcashAPrizeAmount totalWithDrawCashAmount'.split(' ').some(item => item == key)) {
                this.statisticObj[key] = Math.round(this.statisticObj[key] * 100 / this.totalCount) / 100;
              }
            }
            // 设置图表数据源以及x轴
            this.seriesSet = seriesSetData;
            this.xAxisData = xAxisData;

            // 表格加上求和项, 不加就没有
            this.tableList.push(this.statisticObj);
          } else {
            this.loadCode = 40;
          }
        }, err => {
          this.loadCode = 80;
          this.loading = false;
          this.$store.state.loading = false;
        });
      },
      // 分页时查询数据调用
      queryOrderInformation () {
        let sliceList = this.resData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        if (sliceList.length <= 0) return false;
        this.tableList = [];
        sliceList.forEach((item, index) => {
          // 获取表格内容
          let date = new Date(...initDateForm(item.informationDate));
          let obj = {};
          obj.totalMerchantRelease = item.totalMerchantRelease; // 总运营商
          obj.merchantRelease = item.merchantRelease || '0'; // 新增运营商
          obj.totalGridRelease = item.totalGridRelease; // 总网点
          obj.gridRelease = item.gridRelease || '0'; // 新增网点
          obj.totalTerminalRelease = item.totalTerminalRelease; // 总布放
          obj.terminalRelease = item.terminalRelease || '0'; // 终端布放
          obj.totalWithDrawCashAmount = item.totalWithDrawCashAmount; // 提现金额
          obj.totalcashAPrizeAmount = item.totalcashAPrizeAmount; // 兑奖金额
          obj.avgSuccessAmountByPeople = item.avgSuccessAmountByPeople; // 平均购买金额(按人数)
          obj.contrastAvgSuccessAmount = item.contrastAvgSuccessAmount; // 平均购买金额比例
          obj.avgSuccessNumByPeople = item.avgSuccessNumByPeople; // 平均购买数量(按人数)
          obj.contrastAvgSuccessNum = item.contrastAvgSuccessNum; // 平均购买数量同比
          obj.numberOfBuyers = item.numberOfBuyers; // 购买人数
          obj.contrastNumberOfBuyers = item.contrastNumberOfBuyers; // 购买人数同比
          obj.totalSuccessNum = item.totalSuccessNum; // 销售数量
          obj.contrastSuccessNum = item.contrastSuccessNum; // 销售数量百分比
          obj.totalSuccessAmount = item.totalSuccessAmount; // 销售总额
          obj.informationDate = item.informationDate; // 统计日期
          obj.avgSuccessNumByPeoplePercent = item.avgSuccessNumByPeoplePercent; // 平均购买金额百分比
          obj.contrastSuccessAmount = item.contrastSuccessAmount; // 销售总额的百分比
          obj.weeks = date.getDay() + '';
          // 获取表体内容
          this.tableList.push(obj);
        });
        this.tableList.push(this.statisticObj);
      },
      // 取消ajax请求时调用
      cancelAxios () {
        this.source.cancel('Operation canceled by the user.');
      },
    },
  };
</script>

<style lang="less">
  .tmpl-terminall-statics {
    .common-echarts-line {
      margin-top: -40px;
    }
    // 表格区域
    .table-content {
      margin: 10px 20px 0px;
    }
  }
</style>
