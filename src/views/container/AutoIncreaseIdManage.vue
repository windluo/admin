<template>
	<div class="common-templete-style auto-increaseId-manage">
    <common-table-no-charts
			:sub-title="pageTitle"
			:init="init"
			:btn-authority="btnAuthority"
			:header-list="headerList"
			:table-list="dataList"
			:summary-arr="summaryArr"
			:total="totalCount"
			operating
			:selection=selectionFlag
			@selectionChange="handleSelectionChange"
			@getCurrentPageList="getDataList"
			@handleEdit="editFn"
			ref="commontable">
			<!--自定义搜索过滤器，通过ref进行双向数据操作-->
			<div slot="filterSlot">
				<div class="form-search">
					<div class="form-item">
						<label class="form-item-label">自增ID编号：</label>
						<el-input v-model="searchForm.idCode"></el-input>
					</div>
					<div class="form-item">
						<label class="form-item-label">自增ID名称：</label>
						<el-input v-model="searchForm.idName"></el-input>
					</div>
					<div class="form-item">
						<el-button type="warning" @click="searchFormFn">查询</el-button>
						<el-button type="primary" @click="addNewFn">新增</el-button>
          	<el-button type="danger" @click="deleteIt">删除</el-button>
          	<!-- <el-button type="info" @click="download">导出</el-button> -->
					</div>
				</div>
			</div>
		</common-table-no-charts>
		<common-move-popup v-model="isShowPopup" :can-hide="!submitLoading">
			<h4 slot="title" class="remark-tool-tip-title">{{popupTitle}}</h4>
			<div class="move-popup-content" slot="content">	
				<el-form :model="popupForm" :rules="popupFormRules" ref="popupForm" :show-message=showMessageFlag label-width="120px" class="demo-ruleForm">
					<div class="popup-item">
						<div class="popup-item-content">
							<el-form-item label="自增ID编号：" prop="idCode" class="middle">
								<el-input type="text" :disabled="editType===1||editType===2" v-model="popupForm.idCode" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="自增ID子编号：" prop="idSubCode" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.idSubCode" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="自增ID名称：" prop="idName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.idName" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="自增ID长度：" prop="idLength" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.idLength" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="自增ID前缀：" prop="idPre" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.idPre" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="当前值：" prop="idValue" class="middle">
								<el-input type="text" :disabled="editType===1||editType===2" v-model="popupForm.idValue" auto-complete="off"></el-input>
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
import { convertDate, assignObjectRight, assignObject, emptyObject, resetTitle } from '@/common/js/filters'
let [
	actionSystemAutoIdList, actionSystemAutoIdAdd, actionSystemAutoIdGet, actionSystemAutoIdUpdate, actionAutoIdDelete
 ] = _actionCreator.init(['autoIdList', 'autoIdAdd', 'autoIdGet', 'autoIdUpdate', 'autoIdDeleteMany'])

