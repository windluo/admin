<template>
	<div
		class="common-templete-style test_2_purity"
	>
		<!--无图表表格组件 S-->
		<common-table-no-charts
			:sub-title="pageTitle"
			:init="init"
			:btn-authority="btnAuthority"
			:header-list="headerList"
			:table-list="dataList"
			:summary-arr="summaryArr"
			:total="totalCount"
			@getCurrentPageList="getDataList"
			:selection=selectionFlag
			@selectionChange="handleSelectionChange"
			operating
			@handleEdit="editFn"
			@handleDetail="detailFn"
			ref="commontable">
			<!--自定义搜索过滤器，通过ref进行双向数据操作-->
			<div slot="filterSlot">
				<div class="form-search">
					<div class="form-item">
						<label class="form-item-label">角色ID：</label>
						<el-input v-model="searchForm.roleId"></el-input>
            <label class="form-item-label">角色名称：</label>
						<el-input v-model="searchForm.roleName"></el-input>
					</div>
					<div class="form-item">
						<el-button type="warning" @click="searchFormFn">查询</el-button>
						<el-button type="primary" @click="addNewFn">新增</el-button>
          	<el-button type="danger" @click="deleteIt">删除</el-button>
						<common-export url="/baseinfo/grid/export" :start-date="startDate" :end-date="endDate"></common-export>
					</div>
				</div>
			</div>
		</common-table-no-charts>
		<!--无图表表格组件 E-->

		<!--弹框组件，有新增、编辑、明细的按需改写form S-->
		<common-move-popup v-model="isShowPopup" :can-hide="!submitLoading" @popupMove="popupMoveFn">
			<h4 slot="title" class="remark-tool-tip-title">{{popupTitle}}</h4>
			<div class="move-popup-content" slot="content">	
				<el-form :model="popupForm" :rules="popupFormRules" ref="popupForm" :show-message=showMessageFlag label-width="100px" class="demo-ruleForm">
					<div class="popup-item">
						<div class="popup-item-content">
							<el-form-item label="角色名称：" prop="roleName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.roleName" auto-complete="off"></el-input>
							</el-form-item>
              <el-form-item label="角色类型：" prop="roleType" class="middle">
								<el-select class="single-select-item" @change="handleOptionChange" v-model="popupForm.roleType"
                filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in applyList" :key="item.roleTypevalue"
                    :label="item.roleType"
                    :value="item.roleTypevalue">
                  </el-option>
                </el-select>
							</el-form-item>
              <el-form-item label="角色编码：" prop="roleCode" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.roleCode" auto-complete="off"></el-input>
							</el-form-item>
              <el-form-item label="备注：" prop="remark" class="">
								<el-input type="textarea" :disabled="editType===2" v-model="popupForm.remark" auto-complete="off"></el-input>
							</el-form-item>
              
							<el-form-item class="align-center">
								<el-button type="warning" v-if="editType!==2" class="middle form-button" @click="submitPopupForm('popupForm')" :loading="submitLoading">提&nbsp;交</el-button>
								<el-button @click="hidePopupForm('popupForm')" class="middle form-button" :class="{'is-disabled': submitLoading}" v-show="editType!==2">取&nbsp;消</el-button>
								<el-button @click="hidePopupForm('popupForm')" class="middle form-button" v-show="editType===2">关&nbsp;闭</el-button>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</div>
		</common-move-popup>
		<!--弹框组件，有新增、编辑、明细的按需改写form S-->

		<!-- 没有数据提示 -->
    <div v-show="loadCode == 40" class="no-data-tip">
      您好，没有查询到数据，请刷新或者重新输入查询条件！
    </div>
		<div v-show="loadCode >= 80" class="no-data-tip net-error-tip">
      您好，网络异常，请刷新重试！
    </div>
	</div>
</template>

