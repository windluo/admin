<template>
	<div
		class="common-templete-style test_2"
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
						<label class="form-item-label">网点ID：</label>
						<el-input v-model="searchForm.gridId"></el-input>
					</div>
					<div class="form-item">
						<label class="form-item-label">网点名称：</label>
						<el-input v-model="searchForm.gridName"></el-input>
					</div>
					<div class="form-item">
						<label class="form-item-label">状态：</label>
						<el-select v-model="searchStatus" @change="getSearchStatus" filterable clearable placeholder="请选择">
							<el-option
								v-for="item in statusArr"
								:key="item.valueId"
								:label="item.valueName"
								:value="item.valueId">
							</el-option>
						</el-select>
					</div>
					<div class="form-item">
						<common-address-select @getAddress="getCurrentAddress"></common-address-select>
					</div>
					<div class="form-item">
						<label class="form-item-label">运营商：</label>
						<el-select v-model="searchMerchant" @change="getMerchantSelect" filterable clearable placeholder="请选择">
							<el-option
								v-for="item in merchantList"
								:key="item.valueId"
								:label="item.valueName"
								:value="item.valueId">
							</el-option>
						</el-select>
					</div>
					<div class="form-item">
						<common-date-range-picker label="生效日期：" :defaultDate="defaultDate" @getSelectDate="getSelectDate"></common-date-range-picker>
					</div>
					<div class="form-item">
						<el-button type="warning" @click="searchFormFn">查询</el-button>
						<el-button type="primary" @click="addNewFn">新增</el-button>
          	<el-button type="danger" @click="deleteIt">删除</el-button>
						<common-export url="/baseinfo/grid/export" :params="exportParams"></common-export>
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
						<div class="popup-item-title">所属运营商：</div>
						<div class="popup-item-content">
							<div class="item-content-list">
								<label class="popup-item-label">地区：</label>
								<common-address-select
									ref="popupMerchantAreaSelect"
									hide-label
									:disabled="editType===2||editType===1"
									:default-address="defaultMerchantAddress"
									@getAddress="getPopupMerchantArea"
								>
								</common-address-select>
							</div>
							<el-form-item label="运营商：" prop="merchantId" class="middle">
								<el-select :disabled="editType===2||editType===1" v-model="popupMerchant" @change="getPopupMerchant" ref="popupMerchantSelect" filterable placeholder="请选择">
									<el-option
										v-for="item in popupMerchantList"
										filterable
										:key="item.valueId"
										:label="item.valueName"
										:value="item.valueId">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>
					<div class="popup-item">
						<div class="popup-item-title">网点信息：</div>
						<div class="popup-item-content">
							<el-form-item label="网点名称：" prop="gridName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.gridName" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="网点简称：" prop="gridNameShort" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.gridNameShort" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="地区：" class="is-required">
								<common-address-select
									ref="outletsAddressSelect"
									hide-label
									:disabled="editType===2"
									:default-address="defaultOutletsAddress"
									:validate-state="addressValidateState"
									@getAddress="getOutletsAddress"
								>
								</common-address-select>
							</el-form-item>
							<el-form-item label="地址：" prop="address" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.address"></el-input>
							</el-form-item>
							<el-form-item label="坐标：" prop="position" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.position" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="状态：" prop="status" class="middle">
								<el-select :disabled="editType===2" v-model="popupStatus" @change="getStatus" ref="popupStatusSelect" placeholder="请选择">
									<el-option
										v-for="item in statusArr"
										filterable
										:key="item.valueId"
										:label="item.valueName"
										:value="item.valueId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="运营：" prop="bizStatus" class="middle">
								<el-select :disabled="editType===2" v-model="popupBizStatus" @change="getBizStatus" ref="popupBizStatusSelect" placeholder="请选择">
									<el-option
										v-for="item in bizStatusArr"
										filterable
										:key="item.valueId"
										:label="item.valueName"
										:value="item.valueId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="备注：" prop="remark" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.remark"></el-input>
							</el-form-item>
							<el-form-item label="生效日期：" prop="validateDate" class="middle">
								<el-date-picker
									:disabled="editType===2"
									v-model="popupForm.validateDate"
									clearable
									type="date"
									ref="popupValidateDateSelect"
									placeholder="选择日期"
									@change="getPopupDate"
								>
								</el-date-picker>
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
    <common-error-tip :loadCode="loadCode"></common-error-tip>
	</div>
</template>

