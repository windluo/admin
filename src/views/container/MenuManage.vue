<template>
  <div class="common-templete-style menu-manage-tmpl">
    <common-tree-table
      :sub-title="pageTitle"
      :init="init"
      :btn-authority="btnAuthority"
      :header-list="headerList"
      :table-list="dataList"
      :selection=selectionFlag
      :isShowPagination="false"
      @selectionChange="handleSelectionChange"
      operating
      @handleEdit="editFn"
      ref="CommonTreeTable">
      <!--自定义搜索过滤器，通过ref进行双向数据操作-->
      <div slot="filterSlot">
        <div class="form-search">
          <!-- <div class="form-item">
            <label class="form-item-label">菜单名称：</label>
            <el-input v-model="searchForm.menuName"></el-input>
          </div> -->
          <div class="form-item">
            <!-- <el-button type="warning" @click="searchFormFn">查询</el-button> -->
            <el-button type="primary" @click="addNewFn">新增</el-button>
            <el-button type="danger" @click="deleteIt">删除</el-button>
            <!-- <common-export url="/baseinfo/grid/export" :start-date="startDate" :end-date="endDate"></common-export> -->
          </div>
        </div>
      </div>
    </common-tree-table>
    <!--无图表表格组件 E-->

    <!--弹框组件，有新增、编辑、明细的按需改写form S-->
    <common-move-popup v-model="isShowPopup" :can-hide="!submitLoading" @popupMove="popupMoveFn">
      <h4 slot="title" class="remark-tool-tip-title">{{ popupTitle }}</h4>
      <div class="move-popup-content" slot="content">
        <el-form :model="popupForm" :rules="popupFormRules" ref="popupForm" :show-message=showMessageFlag label-width="100px" class="demo-ruleForm">
          <div class="popup-item">
            <div class="popup-item-content">
              <el-form-item label="菜单名称：" prop="menuName" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.menuName"
                  auto-complete="off" placeholder="输入参数名称">
                </el-input>
              </el-form-item>
              <!-- 菜单类型下拉选择框 -->
              <el-form-item label="菜单类型：" prop="menuType" class="middle">
                <el-select :disabled="editType===2" v-model="popupForm.menuType"
                  ref="popupMenuTypeSelect" filterable placeholder="选择类型">
                  <el-option
                    v-for="item in popupMenuTypeList"
                    filterable
                    :key="item.valueId"
                    :label="item.valueName"
                    :value="item.valueId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="英文名：" prop="menuNameEn" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.menuNameEn"
                  auto-complete="off" placeholder="输入英文名">
                </el-input>
              </el-form-item>
              <!-- 上级菜单下拉选择框 -->
              <el-form-item label="上级菜单：" prop="parentId" class="middle">
                <el-select :disabled="editType===2 || currentParentId == '0' || editType===0" v-model="popupForm.parentId"
                  @change="selectParentIdChange" ref="popupMenuParentIdSelect" filterable clearable placeholder="选择上级菜单">
                  <el-option
                    v-for="item in parentMenuList"
                    filterable
                    :key="item.menuId"
                    :label="item.menuName"
                    :value="item.menuId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="排序：" prop="orderSeq" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.orderSeq"
                  auto-complete="off" placeholder="输入排序值">
                </el-input>
              </el-form-item>
              <!-- 下拉框选择是否显示 -->
              <el-form-item label="是否显示：" prop="displayType" class="middle">
                <el-select :disabled="editType===2" v-model="popupForm.displayType"
                  ref="popupDisplayTypeSelect" filterable placeholder="选择类型">
                  <el-option
                    v-for="item in displayList"
                    filterable
                    :key="item.valueId"
                    :label="item.valueName"
                    :value="item.valueId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="地址：" prop="menuUrl" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.menuUrl"></el-input>
              </el-form-item>

              <el-form-item label="菜单编码：" prop="menuCode" class="middle">
                <el-input type="text" :disabled="editType===2" v-model="popupForm.menuCode"></el-input>
                <!-- <el-select :disabled="editType===2" v-model="popupForm.menuCode"
                  ref="popupMenuCodeSelect" filterable clearable placeholder="选择类型">
                  <el-option
                    v-for="item in menuCodeList"
                    :key="item"
                    :value="item">
                  </el-option>
                </el-select> -->
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
  import CommonDateRangePicker from '@/common/components/CommonDateRangePicker'
  import CommonExport from '@/common/components/CommonExport'
  import CommonErrorTip from '@/common/components/CommonErrorTip'

  // 引入ajax请求
  let [ actionSystemMenuTreelist, actionSystemMenuTreeDelete, actionSystemMenuAdd, actionSystemMenuGet, actionSystemMenuUpdate ] = _actionCreator.init(['menuTreeList', 'menuTreeDelete', 'menuAdd', 'menuGet', 'menuUpdate']);
  // 引入常量类
  import { loadStatus } from '@/common/js/constant.js'

  // 引入所有的模块字段名
  import vueComponent from '@/router/config/importMenuItem.js';
  let componentNameList = Object.keys(vueComponent);

  // 树形菜单转列表的方法
  // function convertMenuTreeToList (list, count) {
  //   if (!(list instanceof Array)) return [];
  //   let level = count, menuList = [];
  //   list.forEach((item, index) => {
  //   })
  // }

  export default {
    name: "menu-manage",
    components: {
      'common-move-popup': CommonMovePopup,
      'common-tree-table': CommonTreeTable,
      'common-date-range-picker': CommonDateRangePicker,
      'common-export': CommonExport,
      'common-error-tip': CommonErrorTip,
    },
    data () {
      return {
        /**全局的 */
        loadCode: loadStatus.code_init, // loading图及提示，99 初始值，状态码在 common\js\constant.js
        loadStatus: loadStatus,
        source: '', // ajax请求中断用
        /**commTable的 */
        pageTitle: '菜单管理', // 当前页标题
        init: 0, // 第一次查询，控制commTable显隐，状态码去组件看
        headerList: [], // 表头，必需
        dataList: [], //表内容
        btnAuthority: {
          editBtn: true, // 编辑按钮默认可用
          detailBtn: false // 明细按钮默认可用
        },
        selectionFlag: true, // 是否需要选择框，配合删除使用
        selectionList: [], // 返回选择框结果，配合删除使用
        /**过滤条件的 */
        searchForm: { // 搜索组的过滤条件，按需设置，排序的sort从表格内传出，表头配好就会带出来，copy就行
          menuName: '',
        },
        /**弹框的 */
        popupTitle: '',
        isShowPopup: false, // 控制弹框显隐
        submitLoading: false, // 新增、编辑提交中？控制一些操作
        popupMenuTypeList: [{valueId: '1', valueName: '菜单'}, {valueId: '2', valueName: '功能按钮'}],
        menuTypeNumberToCh: {
          '1': '菜单',
          '2': '功能按钮',
        },
        // 弹出框对应的字段
        popupForm: {
          menuName: '',
          menuType: '', // '1' 菜单, '2' 功能按钮
          menuNameEn: '',
          orderSeq: '',
          parentId: '',
          menuUrl: '',
          remark: '',
          displayType: '',
          menuCode: '', // 菜单编码
        },
        menuCodeList: [], // 菜单编码选择列表
        menuTree: [], // 后台返回的菜单树
        currentParentId: '', // 点击当前修改项的父级菜单编码
        // 需要校验字段
        popupFormRules: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }
          ],
          menuType: [
            { required: true, message: '请选择菜单类型', trigger: ['blur', 'change'] }
          ],
          menuNameEn: [
            { required: true, message: '请输入菜单英文名称', trigger: ['blur', 'change'] }
          ],
          orderSeq: [
            { required: true, message: '请输入排序值', trigger: ['blur', 'change'] }
          ],
          parentId: [
            { required: true, message: '请选择父级菜单', trigger: ['blur', 'change'] }
          ],
          menuUrl: [
            { required: true, message: '请输入菜单地址', trigger: ['blur', 'change'] }
          ],
          menuCode: [
            { required: true, message: '请选择菜单编码', trigger: ['blur', 'change'] }
          ],
          remark: [
            { required: false, message: '请输入备注值', trigger: ['blur', 'change'] }
          ],
          displayType: [
            { required: true, message: '请选择是否显示项', trigger: ['blur', 'change'] }
          ],
        },
        editType: -1, // 0：新增，1：编辑，2：明细, -1初始化值,置为别的情况
        showMessageFlag: false, // 是否显示form表单校验信息
        // 获取有子菜单的列表
        parentMenuList: [],
        // 是否显示数字字段转成英文字段
        displayTypeChObj: {
          '0': '不显示',
          '1': '显示',
        },
        displayList: [
          {valueId: '0', valueName: '不显示'},
          {valueId: '1', valueName: '显示'},
        ],
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
        // label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
        this.headerList = [
          {label: '菜单名称', prop: 'menuName', hasLevel: true, width: 145},
          {label: '英文名称', prop: 'menuNameEn', width: 72},
          {label: '类型', prop: 'menuTypeCh'},
          {label: '排序', prop: 'orderSeq'},
          {label: '地址', prop: 'menuUrl'},
          {label: '菜单编码', prop: 'menuCode'},
          {label: '可见', prop: 'displayTypeCh'}, // 是否可见后台返回字符串数字, 转成中文名称
          {label: '备注', prop: 'remark'},
        ]
      },

      getDataList () {
        // 查询后台菜单树形结构
        let queryData = {
          rootId: '0',
          modeType: '1',
        };
        this.$store.state.loading = true
        this.loadCode = loadStatus.code_request;
        actionSystemMenuTreelist(queryData).then((res, err) => {
          this.$store.state.loading = false
          // 所有菜单列
          let menuList = [];
          // 所有有子菜单的菜单列
          let parentMenuList = [];
          // 每一项需要显示的值
          let menuItem = {
            menuNameEn: '',
            orderSeq: '',
            menuId: '',
            menuName: '',
            menuType: '',
            menuCode: '',
            remark: '',
            menuUrl: '',
            displayType: '',
          };
          if (res.code === '0') {
            this.menuTree = res.data; // 获取后台返回的菜单树, 用于其他地方的修改
            let treeList = res.data[0].nodes;
            this.init = 1 // 有数据置为1，显示table和分页
            let rootItem = {};
            for (var key in menuItem) {
              rootItem[key] = res.data[0][key];
            }
            if (treeList.length > 0) rootItem.hasNodes = true; // 是否有子项的判断
            parentMenuList.push(rootItem);
            // 取出一级菜单, 先这样写, 该处需要改成递归
            treeList.forEach((item, index) => {
              let objItem = {};
              for (var key in menuItem) {
                objItem[key] = item[key];
              }
              // 区分层级
              objItem.levelTip = 1;
              // 获取菜单显示情况
              objItem.displayTypeCh = this.displayTypeChObj[item.displayType];
              // 设置菜单类型
              objItem.menuTypeCh = this.menuTypeNumberToCh[item.menuType];
              if (item.nodes.length > 0) objItem.hasNodes = true; // 是否有子项的判断
              menuList.push(objItem);
              // 取出二级菜单
              if (item.nodes.length > 0) {
                parentMenuList.push(objItem);
                item.nodes.forEach((twoChild, twoIndex) => {
                  let twoChildItem = {};
                  for (var key in menuItem) {
                    twoChildItem[key] = twoChild[key];
                  }
                  twoChildItem.levelTip = 2;
                  twoChildItem.displayTypeCh = this.displayTypeChObj[twoChild.displayType];
                  // 设置菜单类型
                  twoChildItem.menuTypeCh = this.menuTypeNumberToCh[twoChild.menuType];
                  if (twoChild.nodes.length > 0) twoChildItem.hasNodes = true; // 是否有子项的判断
                  menuList.push(twoChildItem);
                  // 取出三级菜单
                  if (twoChild.nodes.length > 0) {
                    parentMenuList.push(objItem);
                    twoChild.nodes.forEach((threeChild, threeIndex) => {
                      let threeChildItem = {};
                      for (var key in menuItem) {
                        threeChildItem[key] = threeChild[key];
                      }
                      threeChildItem.levelTip = 3;
                      threeChildItem.displayTypeCh = this.displayTypeChObj[threeChild.displayType];
                      // 设置菜单类型
                      threeChildItem.menuTypeCh = this.menuTypeNumberToCh[threeChild.menuType];
                      if (threeChild.nodes.length > 0) threeChildItem.hasNodes = true; // 是否有子项的判断
                      menuList.push(threeChildItem);
                    })
                  }
                });
              }
            });
            this.dataList = menuList;
            this.parentMenuList = parentMenuList;
          } else {
            // 没数据的同时隐藏table和分页
            this.loadCode = loadStatus.code_noData;
            this.init = -1
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
      // 删除选中的菜单
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
              return item.menuId
            })
            // 删除菜单 入参选中的菜单id 例如 '1, 3, 4, 5'
            this.$store.state.loading = true
            actionSystemMenuTreeDelete({menuId: arr.join(',')}, this.source.token).then(res => {
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
      // 新增菜单
      addNewFn (msg) {
        if (this.selectionList.length > 1) {
          this.toastMsg('您好, 新增时至多选择一项!', 'warning', 3000);
          return false;
        } else if (this.selectionList.length > 0) {
          let item = this.selectionList[0];
          // 当选择了某项时, 在某项下面新增. 并且需要判断该项有无子项
          if (!item.hasNodes) {
            this.toastMsg('您好, 该层级菜单不支持增加子菜单!', 'warning', 3000);
            return false;
          }
          this.popupForm.parentId = item.menuId;
        } else {
          this.popupForm.parentId = 0;
        }
        this.popupTitle = '菜单管理-新增';
        this.isShowPopup = true;
        this.editType = 0;
      },
      // 菜单编辑查询某条菜单的信息
      editFn (data) {
        this.popupTitle = '菜单管理-修改';
        let params = {
          menuId: data.menuId,
        }
        this.$store.state.loading = true
        // 查询菜单详细信息
        actionSystemMenuGet(params, this.source.token).then(res => {
          this.$store.state.loading = false
          if (res.code == '0') {
            let resData = res.data;
            // 获取查询到的菜单信息
            let popupForm = {
              menuName: resData.menuName,
              menuType: resData.menuType,
              menuNameEn: resData.menuNameEn,
              orderSeq: resData.orderSeq,
              parentId: resData.parentId,
              menuUrl: resData.menuUrl,
              remark: resData.remark,
              menuId: resData.menuId,
              menuCode: resData.menuCode,
              displayType: resData.displayType,
            };
            this.currentParentId = popupForm.parentId; // 每次弹出修改框设置当前父级菜单id, 用来判断是否上级菜单可选
            this.selectParentIdChange(popupForm.parentId, true); // 设置菜单编码选择的下拉列表
            this.popupForm = popupForm;
            this.isShowPopup = true;
            this.editType = 1;
          }
        }, err => {
          this.$store.state.loading = false
          console.log(err)
        })
      },

      // 弹出框中上级菜单选择框变化时, 确定当前菜单编码的选择列表项
      // 点击编辑按钮时也调用该方法, 因为也需要选择相应的列表数据
      // 该处预留项, 配置某个层级是否有子级, 还是在自己当前层级选择没确定, 以及重复配置某个模块的问题, 不能重复配置
      selectParentIdChange (params, edit = false) {
        // console.log(params);
        if (!edit) this.popupForm.menuCode = ''; // 上级菜单变化时置空当前菜单编码
        let parentMenuCode, menuCodeList = [];
        if (params == '0') parentMenuCode = '';
        this.dataList.forEach(item => {
          if (item.menuId === params) {
            parentMenuCode = item.menuCode;
          }
        })
        // 父级菜单也需要在下拉列表中
        this.parentMenuList.forEach(item => {
          menuCodeList.push(item.menuCode);
        })
        // 设置当前下拉列表选择项 形如 ['system.menu', 'base.menu', 'system']
        componentNameList.forEach(item => {
          menuCodeList.push(parentMenuCode ? `${parentMenuCode}.${item}` : item);
        })
        this.menuCodeList = menuCodeList;
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
              actionSystemMenuAdd(this.popupForm, this.source.token).then(res => {
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
              actionSystemMenuUpdate(this.popupForm, this.source.token).then(res =>{
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
          menuName: '',
          menuType: '',
          menuNameEn: '',
          orderSeq: '',
          parentId: '',
          menuUrl: '',
          remark: '',
          menuCode: '',
          displayType: '',
        }
      },

      popupMoveFn () {
        // 移动隐藏下拉框
        this.$refs.popupMenuTypeSelect.blur()
        this.$refs.popupMenuParentIdSelect.blur()
        this.$refs.popupDisplayTypeSelect.blur()
        // this.$refs.popupMenuCodeSelect.blur()
      }
    },
  };
</script>

<style lang="less">
  .menu-manage-tmpl {
    .form-button{
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