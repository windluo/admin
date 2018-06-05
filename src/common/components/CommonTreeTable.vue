<template>
  <div class="common-table" v-show="init!=0">
    <div class="sub-title-cont"><div class="sub-title">{{subTitle}}</div></div>
    <div class="common-table-wrap">
      <!--搜索&新增&删除-->
      <div class="search-btn-group">
        <div class="search-group">
          <slot name="filterSlot"></slot>
        </div>
      </div>
      <!--自定义table组件-->
      <div class="table-cont" ref="tablecont" id="tablecontId" :key="now" v-show="init!=0&&init!=-1">
        <table class="tm-table" id="tmtable" :style="style">
          <tr class="tr-odd">
            <th v-if="selection" class="tm-th" style="width:32px">
              <el-checkbox v-model="checkedAll" @click="checkedAll=!checkedAll" @change="checkedAllFn"></el-checkbox>
            </th>
            <th
              v-for="(jtem, jndex) in tableHeader"
              :key="jndex"
              class="tm-th tm-thj"
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
            <th class="tm-th tm-th-opreating" id="thopreating" v-if="operating" style="width:92px">操作</th>
          </tr>

          <!-- 表体部分 -->
          <tr v-for="(item, index) in tableBody" :key="index" class="tr-tbody" :class="{'tr-even':index%2===0, 'tr-odd':index%2===1}">
            <td v-if="selection" class="tm-td" style="width:40px">
              <el-checkbox v-model="checkedList[index]" @click="checkedList[index]=!checkedList[index]" @change="checkedListFn(index)"></el-checkbox>
            </td>
            <td v-for="(jtem, jndex) in tableHeader" :key="jndex" class="tm-td" :class="{hasLevel: jtem.hasLevel}">
              <!-- 配置某项是否需要按树形展示, 用表头配置字段hasLevel以及相应表体的层级来判断缩进 -->
              <div class="tm-text-cont"
                :class="{twoEm: item.levelTip == 2 && jtem.hasLevel, threeEm: item.levelTip == 3 && jtem.hasLevel}">
                {{item[jtem.prop]}}
              </div>
            </td>

            <!-- 操作项 -->
            <td class="tm-td" v-if="operating">
              <div class="btn-sub-cont">
                <div class="btn-sub" v-if="editBtnFlag" @click="editFn(item, index)">修改</div>
                <div class="btn-sub" v-if="detailBtnFlag" @click="detailFn(item)">明细</div>
              </div>
            </td>

          </tr>
          <tr v-if="summaryArr.length>0">
            <td class="tm-td tm-td-summary" v-for="(item, index) in summaryArr" :key="index">{{item}}</td>
            <td class="tm-td tm-td-summary" v-if="operating"></td>
          </tr>
        </table>
      </div>

      <el-pagination
        v-show="init!=0&&init!=-1" v-if="isShowPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper, slot"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "common-tree-table",
  props: {
    init: {type: Number, default: true}, //进入页面状态，0表示第一次进入页面，-1表示隐藏table和分页，其他状态未细分
    // 按钮的操作目测还要根据用户权限做配置
    btnAuthority: {
      type: Object,
      default: () => {
        return {
          editBtn: true, // 编辑按钮默认可用
          detailBtn: true // 明细按钮默认可用
        }
      }
    },
    // 是否显示分页, 默认显示
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    subTitle: {type: String, default: ''},
    headerList: {type: Array, default: () => {return []}}, //表头，label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
    tableList: {type: Array, default: () => {return []}}, // 表内容，目前只考虑了一级的键值对JSON，格式[{label: 'ID', prop: 'id', sortable: false}]
    total: {type: Number, default: 0}, //table总数据长度，用于计算分页
    resetCheckedFlag: {type: Boolean, default: true}, // 重载数据后是否重置checked状态，默认重置为“未选择”
    selection: {type: Boolean, default: false}, // 启用选择框可以显示删除按钮
    operating: {type: Boolean, default: false}, // 启用每列数据的操作按钮，目前只有编辑、明细
    summaryArr: {type: Array, default: () => {return []}}, // 统计列表，顺序跟headerList对应。第一项最好强制不要统计，不然没标题
    initPageSize: {type: Number, default: 10}, // 默认每页条数 10
  },
  data () {
    return {
      now: Date.now(),
      tableHeader: [], // 接收异步的表头
      tableBody: [], // 接收异步的表体
      checkedAll: false,
      checkedList: [],
      currentPage: 1,
      pageSize: 10,
      filterOpts: {
        sort: {} // 默认按网点Id降序
      },
      currentDataIndex: -1,
      tableSortList: {},
      style: '',
      tableWidth: 0 // table初始高度，resize用
    }
  },
  computed: {
    editBtnFlag () {
      if (this.btnAuthority.editBtn === false) {
        return false
      }
      return true
    },

    detailBtnFlag () {
      if (this.btnAuthority.detailBtn === false) {
        return false
      }
      return true
    }
  },
  watch: {
    tableList: {
      handler (val, oldVal) {
        this.tableBody = val
        this.now = Date.now()
        this.$nextTick(() => {
          this.tableDrag()
          this.tableWidth = $('#tmtable').outerWidth()
          this.resetCheckedList()
        })
      },
      deep: true,
    }
  },
  mounted () {
    this.$nextTick(() =>{
      this.tableBody = this.tableList
      this.tableHeader = this.headerList
      // 给99，防滚动条默认出来
      this.style = 'width:99%;'
      this.resetTableStyle()
      this.resetCheckedList()
      // 初始化返回一个空的selection数组
      this.$emit('selectionChange', [])
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
      if (this.operating) {
        width += 92
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

    editFn (data, index) {
      this.currentDataIndex = index
      this.$emit('handleEdit', data)
    },

    detailFn (data) {
      this.$emit('handleDetail', data)
    },

    getSelection () {
      let delArr = []
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i]) {
          delArr.push(this.tableBody[i])
        }
      }

      return delArr
    },

    resetCheckedList () {
      this.checkedList = []
      this.tableBody.forEach((item) => {
        this.checkedList.push(false)
      })
      this.$emit('selectionChange', this.getSelection())
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
      this.$emit('selectionChange', this.getSelection())
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
      this.$emit('selectionChange', this.getSelection())
    },

    // 重置相关条件
    emitGetCurrentPageList () {
      let opts = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        filterOpts: this.filterOpts
      }
      if (this.selection) {
        // 有选择框才需要resetChecked
        opts.resetChecked = this.resetChecked
      }
      this.$emit('getSortList', opts)
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
      this.pageSize = val
      this.currentPage = 1
      this.emitGetCurrentPageList()
    },

    handleCurrentChange (val) {
      this.emitGetCurrentPageList()
    },

    resetChecked () {
      // 拉取数据后重置checked
      if (this.resetCheckedFlag) {
        this.checkedAll = false
        this.resetCheckedList()
      }
    },

    currentWidthFn (e) {
      let _this = this
    },

    tableDrag () {
      // 最后一列不可拖动
      let _this = this
      $("#tmtable").colResizable({
        liveDrag: true,
        resizeMode: 'overflow',
        draggingClass: "dragging",
        partialRefresh: true,
        onResize: _this.currentWidthFn,
        minWidth: 40,
        // 第一不能拖动
        disabledColumns: [0]
      })
    }
  },
};
</script>
<!-- javascript end -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .common-table {
    .sub-title-cont{
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: #f0f0f0;
    }
    .sub-title{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding-right: 20px;
      padding-left: 20px;
      background: #ffffff;
      font-size: 14px;
    }
    .common-table-wrap{
      padding: 20px;
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
      width: 100%;
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
        min-width: 99%;
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
      .tm-th-opreating{
        width: 92px!important; // 根据按钮数量调整，不加这个响应的时候拖拽会变形
      }
      .tm-td .tm-text-cont{
        color: #aaa;
      }
      .tm-text-cont{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 4px;
        padding-left: 4px;
        &.sortable{
          cursor: pointer;
        }
        .icon-sort{
          display: inline-block;
          vertical-align: middle;
          width: 15px;
          height: 15px;
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
          width: 15px;
          height: 15px;
          background: url(../images/question_icon.png) no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
    }
    .btn-sub-cont{
      width: 92px;
    }
    .btn-sub{
      display: inline-block;
      padding-right: 10px;
      padding-left: 10px;
      position: relative;
      // color: #aaa;
      color: #409EFF;
      cursor: pointer;
      &:hover{
        opacity: 0.7;
      }
      &:after{
        content: "";
        width: 1px;
        height: 100%;
        background: #eaeaea;
        position: absolute;
        top: 0;
        right: 0;
      }
      &:last-child:after{
        display: none;
      }
    }
    // 缩进2格
    .twoEm {
      text-indent: 2em;
    }
    // 缩进4格
    .threeEm {
      text-indent: 4em;
    }
    // 有层次关系时左对齐
    .hasLevel {
      text-align: left;
      padding-left: 12px !important;
    }
  }
</style>
<style lang="less">
  .common-table {
    .JCLRLastGrip{
      display: none;
    }
  }
</style>
