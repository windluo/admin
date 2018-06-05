<template>
	<div
		class="common-templete-style params-manage"
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
						<label class="form-item-label">参数编号：</label>
						<el-input v-model="searchForm.paramCode"></el-input>
					</div>
					<div class="form-item">
						<label class="form-item-label">参数名称：</label>
						<el-input v-model="searchForm.paramName"></el-input>
					</div>
					<div class="form-item">
						<label class="form-item-label">参数类型：</label>
						<el-select v-model="searchForm.paramType" filterable clearable placeholder="请选择">
							<el-option
								v-for="item in ParamTypeArr"
								:key="item.valueId"
								:label="item.valueName"
								:value="item.valueId">
							</el-option>
						</el-select>
					</div>
					<div class="form-item">
						<el-button type="warning" @click="searchFormFn">查询</el-button>
						<el-button type="primary" @click="addNewFn">新增</el-button>
          	<el-button type="danger" @click="deleteIt">删除</el-button>
						<!-- <common-export url="/baseinfo/grid/export"></common-export> -->
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
							<el-form-item label="参数编号：" prop="paramCode" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.paramCode" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="参数名称：" prop="paramName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.paramName" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="参数类型：" prop="paramType" class="middle">
								<el-select :disabled="editType===2" v-model="popupForm.paramType" ref="popupParamTypeSelect" placeholder="请选择">
									<el-option
										v-for="item in ParamTypeArr"
										filterable
										:key="item.valueId"
										:label="item.valueName"
										:value="item.valueId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="备注：" prop="remark" class="">
								<el-input type="textarea" :disabled="editType===2" v-model="popupForm.remark"></el-input>
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
let [
	actionSystemParamList, actionSystemParamAdd, actionSystemParamGet, actionSystemParamUpdate, actionParamDelete
 ] = _actionCreator.init(['paramList', 'paramAdd', 'paramGet', 'paramUpdate', 'paramDeleteMany'])
// 下面是一些通用的过滤函数。leftpad：在字符串左边拼接字符，如一位数前面加一个零；convertDate：转日期，把后台日期转成YYYY-MM-DD
import { leftpad, convertDate, assignObjectRight, assignObject, emptyObject, resetTitle } from '@/common/js/filters'