<!-- javascript start -->
<script>
import CommonTableNoCharts from '@/common/components/CommonTableNoCharts'
import CommonMovePopup from '@/common/components/CommonMovePopup'
import CommonDateRangePicker from '@/common/components/CommonDateRangePicker'
import CommonExport from '@/common/components/CommonExport'
import CommonErrorTip from '@/common/components/CommonErrorTip'
let CommonAddressSelect = resolve => require.ensure([], () => {resolve(require('@/common/components/CommonAddressSelect.vue'))}, 'CommonAddressSelect')
// 下面是一些通用的过滤函数。leftpad：在字符串左边拼接字符，如一位数前面加一个零；convertDate：转日期，把后台日期转成YYYY-MM-DD
import { leftpad, convertDate, assignObjectRight, assignObject, emptyObject, resetTitle } from '@/common/js/filters'
// _actionCreator在mainjs里已配置
// 下面这个action的是ajax请求，常用的（如查询、新增、编辑、删除）都有案例，照着抄就行了
let [
	actionMerchantList, actionGridList, actionGridGet, actionBaseinfoGridAdd, actionBaseinfoGridUpdate,
	actionBaseinfoGridDelete, actionBaseinfoGridBdelete
]
	= _actionCreator.init(['merchantList', 'gridList', 'gridGet', 'gridAdd', 'gridUpdate', 'gridDelete', 'gridBdelete'])