<!-- javascript start -->
<script>
import CommonTableNoCharts from '@/common/components/CommonTableNoCharts'
import CommonMovePopup from '@/common/components/CommonMovePopup'
import CommonExport from '@/common/components/CommonExport'
// 下面这个action的是ajax请求，常用的（如查询、新增、编辑、删除）都有案例，照着抄就行了
// import { actionSysRoleList, actionSysRoleAdd, actionSysRoleDelete, actionSysRoleGet, actionSysRoleUpdate} from '@/common/js/action'
let [actionSystemRoleList, actionSystemRoleAdd, actionSystemRoleDeleteMany, actionSystemRoleGet, actionSystemRoleUpdate ] = _actionCreator.init(['roleList', 'roleAdd', 'roleGet','roleDeleteMany','roleUpdate'])
// 下面是一些通用的过滤函数。leftpad：在字符串左边拼接字符，如一位数前面加一个零；convertDate：转日期，把后台日期转成YYYY-MM-DD
// import { leftpad, convertDate } from '@/common/js/filters'

export default {
	name: "test_2",
	components: {
		'common-move-popup': CommonMovePopup,
		'common-table-no-charts': CommonTableNoCharts,
		'common-export': CommonExport
	},
	data() {
		return {
			/**全局的 */
      loadCode: 99, // loading图及提示，99 初始值，状态码在 common\js\constant.js
			source: '', // ajax请求中断用
			/**commTable的 */
			pageTitle: '系统角色维护', // 当前页标题
			init: 0, // 第一次查询，控制commTable显隐，状态码去组件看
			headerList: [], // 表头，必需
			dataList: [], //表内容
			summaryArr: [], // 表格统计
			totalCount: 0, // 总数据条数
			btnAuthority: {
				editBtn: true, // 编辑按钮默认可用
				detailBtn: true // 明细按钮默认可用
			},
			selectionFlag: true, // 是否需要选择框，配合删除使用
			selectionList: [], // 返回选择框结果，配合删除使用
			/**过滤条件的 */
			searchForm: { // 搜索组的过滤条件，按需设置，排序的sort从表格内传出，表头配好就会带出来，copy就行
        roleId: '',
        roleName:''
			},
			startDate: '',
			endDate: '',
			/**弹框的 */
			popupTitle: '',
			isShowPopup: false, // 控制弹框显隐
			submitLoading: false, // 新增、编辑提交中？控制一些操作
			popupForm: {
        roleName: '',
        roleType:'',
        roleCode:'',
        remark:''
			},
			popupFormRules: {
				roleName: [
					{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleType: [
					{ required: true, message: '请选择角色类型', trigger: ['blur', 'change'] }
        ],
        roleCode: [
					{ required: true, message: '请选择角色编码', trigger: ['blur', 'change'] }
        ]
      },
      applyList:[{roleType:'系统角色',roleTypevalue:'0'},{roleType:'数据角色',roleTypevalue:'1'}], //新增时候选择框角色类型数据
			editType: -1, // 0：新增，1：编辑，2：明细
			currentData: {},
      showMessageFlag: false, // 是否显示form表单校验信息
      saveRaleDate:''
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
    // 新增时候的选择角色类型
    handleOptionChange () {
     
    },

		searchFormFn () {
			// 搜索，排序条件来自表格内
      this.$refs.commontable.filterOpts.search = this.searchForm;
			this.reGetDataList(1)
		},

		setHeaderList () {
			// 设置表头，只需要设置一次
			// 无图表表格组件必需
			// label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
			this.headerList = [
				{label: '角色ID', prop: 'roleId', sortable: true, width: 72},
				{label: '角色编码', prop: 'roleCode', sortable: true, width: 72},
				{label: '角色名称', prop: 'roleName', sortable: true, tips: '角色的长名字'},
				{label: '角色类型', prop: 'roleType', sortable: true, width: 72},
				{label: '备注', prop: 'remark'}
			]
		},

		getDataList (opts) {
			opts = opts ? opts : {}
			// console.log(opts.pageSize, opts.currentPage, JSON.stringify(opts.filterOpts))
			// pageSize：每页多少条数据，currentPage：当前页，filterOpts：排序、搜索参数，是对象
			// demo接口：网点列表
			let params = {
				pagenum: opts.currentPage || 1,
				pagesize: opts.pageSize || 10,
				order: 'roleId desc'
			}
			if (this.startDate) {
				params.startDate = this.startDate
			}
			if (this.endDate) {
				params.endDate = this.endDate
			}
			if (opts.filterOpts) {
				if (opts.filterOpts.sort) {
					for (let i in opts.filterOpts.sort) {
						// headerlist配置好sortable，这里会返回，目前只支持单排
						// order: 'gridId desc'
						params.order = '' + i + ' ' + opts.filterOpts.sort[i]
					}
				}
				if (opts.filterOpts.search) {
					if (opts.filterOpts.search.roleId) {
						params.roleId = opts.filterOpts.search.roleId
          }
          if (opts.filterOpts.search.roleName) {
						params.roleName = opts.filterOpts.search.roleName
					}
				}
      }
			this.$store.state.loading = true
      this.loadCode = 10
			actionSystemRoleList(params, this.source.token)
				.then((res) => {
					this.$store.state.loading = false
					this.init = 1 // 有数据置为1，显示table和分页
					if (res.code == '0') {
						if (res.data.datas.length === 0) {
							this.loadCode = 40
							// 没数据的同时隐藏table和分页
							this.init = -1
						}
            this.dataList = this.convertData(res.data.datas)
						// 目前后端返回的total是总页数
						this.totalCount = res.data.totalNum
						// 顺序与上面一一对应，第一项最好不要做统计，不然没标题
						// 统计时需要关闭select
						// 最后的操作列不需要管
						// this.summaryArr = ['统计值', '', 123, 456, 789, '', '']
					} else {
						this.loadCode = 40
						// 没数据的同时隐藏table和分页
						this.init = -1
					}
				})
				.catch(err => {
					console.log(err)
					this.loadCode = 80
          this.$store.state.loading = false
				})

			// 没有选择框的时候不用加这段代码
			if (this.selectionFlag && opts.resetChecked) {
				opts.resetChecked()
			}
		},

		reGetDataList (currentPage) {
			// 重新拉取列表，用于新增、编辑后
			this.getDataList({
				pageSize: this.$refs.commontable.pageSize,
				currentPage: currentPage,
				filterOpts: this.$refs.commontable.filterOpts,
				resetChecked: this.$refs.commontable.resetChecked // 自定义filter时，resetChecked通过ref拿
			})
			this.$refs.commontable.currentPage = currentPage
			this.editType = -1
			this.isShowPopup = false
		},

		convertData (dataList) {
			// 处理后台返回的数据
			return dataList.map(item => {
        item.roleType == '0'?item.roleType = '系统角色': item.roleType = '数据角色';
				return item
			})
		},

		handleSelectionChange (res) {
			// 列表选择改变
			this.selectionList = res
		},

		deleteIt () {
			// 删除选中的数据
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
						return item.roleId
          })
					let params = {
						roleIds: arr
          }
          params.roleIds = params.roleIds.join(',')
					this.$store.state.loading = true
      		this.loadCode = 10
					actionSystemRoleDeleteMany(params, this.source.token)
						.then(res => {
              console.log()
							if (res.code == "0") {
								this.toastMsg('删除成功！', 'success')
								// 删除成功后重绘列表
								this.currentPage = 1
								this.$refs.commontable.emitGetCurrentPageList()
							}
						})
				})
				.catch((err) => {
					console.log(err)
        })
      }
		},

		resetTitle (title) {
			// 重设弹框标题
			this.popupTitle = this.pageTitle + '—' + title
		},

		addNewFn (msg) {
			// 弹出新增框
			// 先查一下运营商列表，以防后台有更新运营商
			this.editType = 0
			this.resetTitle('新增')
			this.isShowPopup = true
		},

		editFn (data) {
			// 弹出编辑框
      // 编辑，先拉取数据
      this.saveRaleDate = data
			this.editType = 1
			this.resetTitle('编辑')
      this.isShowPopup = true;
      // 获取数据
      let params = {
				roleId:data.roleId
      }
      actionSystemRoleGet(params, this.source.token)
      .then((res) => {
        if (res.code == '0') {
          this.popupForm.roleName = res.data.roleName
          this.popupForm.roleType = res.data.roleType
          this.popupForm.roleCode = res.data.roleCode
          this.popupForm.remark = res.data.remark
          // 顺序与上面一一对应，第一项最好不要做统计，不然没标题
          // 统计时需要关闭select
          // 最后的操作列不需要管
          // this.summaryArr = ['统计值', '', 123, 456, 789, '', '']
        } else {

        }
      })
      .catch(err => {
        console.log(err)
      })
      
		},

		detailFn (data) {
			// 弹出明细框
			// 明细，先拉取数据
			// 弹出编辑框
      // 编辑，先拉取数据
      this.saveRaleDate = data
			this.editType = 1
			this.resetTitle('编辑')
      this.isShowPopup = true;
      // 获取数据
      let params = {
				roleId:data.roleId
      }
      actionSystemRoleGet(params, this.source.token)
      .then((res) => {
        if (res.code == '0') {
          this.popupForm.roleName = res.data.roleName
          this.popupForm.roleType = res.data.roleType
          this.popupForm.roleCode = res.data.roleCode
          this.popupForm.remark = res.data.remark
          // 顺序与上面一一对应，第一项最好不要做统计，不然没标题
          // 统计时需要关闭select
          // 最后的操作列不需要管
          // this.summaryArr = ['统计值', '', 123, 456, 789, '', '']
        } else {

        }
      })
      .catch(err => {
        console.log(err)
      })
		},

		validateOthers (invalidFields) {
			// 没有别的要校验就删掉这个函数
			// 这里校验不在外部组件的参数，校验规则不在popupFormRules
			// 比如省市区插件
			let len = 0
			// 有的要校验就写在这里
			if (len === 0) {
				return {valid: true, invalidFields: invalidFields}
			}

			return {valid: false, invalidFields: invalidFields}
		},

		submitPopupForm (formName) {
      // 提交
			this.submitLoading = true
			this.$refs[formName].validate((valid, invalidFields) => {
				let otherValid = this.validateOthers(invalidFields)
				if (valid && otherValid.valid) {
					if (this.editType === 0) {
						this.submitNew()
					} else if (this.editType === 1) {
						this.submitEdit(this.saveRaleDate.roleId)
          }
          for (let i in this.popupForm) {
            this.popupForm[i] = ''
          }
				} else {
					// invalidFields，校验未通过的属性
					// 未在form表单内的，需要手动按规则加入
					this.showNotify(otherValid.invalidFields, '错误', 'error')
					this.submitLoading = false
				}
			})
		},

		submitNew () {
			// 提交新增
			let params = this.popupForm
			actionSystemRoleAdd(params, this.source.token)
				.then(res =>{
					this.submitLoading = false
					if (res.code == "0") {
						this.toastMsg('新增成功', 'success')
						this.reGetDataList(1)
					}
				})
				.catch(err => {
					console.log(err)
					this.submitLoading = false
				})
    },
    
    submitEdit(roleId){
      // 提交编辑
      let params = this.popupForm;
      params.roleId = roleId
			actionSystemRoleUpdate(params, this.source.token)
				.then(res =>{
					this.submitLoading = false
					if (res.code == "0") {
						this.toastMsg('编辑成功', 'success')
						this.reGetDataList(1)
					}
				})
				.catch(err => {
					console.log(err)
					this.submitLoading = false
				})
    },

		hidePopupForm () {
			// 隐藏弹框，重置所有弹框数据
			if (this.submitLoading) {
				return
			}
			this.isShowPopup = false
			// 重置所有参数
			for (let i in this.popupForm) {
				this.popupForm[i] = ''
			}
			this.currentData = {}
		},

		popupMoveFn () {
			// 移动隐藏下拉框
			// 弹框里没有下拉框的不需要绑定这个函数
			// this.$refs.popupMerchantAreaSelect.blur()
			// this.$refs.outletsAddressSelect.blur()
			// this.$refs.popupMerchantSelect.blur()
			// this.$refs.popupStatusSelect.blur()
			// this.$refs.popupBizStatusSelect.blur()
			// // 调用element-ui内部暴露的方法, 移动时模拟按取消键的效果让其消失
			// this.$refs.popupValidateDateSelect.handleKeydown({keyCode: 27, stopPropagation: () => {}})
		}
	},
};
</script>
<!-- javascript end -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.test_2_purity {
	.form-button{
		width: 112px;
	}
}
</style>