<template>
  <div class="common-list-table">
    <!--自定义table组件-->
    <div class="table-cont" :key="tableKey">
      <table class="tm-table" id="tmtableEcharts" v-if="displayTableList.length > 1">
        <!-- 表头处理 -->
        <thead>
          <tr class="thead-tr">
            <th v-if="selection" class="tm-th" style="width:40px">
              <!-- 选择 -->
              <el-checkbox v-model="checkedAll" @click="checkedAll=!checkedAll" @change="checkedAllFn"></el-checkbox>
            </th>
            <th v-for="(jtem, jndex) in headerList" :key="jndex" class="tm-th tm-thj thead-th">
              <div v-show="!thList[jndex]">
                <div class="tm-text-cont" :class="{'tm-sortable': jtem.sortable}"
                  @click="handleSortable(jtem.sortable, jtem.label, jtem.prop)">
                  {{ jtem.label }}
                  <!-- 是否有疑问的图标 -->
                  <el-tooltip class="item" v-if="jtem.icon" effect="dark" :content="jtem.label" placement="top">
                    <span v-if="jtem.icon" class="question-icon"></span>
                  </el-tooltip>
                  <!-- 是否需要排序 -->
                  <span v-if="jtem.sortable" class="icon-sort"
                    :class="{'ascending-sort': tableSortList[jtem.prop]}">
                  </span>
                </div>
              </div>
              <!-- 当隐藏时鼠标悬浮显示提示的内容 -->
              <div v-show="thList[jndex]">
                <el-tooltip class="item" effect="dark" :content="jtem.rationName ? jtem.label + '(' + jtem.rationName + ')' : jtem.label" placement="top">
                  <div class="tm-text-cont" :class="{'tm-sortable': jtem.sortable}"
                    @click="handleSortable(jtem.sortable, jtem.label, jtem.prop)">
                    {{ jtem.label }}
                    <!-- 是否有疑问的图标 -->
                    <el-tooltip class="item" v-if="jtem.icon" effect="dark" :content="jtem.label" placement="top">
                      <span v-if="jtem.icon" class="question-icon"></span>
                    </el-tooltip>
                    <!-- 是否需要排序 -->
                    <span v-if="jtem.sortable" class="icon-sort"
                      :class="{'ascending-sort': tableSortList[jtem.prop]}">
                    </span>
                  </div>
                </el-tooltip>
              </div>
            </th>
            <!-- 操作 -->
            <th class="tm-th" v-if="operating">操作</th>
          </tr>
        </thead>
        <!-- 表格区域内容 -->
        <tbody class="tbody-tr">
          <tr v-for="(item, index) in displayTableList" :key="index"
            :class="{grayBack: index % 2 == 0, brownBack: index % 2 != 0,}">
            <td v-if="selection" class="tm-td" style="width:40px">
              <el-checkbox v-model="checkedList[index]" @click="checkedList[index]=!checkedList[index]" @change="checkedListFn(index)"></el-checkbox>
            </td>
            <td v-for="(jtem, jndex) in headerList" :key="jndex" class="tm-td">
              <!-- 第一项日期特殊处理 -->
              <div v-show="!thList[jndex]" v-if="jndex == 0">
                <div class="tm-text-cont tbody-first-colum" :class="{weekendClass: item.weeks == '0' || item.weeks == '6'}">
                  <span v-if="item[jtem.subProp]">{{ item[jtem.subProp] }} /</span>
                  {{ item[jtem.prop] }}
                  <span v-if="item.weeks">({{ weekObj[item.weeks] }})</span>
                </div>
              </div>
              <div v-show="thList[jndex]" v-if="jndex == 0">
                <el-tooltip class="item" effect="dark" placement="top"
                  :content="item.weeks?item[jtem.prop]+'('+weekObj[item.weeks]+')':item[jtem.prop]">
                  <div class="tm-text-cont tbody-first-colum" :class="{weekendClass: item.weeks == '0' || item.weeks == '6'}">
                    <span v-if="item[jtem.subProp]">{{ item[jtem.subProp] }} /</span>
                    {{ item[jtem.prop] }}
                    <span v-if="item.weeks">({{ weekObj[item.weeks] }})</span>
                </div>
                </el-tooltip>
              </div>
              <!-- 非日期选项 -->
              <div v-show="!thList[jndex]" v-if="jndex > 0">
                <div class="tm-text-cont">
                  <span v-if="item[jtem.subProp]">{{ item[jtem.subProp] }} /</span>
                  {{ item[jtem.prop] }}
                  <span  v-if="item[jtem.percent]"
                    :class="{moreZero: item[jtem.percent] >= 0, lessZero: item[jtem.percent] < 0}">
                    ({{ item[jtem.percent] }}%)
                  </span>
                </div>
              </div>
              <!-- <div v-show="thList[jndex]" v-if="jndex > 0">
                <el-tooltip class="item" effect="dark" :content="item[jtem.percent] > 0 ? item[jtem.prop] + '(' + item[jtem.percent] + ')' : item[jtem.prop] + ''" placement="top">
                  <div class="tm-text-cont">
                    <span v-if="item[jtem.subProp]">{{ item[jtem.subProp] }} /</span>
                    {{ item[jtem.prop] }}
                    <span  v-if="item[jtem.percent]" :class="{moreZero: item[jtem.percent] >= 0, lessZero: item[jtem.percent] < 0}">
                      ({{ item[jtem.percent] }}%)
                    </span>
                  </div>
                </el-tooltip>
              </div> -->
            </td>
            <td class="tm-td" v-if="operating">
              <el-button
                size="mini"
                @click="editFn(item)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="detailFn(item)">明细</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "common-list-table",
  props: {
    resetCheckedFlag: {type: Boolean, default: true}, // 重载数据后是否重置checked状态，默认重置为“未选择”
    selection: {type: Boolean, default: false},
    operating: {type: Boolean, default: false},
    //表头，格式[{label: 'ID', prop: 'id', sortable: false}]
    headerList: {
      type: Array,
      default: () => [],
    },
    // 表体部分
    tableList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkedAll: false,
      checkedList: [],
      currentPage: 1,
      pageSize: 10,
      thList: [],
      // 对应周数据
      weekObj: {
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五',
        '6': '星期六',
        '0': '星期日',
      },
      // 跟踪表头某项是否需要排序,用来展示箭头指向
      tableSortList: {},
      displayTableList: [],
      tableKey: '',
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.tableKey = Date.now();
    //   this.displayTableList = this.tableList;
    //   this.tableDrag(true)
    //   this.resetCheckedList()
    // })
  },
  watch: {
    tableList: {
      handler: function (val, oldVal) {
        this.tableKey = Date.now();
        this.displayTableList = val;
        this.$nextTick(() => {
          this.tableDrag(true);
          this.resetCheckedList();
        })
      },
      deep: true,
    },
  },
  methods: {

    resetCheckedList () {
      // this.tableList.forEach((item) => {
      //   this.checkedList.push(false)
      // })
    },

    checkedAllFn (val) {
      if (this.checkedAll) {
        this.checkedList.forEach((item, index) => {
          this.$set(this.checkedList, index, true)
        })
      } else {
        this.checkedList.forEach((item, index) => {
          this.$set(this.checkedList, index, false)
        })
      }
    },

    checkedListFn (val) {
      let len = 0
      this.checkedList.forEach((item) => {
        if (item) {
          len++
        }
      })
      if (len === this.checkedList.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },

    editFn (item) {
      this.$message('修改稍后')
    },

    detailFn (item) {
      this.$message('明细稍后')
    },

    handleSortable (isSort, lable, prop) {
      if (!isSort) return false;
      // 排序图表倒置
      if (this.tableSortList[prop]) {
        this.$set(this.tableSortList, prop, false);
      } else {
        this.$set(this.tableSortList, prop, true);
      }
      // console.log(this.tableSortList[prop])
      // console.log(this.tableSortList[prop], lable, prop);
      this.$emit('getOrderList', this.tableSortList[prop], prop);
      // this.$message(`当前排序属性：${lable}`)
    },
    // 重置是否选择, 先留着
    resetChecked () {
      // 拉取数据后重置checked
      if (this.resetCheckedFlag) {
        this.checkedAll = false
        this.checkedList.forEach((item, index) => {
          this.$set(this.checkedList, index, false)
        })
      }
    },

    currentWidthFn (e) {
      let _this = this
      $('.tm-thj').each(function(i) {
        if ($(this).width() < 48) {
          _this.$set(_this.thList, i, true)
        } else {
          _this.$set(_this.thList, i, false)
        }
      });
    },

    tableDrag (partialRefresh) {
      let _this = this
      $("#tmtableEcharts").colResizable({
        liveDrag: true,
        resizeMode: 'overflow',
        draggingClass: "dragging",
        partialRefresh: partialRefresh,
        onResize: _this.currentWidthFn,
        minWidth: 48,
        hoverCursor: 'col-resize',
        // hoverCursor: 'url("/static/img/move_resize_arrow.ico"), e-resize',
        // dragCursor: 'url("/static/img/move_resize_arrow.ico"), e-resize',
        dragCursor: 'col-resize',
      })
    }
  },
};
</script>