export default {
	name: "params-manage",
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
			pageTitle: '参数配置', // 当前页标题
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
				paramId: '',
				paramCode: '',
				paramType: ''
			},
			// searchType: '', // 1 正常，10 关闭
			/**弹框的 */
			popupTitle: '',
			isShowPopup: false, // 控制弹框显隐
			submitLoading: false, // 新增、编辑提交中？控制一些操作
			ParamTypeArr: [{valueId: '1', valueName: '常量参数'}, {valueId: '2', valueName: '数组参数'}, {valueId: '3', valueName: '字典'}], // 1常量参数，2数组参数，3字典
			popupForm: {
				paramCode: '',
				paramName: '',
				paramType: '',
				remark: ''
			},
			popupFormRules: {
				paramCode: [
					{ required: true, message: '请输入参数编号', trigger: ['blur', 'change'] }
				],
				paramName: [
					{ required: true, message: '请输入参数名称', trigger: ['blur', 'change'] }
				],
				paramType: [
					{ required: true, message: '请选择参数类型', trigger: ['change'] }
				]
			},
			editType: -1, // 0：新增，1：编辑，2：明细
			currentData: {},
			showMessageFlag: false, // 是否显示form表单校验信息
		}
	},
	
	created: function () {
		// 初始化
		this.$store.state.loading = true // 加载数据中，loading
		this.source = this.$axios.CancelToken.source() // 取消ajax请求用。this.$axios已经配置全局，直接拿
		this.setHeaderList() // 设置表头，必需
		this.getDataList() // 表格内容/ 获取运营商，1是过滤器的，2是弹框的。需要就用，没有就不要
	},

	beforeRouteLeave (to, from, next) {
		// 离开页面前，终端ajax请求
		this.source.cancel('Operation canceled by the user.')
		next()
  },

	methods: {
		searchFormFn () {
			// 搜索，排序条件来自表格内
			this.$refs.commontable.filterOpts.search = this.searchForm
			this.reGetDataList(1)
		},

		setHeaderList () {
			// 设置表头，只需要设置一次
			// 无图表表格组件必需
			// label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
			this.headerList = [
				{label: '参数编号', prop: 'paramCode', sortable: true, width: 72},
				{label: '参数名称', prop: 'paramName'},
				{label: '参数类型', prop: 'paramTypeStr', width: 72},
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
				pagesize: opts.pageSize || 10
				// order: 'paramCode desc'
			}
			if (opts.filterOpts) {
				if (opts.filterOpts.sort) {
					for (let i in opts.filterOpts.sort) {
						// headerlist配置好sortable，这里会返回，目前只支持单排
						// order: 'gridId desc'
						params.order = '' + i + ' ' + opts.filterOpts.sort[i]
					}
				}
				assignObjectRight(params, opts.filterOpts.search)
			}
			this.$store.state.loading = true
			this.loadCode = 10
			
			actionSystemParamList(params, this.source.token)
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
			emptyObject(this.popupForm)
			this.$refs.commontable.currentPage = currentPage
			this.editType = -1
			this.isShowPopup = false
		},

		convertData (dataList) {
			// 处理后台返回的数据
			return dataList.map(item => {
        item.paramTypeStr = this.revertParamType(item.paramType)
				return item
			})
		},
		
		revertParamType (type) {
			let res = ''
			for (let i = 0; i < this.ParamTypeArr.length; i++) {
				if (this.ParamTypeArr[i].valueId == type) {
					res = this.ParamTypeArr[i].valueName
					break
				}
			}

			return res
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
						return item.paramId
					})
					let params = {
						paramIds: arr.join(',')
					}
					this.$store.state.loading = true
      		this.loadCode = 10
					actionParamDelete(params, this.source.token)
						.then(res => {
							this.$store.state.loading = false
							if (res.code == "0") {
								this.toastMsg('删除成功！', 'success')
								// 删除成功后重绘列表
								this.$refs.commontable.currentPage = 1
								this.$refs.commontable.emitGetCurrentPageList()
							}
						})
				})
				.catch(err => {
					console.log(err)
      		this.$store.state.loading = false
        })
      }
		},

		addNewFn (msg) {
			// 弹出新增框
			// 先查一下运营商列表，以防后台有更新运营商
      this.editType = 0
			this.popupTitle = resetTitle(this.pageTitle, '新增')
      this.isShowPopup = true
		},

		getParamDetail (data, title, editType) {
			// 获取当前网点详情
			this.popupTitle = resetTitle(this.pageTitle, title)
			let params = {
				paramId: data.paramId
			}
			actionSystemParamGet(params, this.source.token)
				.then(res => {
					if (res.code == '0') {
						let resData = res.data
						this.currentData = resData
						assignObject(this.popupForm, resData)
						this.popupForm.paramType = this.revertParamType(this.popupForm.paramType)
					}
				})
				.then(res => {
					this.editType = editType
					this.isShowPopup = true
				})
		},

		editFn (data) {
			// 弹出编辑框
			// 编辑，先拉取数据
			this.getParamDetail(data, '编辑', 1)
		},

		detailFn (data) {
			// 弹出明细框
			// 明细，先拉取数据
			if (data.paramType == 2) {
				// 数组类型则去明细列表
				this.$emit('getDetailType', data)
			} else {
				this.getParamDetail(data, '明细', 2)
			}
		},

		submitPopupForm (formName) {
			// 提交
			this.submitLoading = true
			this.$refs[formName].validate((valid, invalidFields) => {
				if (valid) {
					if (this.editType === 0) {
						this.submitNew()
					} else if (this.editType === 1) {
						this.submitEdit()
					}
				} else {
					// invalidFields，校验未通过的属性
					// 未在form表单内的，需要手动按规则加入
					this.showNotify(invalidFields, '错误', 'error')
					this.submitLoading = false
				}
			})
		},

		submitNew () {
			// 提交新增
			let params = this.popupForm
			actionSystemParamAdd(params, this.source.token)
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

		submitEdit () {
			// 提交编辑
			let params = {
				paramId: this.currentData.paramId,
				paramCode: this.popupForm.paramCode,
				paramType: this.popupForm.paramType,
				paramName: this.popupForm.paramName,
				remark: this.popupForm.remark
			}
			actionSystemParamUpdate(params, this.source.token)
				.then(res =>{
					this.submitLoading = false
					if (res.code == '0') {
						this.toastMsg('修改成功', 'success')
						this.reGetDataList(this.$refs.commontable.currentPage)
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
			emptyObject(this.popupForm)
			this.currentData = {}
		},

		popupMoveFn () {
			// 移动隐藏下拉框
			// 弹框里没有下拉框的不需要绑定这个函数
			this.$refs.popupParamTypeSelect.blur()
		}
	},
};
</script>
<!-- javascript end -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.params-manage {
	.form-button{
		width: 112px;
	}
}
</style>