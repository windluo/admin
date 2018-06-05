<template>
  <div class="common-table common-single-select-table" v-show="init!=0">
    <div class="common-table-wrap">
      <!--自定义table组件-->
      <div class="table-cont" ref="tablecont" id="tablecontId" :key="now" v-show="init!=0&&init!=-1">
        <table class="tm-table" id="tmtable">
          <!-- 表头 -->
          <tr class="tr-odd">
            <th class="tm-th tm-thj"></th>
            <th v-for="(jtem, jndex) in tableHeader" :key="jndex" class="tm-th tm-thj"
              :style="resetChildWidth(jtem.width)">
              <div>
                <div class="tm-text-cont" v-if="!jtem.sortable" :class="{hasLevel: jtem.hasLevel}">
                  {{jtem.label}}
                  <el-tooltip class="item" effect="dark" :content="jtem.tips" placement="top" v-if="jtem.tips">
                    <i class="icon-tips"></i>
                  </el-tooltip>
                </div>
                <!-- 排序 -->
                <div
                  class="tm-text-cont sortable"
                  @click="handleSortable(jtem.prop)"
                  v-if="jtem.sortable">
                    {{jtem.label}}
                    <i class="icon-sort" :class="{'sort-asce': tableSortList[jtem.prop]==='asc'}"></i>
                    <el-tooltip class="item" effect="dark" :content="jtem.tips" placement="top" v-if="jtem.tips">
                      <i class="icon-tips"></i>
                    </el-tooltip>
                </div>
              </div>
            </th>
          </tr>

          <!-- 表体部分 -->
          <tr v-for="(item, index) in tableBody" :key="index" class="tr-tbody" :class="{'tr-even':index%2===0, 'tr-odd':index%2===1}">
            <td v-if="selection" class="tm-td-radio">
              <!-- 单选框 -->
              <el-radio v-model="radioSelect" :label="item.radioChecked" @change="checkedListFn(index)">
              </el-radio>
            </td>
            <td v-for="(jtem, jndex) in tableHeader" :key="jndex" class="tm-td">
              <div class="tm-text-cont">
                {{item[jtem.prop]}}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <el-pagination
        v-show="init!=0&&init!=-1" v-if="isShowPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper, slot"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "common-single-select-table",
  props: {
    init: { type: Number, default: 1 }, //进入页面状态，0表示第一次进入页面，-1表示隐藏table和分页，其他状态未细分
    // 是否显示分页, 默认显示
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    headerList: {type: Array, default: () => {return []}}, //表头，label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
    tableList: {type: Array, default: () => {return []}}, // 表内容，目前只考虑了一级的键值对JSON，格式[{label: 'ID', prop: 'id', sortable: false}]
    total: {type: Number, default: 0}, //table总数据长度，用于计算分页
    selection: {type: Boolean, default: false}, // 启用选择框可以显示删除按钮
    userFlag: '', // 需要多个数据列表渲染时, 传入某个数据列表的标识, 用来区分, 只用单个时不需要处理
  },
  data () {
    return {
      now: Date.now(),
      tableHeader: [], // 接收异步的表头
      tableBody: [], // 接收异步的表体
      currentPage: 1,
      pagesize: 10,
      filterOpts: {
        sort: {} // 默认按网点Id降序
      },
      currentDataIndex: -1,
      tableSortList: {},
      style: '',
      radioSelect: '', // 单选时选中的某项
    }
  },
  computed: {
  },
  watch: {
    tableList: {
      handler (val, oldVal) {
        this.tableBody = val
        this.now = Date.now()
        this.$nextTick(() => {
          this.tableDrag()
        })
      },
      deep: true,
    },
    headerList: {
      handler (val, oldVal) {
        this.tableHeader = val
        this.now = Date.now()
        this.$nextTick(() => {
          this.tableDrag()
        })
      },
      deep: true,
    },
  },
  mounted () {
    this.$nextTick(() =>{
      this.tableBody = this.tableList
      this.tableHeader = this.headerList
      // 给99，防滚动条默认出来
      // this.style = 'width:99%;'
      this.resetTableStyle()
      this.tableDrag()
    })
  },
  methods: {
    resetTableStyle () {
      // 表格定宽的时候需要每列都传入宽度，这样才不会出现统计乱
      let width = 0
      this.headerList.forEach((item) => {
        if (isNaN(parseInt(item.width))) {
          width += 0
        } else {
          width += parseInt(item.width)
        }
      })

      if (this.selection) {
        width += 32
      }

      this.style = ''
      if (width <= this.$refs.tablecont.clientWidth) {
        // 给99，防滚动条默认出来
        this.style = 'width:99%;'
      } else {
        this.style = `width:${width}px`
      }
    },

    resetChildWidth (width) {
      let pwidth = isNaN(parseInt(width)) ? 0 : parseInt(width)
      return `width:${width}px`
    },

    checkedListFn (val) {
      this.$emit('selectionChange', this.tableBody[val])
    },

    // 重置相关条件
    emitGetCurrentPageList () {
      let opts = {
        pagesize: this.pagesize,
        currentPage: this.currentPage,
        userFlag: this.userFlag,
        filterOpts: this.filterOpts
      }
      this.$emit('getSelectList', opts)
    },

    handleSortable (prop) {
      // 返回当前所有排序属性的对象集合，true为升序，false或undefined为降序
      // 目前只能排序一种属性，其他都删掉
      for (let i in this.tableSortList) {
        if (i !== prop) {
          delete this.tableSortList[i]
        }
      }

      if (this.tableSortList[prop] == 'desc') {
        this.$set(this.tableSortList, prop, 'asc')
      } else {
        this.$set(this.tableSortList, prop, 'desc')
      }

      this.filterOpts.sort = this.tableSortList
      this.currentPage = 1
      this.emitGetCurrentPageList()
    },

    handleSizeChange (val) {
      this.pagesize = val
      this.currentPage = 1
      this.emitGetCurrentPageList()
    },

    handleCurrentChange (val) {
      this.emitGetCurrentPageList()
    },

    currentWidthFn (e) {
    },

    tableDrag () {
      // 最后一列不可拖动
      let _this = this
      // $("#tmtable").colResizable({
      //   liveDrag: true,
      //   resizeMode: 'overflow',
      //   draggingClass: "dragging",
      //   partialRefresh: true,
      //   onResize: _this.currentWidthFn,
      //   minWidth: 40,
      //   // 第一不能拖动
      //   disabledColumns: [0]
      // })
    }
  },
};
</script>