export default {
	name: "test_2",
	components: {
		'common-move-popup': CommonMovePopup,
		'common-table-no-charts': CommonTableNoCharts,
		'common-date-range-picker': CommonDateRangePicker,
		'common-address-select': CommonAddressSelect,
		'common-export': CommonExport,
		'common-error-tip': CommonErrorTip,
	},
	data() {
		return {
			/**全局的 */
      loadCode: 99, // loading图及提示，99 初始值，状态码在 common\js\constant.js
			source: '', // ajax请求中断用
			/**commTable的 */
			pageTitle: '网点管理', // 当前页标题
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
				gridId: '',
				gridName: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				merchantId: '',
				status: ''
			},
			searchMerchant: '',
			searchStatus: '', // 1 正常，10 关闭
			merchantList: [],
			defaultDate: { startDate: '', endDate: ''},
			startDate: '',
			endDate: '',
			exportParams: {},
			/**弹框的 */
			popupTitle: '',
			isShowPopup: false, // 控制弹框显隐
			submitLoading: false, // 新增、编辑提交中？控制一些操作
			outletsArea: '',
			statusArr: [{valueId: '1', valueName: '正常'}, {valueId: '10', valueName: '关闭'}],
			bizStatusArr: [{valueId: '1', valueName: '仓库'}, {valueId: '2', valueName: '运营'}],
			popupStatus: '',
			popupBizStatus: '',
			popupMerchant: '',
			popupForm: {
				merchantId: '',
				gridName: '',
				gridNameShort: '',
				status: '', // 状态
				bizStatus: '', // 运营状态
				provinceId: '',
				cityId: '',
				districtId: '',
				address: '',
				remark: '',
				validateDate: '',
				position: ''
			},
			popupFormRules: {
				merchantId: [
					{ required: true, message: '请选择运营商', trigger: ['change'] }
				],
				gridName: [
					{ required: true, message: '请输入网点名称', trigger: ['blur', 'change'] }
				],
				gridNameShort: [
					{ required: true, message: '请输入网点简称', trigger: ['blur', 'change'] }
				],
				address: [
					{ required: true, message: '请输入地址', trigger: ['blur', 'change'] }
				],
				status: [
					{ required: true, message: '请选择状态', trigger: ['change'] }
				],
				bizStatus: [
					{ required: true, message: '请选择运营', trigger: ['change'] }
				],
				validateDate: [
					{ required: true, message: '请选择生效日期', trigger: ['change'] }
				],
			},
			addressValidateState: [],
			popupMerchantList: [],
			defaultMerchant: {},
			editType: -1, // 0：新增，1：编辑，2：明细
			currentData: {},
			defaultOutletsAddress: {},
			defaultMerchantAddress: {},
			showMessageFlag: false, // 是否显示form表单校验信息
		}
	},
	
	created: function () {
		// 初始化
		this.$store.state.loading = true // 加载数据中，loading
		this.source = this.$axios.CancelToken.source() // 取消ajax请求用。this.$axios已经配置全局，直接拿
		this.setHeaderList() // 设置表头，必需
		this.getDataList() // 表格内容
		this.getMerchantList({}, 1) // 获取运营商，1是过滤器的，2是弹框的。需要就用，没有就不要
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
		
		getSearchStatus (val) {
			// 过滤条件的状态
			this.searchForm.status = val
		},

		getSelectDate (val) {
			// 过滤条件的生效日期
			this.startDate = val.startDate
			this.endDate = val.endDate
			this.exportParams.startDate = val.startDate
			this.exportParams.endDate = val.endDate
		},

		getMerchantSelect (params) {
			// 过滤条件的商户
			this.searchForm.merchantId = params
		},

		getCurrentAddress (val) {
			// 过滤条件的地址
			let opts = {}
			this.searchForm.provinceId = val.provinceId
			opts.provinceId = val.provinceId
			this.searchForm.cityId = val.cityId
			opts.cityId = val.cityId
			this.searchForm.districtId = val.districtId
			opts.districtId = val.districtId
			this.searchMerchant = ''
			this.getMerchantList(opts, 1)
		},

		getPopupMerchantArea (val) {
			// 弹框所属运营商地址，再获取弹框的运营商列表
			let opts = {}
			opts.provinceId = val.provinceId
			opts.cityId = val.cityId
			opts.districtId = val.districtId
			this.popupMerchant = ''
			this.popupForm.merchantId = ''
			this.getMerchantList(opts, 2)
		},

		getPopupMerchant (params) {
			// 获取弹框运营商
			this.popupForm.merchantId = params
		},

		getOutletsAddress (val) {
			// 弹框网点地址
			this.outletsArea = val
			this.popupForm.provinceId = val.provinceId
			this.popupForm.cityId = val.cityId
			this.popupForm.districtId = val.districtId
			if (this.popupForm.provinceId && this.addressValidateState[0] === 'error') {
				this.$set(this.addressValidateState, 0, 'success')
			}
			if (this.popupForm.cityId && this.addressValidateState[1] === 'error') {
				this.$set(this.addressValidateState, 1, 'success')
			}
			if (this.popupForm.districtId && this.addressValidateState[2] === 'error') {
				this.$set(this.addressValidateState, 2, 'success')
			}
		},

		getStatus (val) {
			// 弹框的状态
			this.popupForm.status = val
		},

		getBizStatus (val) {
			// 弹框的运营状态
			this.popupForm.bizStatus = val
		},

		getPopupDate (val) {
			// 弹框生效日期
			if (!val) {
				this.popupForm.validateDate = ''
			} else {
				let date = new Date(val)
				let year = date.getFullYear()
				let month = leftpad(date.getMonth() + 1, 2, '0')
				let day = leftpad(date.getDate(), 2, '0')
				this.popupForm.validateDate = `${year}-${month}-${day}`
			}
		},

		getMerchantList (opts, type, callFn) {
			// 获取商户列表，通过type区分是过滤条件、弹框
			// type: 1，过滤器的运营商，type：2，弹框的运营商
			opts = opts ? opts : {}
			// 获取目标地区运营商列表
			let params = {}
			if (opts.provinceId) {
				params.provinceId = opts.provinceId
			}
			if (opts.cityId) {
				params.cityId = opts.cityId
			}
			if (opts.districtId) {
				params.districtId = opts.districtId
			}
			actionMerchantList(params, this.source.token)
				.then((res) => {
					if (res.code == "0") {
						if (type === 1) {
							// 过滤器的运营商列表
							this.merchantList = []
						} else {
							// 弹框的运营商列表
							this.popupMerchantList = []
						}
						res.data.datas.forEach((item) => {
							let obj = {
								valueName: item.merchantName,
								valueId: item.merchantId
							}
							if (type === 1) {
								// 过滤器的运营商列表
								this.merchantList.push(obj)
							} else {
								// 弹框的运营商列表
								this.popupMerchantList.push(obj)
							}
							if (callFn && typeof callFn === 'function') {
								callFn()
							}
						})
					}
				})
		},

		setHeaderList () {
			// 设置表头，只需要设置一次
			// 无图表表格组件必需
			// label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
			this.headerList = [
				{label: '网点ID', prop: 'gridId', sortable: true, width: 72},
				{label: '运营商ID', prop: 'merchantId', sortable: true, width: 72},
				{label: '网点名称', prop: 'gridName', sortable: true, tips: '网点的长名称'},
				{label: '校验日期', prop: 'validateDate', sortable: true, width: 72},
				{label: '地址', prop: 'address'}
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
				order: 'gridId desc'
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
				assignObjectRight(params, opts.filterOpts.search)
			}
			this.$store.state.loading = true
			this.loadCode = 10
			actionGridList(params, this.source.token)
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
				item.validateDate = convertDate(item.validateDate)
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
						return item.gridId
					})
					let params = {}
					let actionFn = ''
					if (arr.length <= 1) {
						// 单删
						actionFn = actionBaseinfoGridDelete
						params.gridId = arr.join(',')
					} else {
						// 群删
						actionFn = actionBaseinfoGridBdelete
						params.gridIds = arr.join(',')
					}
					this.$store.state.loading = true
      		this.loadCode = 10
					actionFn(params, this.source.token)
						.then(res => {
							if (res.code == "0") {
								this.toastMsg('删除成功！', 'success')
								// 删除成功后重绘列表
								this.$refs.commontable.currentPage = 1
								this.$refs.commontable.emitGetCurrentPageList()
							}
						})
				})
				.catch(() => {
					console.log(err)
        })
      }
		},

		addNewFn (msg) {
			// 弹出新增框
			// 先查一下运营商列表，以防后台有更新运营商
			this.getMerchantList({}, 2, () => {
				this.editType = 0
				this.popupTitle = resetTitle(this.pageTitle, '新增')
				this.isShowPopup = true
			})
		},

		revertArr (arr, value) {
			// 转换一下status、bizStatus
			let res = ''
			arr.forEach((item) => {
				if (item.valueId == value) {
					res = item.valueName
				}
			})
			return res
		},

		getOutletsMerchant (merchantId, editType) {
			// 查询当前网点的运营商信息
			// 获取所属运营商信息
			let params = {
				merchantId: merchantId
			}
			actionMerchantList(params, this.source.token)
				.then(res => {
					if (res.code == '0') {
						let resData = res.data
						// 插入运营商省市区id
						this.popupMerchant = resData.datas[0].merchantName
						this.defaultMerchantAddress.provinceId = resData.datas[0].provinceId
						this.defaultMerchantAddress.cityId = resData.datas[0].cityId
						this.defaultMerchantAddress.districtId = resData.datas[0].districtId
						this.editType = editType
						this.isShowPopup = true
					}
				})
		},

		getOutletsDetail (data, title, editType) {
			// 获取当前网点详情
			this.popupTitle = resetTitle(this.pageTitle, title)
			let params = {
				gridId: data.gridId
			}
			actionGridGet(params, this.source.token)
				.then(res => {
					if (res.code == '0') {
						let resData = res.data
						this.currentData = resData
						assignObject(this.popupForm, resData)

						this.defaultOutletsAddress.provinceId = resData.provinceId
						this.defaultOutletsAddress.cityId = resData.cityId
						this.defaultOutletsAddress.districtId = resData.districtId
						this.popupStatus = this.revertArr(this.statusArr, resData.status)
						this.popupBizStatus = this.revertArr(this.bizStatusArr, resData.bizStatus)
					}
				})
				.then(res => {
					this.getOutletsMerchant(data.merchantId, editType)
				})
		},

		editFn (data) {
			// 弹出编辑框
			// 编辑，先拉取数据
			this.getOutletsDetail(data, '编辑', 1)
		},

		detailFn (data) {
			// 弹出明细框
			// 明细，先拉取数据
			this.getOutletsDetail(data, '明细', 2)
		},

		validateOthers (invalidFields) {
			// 这里校验不在外部组件的参数，校验规则不在popupFormRules
			// 比如省市区插件
			let len = 0
			if (!this.popupForm.provinceId) {
				invalidFields.provinceId = [{message: '请选择省', field: 'provinceId'}]
				this.$set(this.addressValidateState, 0, 'error')
				len++
			}
			if (!this.popupForm.cityId) {
				invalidFields.cityId = [{message: '请选择市', field: 'cityId'}]
				this.$set(this.addressValidateState, 1, 'error')
				len++
			}
			if (!this.popupForm.districtId) {
				invalidFields.districtId = [{message: '请选择区', field: 'districtId'}]
				this.$set(this.addressValidateState, 2, 'error')
				len++
			}
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
						this.submitEdit()
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
			actionBaseinfoGridAdd(params, this.source.token)
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
			let params = this.popupForm
			params.gridId = this.currentData.gridId
			actionBaseinfoGridUpdate(params, this.source.token)
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
			this.addressValidateState = []
			this.popupMerchant = ''
			this.popupStatus = ''
			this.popupBizStatus = ''
			this.defaultMerchant = {}
			this.defaultOutletsAddress = {}
			this.defaultMerchantAddress = {}
			this.currentData = {}
		},

		popupMoveFn () {
			// 移动隐藏下拉框
			// 弹框里没有下拉框的不需要绑定这个函数
			this.$refs.popupMerchantAreaSelect.blur()
			this.$refs.outletsAddressSelect.blur()
			this.$refs.popupMerchantSelect.blur()
			this.$refs.popupStatusSelect.blur()
			this.$refs.popupBizStatusSelect.blur()
			// 调用element-ui内部暴露的方法, 移动时模拟按取消键的效果让其消失
			this.$refs.popupValidateDateSelect.handleKeydown({keyCode: 27, stopPropagation: () => {}})
		}
	},
};
</script>
<!-- javascript end -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.test_2 {
	.form-button{
		width: 112px;
	}
}
</style>