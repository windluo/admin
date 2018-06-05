<template>
  <div class="common-templete-style tmpl-district-manage">
    <common-tree-table
      :sub-title="pageTitle"
      :init="init"
      :btn-authority="btnAuthority"
      :header-list="headerList"
      :table-list="dataList"
      :selection="selectionFlag"
      :isShowPagination="true"
      @selectionChange="handleSelectionChange"
      operating
      @handleEdit="editFn"
      @getSortList="pageChangeFn"
      :total="totalNum"
      ref="CommonTreeTable">
      <!--自定义搜索过滤器，通过ref进行双向数据操作-->
      <div slot="filterSlot">
        <div class="form-search">
          <div class="form-item">
            <label class="form-item-label">地区ID：</label>
            <el-input v-model="searchForm.regionId" placeholder="请输入分类ID"></el-input>
          </div>
          <div class="form-item">
            <label class="form-item-label">地区名称：</label>
            <el-input v-model="searchForm.regionName" placeholder="请输入分类名称"></el-input>
          </div>
          <!-- 按钮区域 -->
          <div class="form-item">
            <el-button type="warning" @click="searchFormFn">查询</el-button>
            <el-button type="primary" @click="addNewFn">新增</el-button>
            <el-button type="danger" @click="deleteIt">删除</el-button>
            <common-export url="/baseinfo/grid/export" :params="exportParams"></common-export>
          </div>
        </div>
      </div>
    </common-tree-table>
    <!--无图表表格组件 E-->

    <!--弹框组件，有新增、编辑、明细的按需改写-->
    <common-move-popup v-model="isShowPopup" :can-hide="!submitLoading" @popupMove="popupMoveFn">
      <h4 slot="title" class="remark-tool-tip-title">{{ popupTitle }}</h4>
      <div class="move-popup-content" slot="content">
        <el-form :model="popupForm" :rules="popupFormRules" ref="popupForm" :show-message=showMessageFlag label-width="100px" class="demo-ruleForm">
          <div class="popup-item">
            <div class="popup-item-content">

              <el-form-item label="地区名称：" prop="regionName" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.regionName"></el-input>
              </el-form-item>

              <el-form-item label="上级名称：" prop="upRegionName" class="middle">
                <el-input type="text" :disabled="true" v-model="popupForm.upRegionName"></el-input>
                <!-- <el-select :disabled="editType===2" v-model="popupForm.upRegionId"
                  ref="popupUpCategoryIdSelect" filterable placeholder="请选择上级ID">
                  <el-option
                    v-for="item in []"
                    filterable
                    :key="item.valueId"
                    :label="item.valueName"
                    :value="item.valueId">
                  </el-option>
                </el-select> -->
              </el-form-item>

              <el-form-item label="地区状态：" prop="status" class="middle">
                <el-select :disabled="editType===2" v-model="popupForm.status"
                  ref="popupAreaStateSelect" filterable placeholder="请选择地区状态">
                  <el-option
                    v-for="item in areaStateList"
                    filterable
                    :key="item.valueId"
                    :label="item.valueName"
                    :value="item.valueId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="排序：" prop="orderby" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.orderby" placeholder="请输入排序值"></el-input>
              </el-form-item>

              <el-form-item label="备注：" prop="remark" class="width-100">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.remark"></el-input>
              </el-form-item>

              <el-form-item class="align-center">
                <el-button type="warning" v-if="editType!==2" class="middle form-button"
                  @click="submitPopupForm('popupForm')" :loading="submitLoading">
                  提&nbsp;交
                </el-button>
                <el-button @click="hidePopupForm('popupForm')" class="middle form-button"
                  :class="{'is-disabled': submitLoading}" v-show="editType!==2">
                  取&nbsp;消
                </el-button>
                <el-button @click="hidePopupForm('popupForm')" class="middle form-button" v-show="editType===2">
                  关&nbsp;闭
                </el-button>
              </el-form-item>
            </div>
          </div>

        </el-form>
      </div>
    </common-move-popup>

    <!-- 没有数据提示 -->
    <common-error-tip :loadCode="loadCode"></common-error-tip>
  </div>
</template>