export default {
	name: "auto-increaseId-manage",
	components: {
		'common-move-popup': CommonMovePopup,
		'common-table-no-charts': CommonTableNoCharts
	},
  data() {
    return {
			// 取消请求参数
			source: '',
			pageTitle: '自增ID管理',
			init: 0, // 第一次查询
			loadCode: 99, // 99 初始值 1 发起请求时, 3 没有数据或者报错时
			btnAuthority: {
				editBtn: true, // 编辑按钮默认可用
				detailBtn: false // 明细按钮默认可用
			},
			headerList: [],
			dataList: [],
			summaryArr: [],
			totalCount: 0,
			selectionFlag: true,
			selectionList: [],
			searchForm: {
				idCode: '',
				idName: ''
			},
			popupForm: {
				idCode: '',
				idSubCode: '',
				idName: '',
				idLength: '',
				idPre: '',
				idValue: '',
				remark: ''
			},
			popupFormRules: {
				idCode: [
					{ required: true, message: '请输入自增ID编号', trigger: ['blur', 'change'] }
				],
				idSubCode: [
					{ required: true, message: '请输入自增ID子编号', trigger: ['blur', 'change'] }
				],
				idName: [
					{ required: true, message: '请输入自增ID名称', trigger: ['blur', 'change'] }
				],
				idLength: [
					{ required: true, message: '请输入自增ID长度', trigger: ['blur', 'change'] }
				],
				idPre: [
					{ required: true, message: '请输入自增ID前缀', trigger: ['blur', 'change'] }
				],
				idValue: [
					{ required: true, message: '请输入自增ID当前值', trigger: ['blur', 'change'] }
				]
			},
			isShowPopup: false,
			submitLoading: false,
			popupTitle: '',
			editType: -1, // 0：新增，1：编辑，2：明细
			currentData: {},
			showMessageFlag: false,
		};
	},
	
  created: function() {
		// 初始化
		this.$store.state.loading = true
    this.initFn()
	},

	beforeRouteLeave (to, from, next) {
		this.cancelAxios()
		next()
	},

  methods: {
		cancelAxios () {
			// 中断请求
			this.source.cancel('Operation canceled by the user.');
		},

		initFn () {
			// 取消请求用
			this.source = this.$axios.CancelToken.source()
			this.setHeaderList()
			this.getDataList()
		},

		searchFormFn () {
			this.$refs.commontable.filterOpts.search = this.searchForm
			this.$refs.commontable.currentPage = 1
			this.getDataList({
				pageSize: this.$refs.commontable.pageSize,
				currentPage: 1,
				filterOpts: this.$refs.commontable.filterOpts,
				resetChecked: this.$refs.commontable.resetChecked // 自定义filter时，resetChecked通过ref拿
			})
		},

		handleSelectionChange (res) {
			this.selectionList = res
		},

		setHeaderList () {
			// 设置表头，只需要设置一次
			this.headerList = [
				{label: '自增ID编号', prop: 'idCode', sortable: true},
				{label: '自增ID子编号', prop: 'idSubCode'},
				{label: '自增ID名称', prop: 'idName'},
				{label: '自增ID长度', prop: 'idLength'},
				{label: '自增ID前缀', prop: 'idPre'},
				{label: '当前值', prop: 'idValue'},
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
				orderType: 'desc' // 默认降序
			}
			if (opts.filterOpts) {
				if (opts.filterOpts.sort) {
					for (let i in opts.filterOpts.sort) {
						params.orderType = opts.filterOpts.sort[i]
						params.orderFiled = i
					}
				}
				assignObjectRight(params, opts.filterOpts.search)
			}
			this.$store.state.loading = true
      this.loadCode = 10
			actionSystemAutoIdList(params, this.source.token)
				.then((res) => {
					this.$store.state.loading = false
					this.init = 1
					if (res.code == '0') {
						if (res.data.datas.length === 0) {
							this.loadCode = 40
							// 没数据的同时隐藏table和分页
							this.init = -1
						}
						this.dataList = this.convertData(res.data.datas)
						this.totalCount = res.data.totalNum
						// 顺序与上面一一对应，第一项最好不要做统计，不然没标题
						// 统计时需要关闭select
						// 最后的操作列不需要管
						// this.summaryArr = ['统计值', '', 123, 456, 789, '', '']
					} else {
						this.loadCode = 40
						this.init = -1
					}
				})
				.catch(err => {
					this.loadCode = 80
          this.$store.state.loading = false
				})

			// 没有选择框的时候不用加这段代码
			if (this.selectionFlag && opts.resetChecked) {
				opts.resetChecked()
			}
		},
		convertData (dataList) {
			return dataList.map(item => {
				// item.insertTime = convertDate(item.insertTime)
				return item
			})
		},

		addNewFn () {	
			this.popupTitle = resetTitle(this.pageTitle, '新增')
			this.editType = 0
			this.isShowPopup = true
		},

		getCurrentDetail (data, title, editType) {
			let params = {
				seqId: data.seqId
			}
			actionSystemAutoIdGet(params, this.source.token)
				.then(res => {
					if (res.code == '0') {
						let resData = res.data
						this.currentData = resData
						assignObject(this.popupForm, resData)
					}
				})
				.then(res => {
					this.popupTitle = resetTitle(this.pageTitle, title)
					this.editType = editType
					this.isShowPopup = true
				})
		},

		editFn (data) {
			this.getCurrentDetail(data, '编辑', 1)
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
						return item.seqId
					})
					let params = {
						seqIds: arr.join(',')
					}
					this.$store.state.loading = true
      		this.loadCode = 10
					actionAutoIdDelete(params, this.source.token)
						.then(res => {
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
        })
      }
		},

		download () {
			console.log('导出')
		},

		hidePopupForm () {
			if (this.submitLoading) {
				return
			}
			this.isShowPopup = false
			// 重置所有参数
			emptyObject(this.popupForm)
			this.currentData = {}
		},

		reGetDataList (currentPage) {
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

		submitPopupForm (formName) {
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
			let params = {
				idCode: this.popupForm.idCode,
				idSubCode: this.popupForm.idSubCode,
				idName: this.popupForm.idName,
				idLength: this.popupForm.idLength,
				idPre: this.popupForm.idPre,
				idValue: this.popupForm.idValue,
				remark: this.popupForm.remark
			}
			actionSystemAutoIdAdd(params, this.source.token)
				.then(res =>{
					this.submitLoading = false
					if (res.code == "0") {
						this.toastMsg('新增成功', 'success')
						this.reGetDataList(1)
					}
				})
				.catch(err => {
					this.submitLoading = false
				})
		},
		submitEdit () {
			let params = {
				idCode: this.popupForm.idCode,
				idSubCode: this.popupForm.idSubCode,
				idName: this.popupForm.idName,
				idLength: this.popupForm.idLength,
				idPre: this.popupForm.idPre,
				idValue: this.popupForm.idValue,
				remark: this.popupForm.remark
			}
			actionSystemAutoIdUpdate(params, this.source.token)
				.then(res =>{
					this.submitLoading = false
					if (res.code == "0") {
						this.toastMsg('修改成功', 'success')
						this.reGetDataList(this.$refs.commontable.currentPage)
					}
				})
				.catch(err => {
					this.submitLoading = false
				})
		},
	}
};
</script>
<!-- javascript end -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.auto-increaseId-manage {
	.move-popup-content{
		width: 700px;
	}
}
</style>
<style lang="less">
.auto-increaseId-manage{
	.popup-item{
		.el-textarea__inner{
			width: 546px;
		}
	}
}
</style>