<style scoped lang="less">
  .common-list-table {
    overflow: hidden;
    .table-cont {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      // background: url('../../common/images/table_bg.png') repeat-y;
      // background-position-y: 31px;
      // background-position-x: right;
      background-color: #fff;
      .tm-table{
        border: 1px solid #ebeef5;
        min-width: 100%;
        text-align: center;
        background: #ffffff;
        font-size: 12px;
      }
      .tm-th, .tm-td{
        border-bottom: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        padding: 8.5px 8px !important;
        height: 30px;
        box-sizing: border-box;
        color: #AAAAAA;
      }
      .tm-text-cont {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.tm-sortable{
          cursor: pointer;
        }
      }
      .thead-tr {
        line-height: 12px;
      }
      .tbody-tr {
        line-height: 12px;
      }
      // 表头字体颜色
      .thead-th {
        color: #3A3834;
      }
      // 第一列颜色
      .tbody-first-colum {
        color: #6F6C68;
      }
    }
    // 点击有疑问项图表
    .question-icon {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url('../../common/images/question_icon.png') no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
    }
    // 排序图标切换样式
    .icon-sort{
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url('../../common/images/descending_order.png') no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
    }
    .ascending-sort {
      background: url('../../common/images/ascending_order.png') no-repeat;
      background-size: 100% 100%;
    }
    // 周末的时间样式
    .weekendClass {
      color: #FF3A39 !important;
    }
    // 大于0样式
    .moreZero {
      color: rgba(255, 58, 57, 1);
    }
    // 小于零样式
    .lessZero {
      color: rgba(19, 202, 23, 1);
    }
    .grayBack {
      background-color: #FAFAFA;
    }
    .brownBack {
      background-color: #fff;
    }
    table tbody tr:hover {
      background-color: #EFF3F8;
    }
  }
</style>