<script>
  import CommonTreeTable from '@/common/components/CommonTreeTable'
  import CommonMovePopup from '@/common/components/CommonMovePopup'
  import CommonExport from '@/common/components/CommonExport'
  import CommonErrorTip from '@/common/components/CommonErrorTip'

  let [ actionSystemRegionList, actionSystemRegionGet, actionSystemRegionUpdate, actionSystemRegionDeleteMany, actionSystemRegionAdd ] = _actionCreator.init(['regionList', 'regionGet', 'regionUpdate', 'regionDeleteMany', 'regionAdd']);
  // 引入常量类
  import { loadStatus } from '@/common/js/constant.js'

  export default {
    name: "menu-manage",
    components: {
      'common-move-popup': CommonMovePopup,
      'common-tree-table': CommonTreeTable,
      'common-export': CommonExport,
      'common-error-tip': CommonErrorTip,
    },
    data () {
      return {
        /**全局的 */
        loadCode: loadStatus.code_init, // loading图及提示，99 初始值，状态码在 common\js\constant.js
        loadStatus: loadStatus,
        source: '', // ajax请求中断用
        exportParams: {},
        /**commTable的 */
        pageTitle: '地区信息维护', // 当前页标题
        init: 1, // 第一次查询，控制commTable显隐，状态码去组件看
        headerList: [], // 表头，必需
        dataList: [], //表内容
        btnAuthority: {
          editBtn: true, // 编辑按钮默认可用
          detailBtn: false // 明细按钮默认可用
        },
        selectionFlag: true, // 是否需要选择框，配合删除使用
        selectionList: [], // 返回选择框结果，配合删除使用
        /**过滤条件的 */
        searchForm: { // 搜索组的过滤条件，按需设置，排序的sort从表格内传出
          regionName: '',
          regionId: '',
        },
        // 分页的参数
        totalNum: 1, // 总条数
        /**弹框的 */
        popupTitle: '',
        isShowPopup: false, // 控制弹框显隐
        submitLoading: false, // 新增、编辑提交中？控制一些操作
        // 弹出框对应的字段
        popupForm: {
          regionId: '',
          regionName: '',
          upRegionId: '',
          upRegionName: '',
          level: '',
          orderby: '',
          status: '',
          remark: '',
        },
        // 需要校验字段
        popupFormRules: {
          regionName: [
            { required: true, message: '请输入地区名称', trigger: ['blur', 'change'] }
          ],
          status: [
            { required: true, message: '请选择地区名称', trigger: ['blur', 'change'] }
          ],
          orderby: [
            { required: true, message: '请输入排序值', trigger: ['blur', 'change'] }
          ],
        },
        // 地区状态选择列表
        areaStateList: [{valueId: 1, valueName: '正常'}, {valueId: 0, valueName: '关闭'}],
        areaStateObj: {0: '关闭', 1: '正常'},
        areaLevelObj: {1: '一级', 2: '二级', 3: '三级'},
        editType: -1, // 0：新增，1：编辑，2：明细, -1初始化值,置为别的情况
        showMessageFlag: false, // 是否显示form表单校验信息
      }
    },
    created: function () {
      // 初始化
      this.$store.state.loading = true // 加载数据中，loading
      this.source = this.$axios.CancelToken.source() // 取消ajax请求用。this.$axios已经配置全局，直接拿
      this.setHeaderList() // 设置表头，必需
      this.getDataList() // 表格内容
    },

    beforeRouteLeave (to, from, next) {
      // 离开页面前，终端ajax请求
      this.source.cancel('Operation canceled by the user.')
      next()
    },

    methods: {
      searchFormFn () {
        // 搜索，排序条件来自表格内
        this.$refs.CommonTreeTable.filterOpts.search = this.searchForm
        this.reGetDataList()
      },

      setHeaderList () {
        // label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示 hasLevel 树形 有层次关系
        this.headerList = [
          { label: '地区ID', prop: 'regionId', width: 90 },
          { label: '地区名称', prop: 'regionName', hasLevel: true },
          { label: '地区级别', prop: 'levelCh', width: 90 },
          { label: '排序', prop: 'orderby' },
          { label: '地区状态', prop: 'statusCh', width: 90 },
          { label: '备注', prop: 'remark' },
        ]
      },
      // 翻页处理逻辑
      pageChangeFn (params) {
        if (params.resetChecked) params.resetChecked(); // 如果当前页有选择的全部重置
        let data = {
          regionId: this.searchForm.regionId,
          regionName: this.searchForm.regionName,
          pagesize: params.pageSize,
          pagenum: params.currentPage,
        };
        this.getDataList(data);
      },

      getDataList (params) {
        // 查询后台地址列表结构
        let queryData = {
          regionId: this.searchForm.regionId,
          regionName: this.searchForm.regionName,
          pagenum: '1',
          pagesize: '10',
          // order: '1',
        };
        let data = params;
        if (!params) data = queryData;
        this.$store.state.loading = true
        this.loadCode = loadStatus.code_request;
        actionSystemRegionList(data).then((res, err) => {
          this.$store.state.loading = false
          if (res.code === '0') {
            let resData = res.data;
            this.totalNum = window.parseInt(resData.totalNum);
            resData.datas.forEach(item => {
              item.levelTip = item.level; // 设置表格统一级别
              item.statusCh = this.areaStateObj[item.status]; // 设置状态中文名称
              item.levelCh = this.areaLevelObj[item.level]; // 设置级别中文名称
            })
            this.dataList = resData.datas;
          } else {
            this.loadCode = loadStatus.code_noData
          }
        }, err => {
          this.loadCode = loadStatus.code_err
          this.$store.state.loading = false
        });
      },
      // 重新拉取列表，用于新增, 编辑, 删除后
      reGetDataList () {
        this.editType = -1
        this.isShowPopup = false
        // 之前table组件选中的重置, 即变成非选中状态
        this.$refs.CommonTreeTable.resetChecked();
        // 再次查询数据
        this.getDataList();
      },

      // 表格选择框选中的项
      handleSelectionChange (res) {
        // 列表选择改变
        this.selectionList = res
      },
      // 删除选中的地址
      deleteIt () {
        if (this.selectionList.length <= 0) {
          this.toastMsg('请选择要删除的数据!', 'warning')
          return
        } else {
          this.$confirm('请确认删除数据！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let arr = this.selectionList.map((item) => {
              return item.regionId
            })
            // 删除选中地址数据
            this.$store.state.loading = true
            actionSystemRegionDeleteMany({regionIds: arr.join(',')}, this.source.token).then(res => {
              this.$store.state.loading = false
              if (res.code == "0") {
                this.toastMsg('删除成功！', 'success')
                // 删除成功后重新查询数据, 调用公共菜单表格组件里面方法, 需要重置内部一些参数
                this.reGetDataList()
              }
            }, err => {
              this.$store.state.loading = false
            })
          }).catch((err) => {
            this.$store.state.loading = false
            console.log(err)
          })
        }
      },
      // 新增地址
      addNewFn (msg) {
        if (this.selectionList.length > 1) {
          this.toastMsg('您好, 新增时至多选择一项!', 'warning', 3000);
          return false;
        } else if (this.selectionList.length > 0) {
          let item = this.selectionList[0];
          this.popupForm.upRegionId = item.regionId;
          this.popupForm.upRegionName = item.regionName;
        } else {
          this.popupForm.upRegionId = 0;
          this.popupForm.upRegionName = '中国';
        }
        this.popupTitle = '地区信息维护-新增';
        this.isShowPopup = true;
        this.editType = 0;
      },
      // 地址编辑查询某条地址的信息
      editFn (data) {
        this.popupTitle = '地区信息维护-修改';
        let params = {
          regionId: data.regionId,
        }
        this.$store.state.loading = true
        // 查询菜单详细信息
        actionSystemRegionGet(params, this.source.token).then(res => {
          this.$store.state.loading = false
          if (res.code == '0') {
            let resData = res.data;
            // 获取查询到的地址信息
            let popupForm = {
              regionId: resData.regionId,
              regionName: resData.regionName,
              upRegionId: resData.upRegionId,
              upRegionName: resData.upRegionName,
              level: resData.level,
              orderby: resData.orderby,
              status: resData.status,
              remark: resData.remark,
            };
            this.popupForm = popupForm;
            this.isShowPopup = true;
            this.editType = 1;
          }
        }, err => {
          this.$store.state.loading = false
          console.log(err)
        })
      },

      // 校验表单里面其他引入的组件, 目前暂时没用到其他的,先留着
      validateOthers (invalidFields) {
        return {valid: true, invalidFields: invalidFields}
      },
      // 提交新增或者修改
      submitPopupForm (formName) {
        this.submitLoading = true
        // 校验表单填写是否正确
        this.$refs[formName].validate((valid, invalidFields) => {
          let otherValid = this.validateOthers(invalidFields)
          if (valid && otherValid.valid) {
            if (this.editType === 0) {
              // 提交新增
              this.$store.state.loading = true
              this.submitLoading = true
              // 调用新增菜单接口
              actionSystemRegionAdd(this.popupForm, this.source.token).then(res => {
                this.$store.state.loading = false
                this.submitLoading = false
                if (res.code == "0") {
                  this.toastMsg('新增成功', 'success')
                  this.hidePopupForm() // 清空数据
                  this.reGetDataList() // 重新读取数据
                }
              }, err => {
                this.$store.state.loading = false
                this.submitLoading = false
                console.log(err)
              });
              // 编辑修改提交后台
            } else if (this.editType === 1) {
              this.submitLoading = true
              actionSystemRegionUpdate(this.popupForm, this.source.token).then(res =>{
                this.submitLoading = false
                if (res.code == '0') {
                  this.toastMsg('修改成功', 'success')
                  this.hidePopupForm() // 清空数据
                  this.reGetDataList() // 重新读取数据
                }
              })
              .catch(err => {
                console.log(err)
                this.submitLoading = false
              })
            }
          } else {
            // invalidFields，校验未通过的属性
            // 未在form表单内的，需要手动按规则加入
            this.showNotify(otherValid.invalidFields, '错误', 'error')
            this.submitLoading = false
          }
        })
      },

      // 弹框确认或者取消按钮
      hidePopupForm () {
        // 提交时不能操作按钮
        if (this.submitLoading) {
          return
        }
        this.isShowPopup = false
        // 重置所有参数
        this.popupForm = {
          regionId: '',
          regionName: '',
          upRegionId: '',
          upRegionName: '',
          level: '',
          orderby: '',
          status: '',
          remark: '',
        }
      },

      popupMoveFn () {
        // this.$refs.popupUpCategoryIdSelect.blur()
        this.$refs.popupAreaStateSelect.blur()
      }
    },
  };
</script>

<style lang="less">
  .tmpl-district-manage {
    .form-button {
      width: 112px;
    }
    .width-100 {
      width: 100%;
      .el-textarea textarea {
        resize: none;
        font-size: 14px;
      }
      .el-input input {
        font-size: 14px;
        width: 506px;
      }
    }
  }
</style>