<style scoped lang="less">
  .common-table {
    .common-table-wrap{
      // padding: 20px;
      background: #ffffff;
    }
    .search-btn-group {
      overflow: hidden;
      position: relative;
    }
    .top-min4 {
      margin-top: -4px;
    }
    .table-cont{
      // width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      .tm-td-summary{
        background: #f5f7fa;
      }
      .tr-even{
        background: #fafafa;
      }
      .tr-tbody{
        &:hover{
          background: #eff3f8;
        }
      }
      .tm-table{
        min-width: 100%;
        text-align: center;
        background: #ffffff;
        font-size: 12px;
        border-top: 1px solid #e6e6e6;
        border-left: 1px solid #e6e6e6;
      }
      .tm-th, .tm-td{
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        padding: 7px 0;
      }
      .tm-td .tm-text-cont{
        color: #aaa;
      }
      // 单选框列的样式
      .tm-td-radio {
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        padding: 7px 5px;
        width: 20px;
        box-sizing: border-box;
      }
      .tm-text-cont{
        overflow: hidden;
        white-space: nowrap;
        padding-right: 4px;
        padding-left: 4px;
        &.sortable{
          cursor: pointer;
        }
        .icon-sort{
          display: inline-block;
          vertical-align: middle;
          width: 12px;
          height: 12px;
          background: url(../images/descending_order.png) no-repeat;
          background-size: 100% 100%;
          &.sort-asce{
            background: url(../images/ascending_order.png) no-repeat;
            background-size: 100% 100%;
          }
        }
        .icon-tips{
          display: inline-block;
          vertical-align: middle;
          width: 12px;
          height: 12px;
          background: url(../images/question_icon.png) no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="less">
  .common-table {
    .JCLRLastGrip{
      display: none;
    }
  }
  // 单选框内容让其不显示, 只用到单选框这个功能
  .common-single-select-table {
    .el-radio__label {
      display: none;
    }
  }
</style>
