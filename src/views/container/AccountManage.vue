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
						<label class="form-item-label">账号ID：</label>
						<el-input v-model="searchForm.loginId"></el-input>
            <label class="form-item-label">登陆名：</label>
						<el-input v-model="searchForm.userName"></el-input>
            <label class="form-item-label">姓名：</label>
						<el-input v-model="searchForm.nickName"></el-input>
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
              <el-form-item label="父帐号：" prop="superLoginId" class="middle">
                <!-- <el-input type="text" :disabled="editType===2" v-model="popupForm.superLoginId" auto-complete="off"></el-input> -->
								<el-select class="single-select-item"  v-model="popupForm.superLoginId"
                filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in superLoginIdList" :key="item.superLoginIdvalue"
                    :label="item.superLoginId"
                    :value="item.userName">
                  </el-option>
                </el-select>
							</el-form-item>
              <el-form-item label="姓名：" prop="nickName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.nickName" auto-complete="off"></el-input>
							</el-form-item>
              <el-form-item label="登陆名：" prop="userName" class="middle">
								<el-input type="text" :disabled="editType===2" v-model="popupForm.userName" auto-complete="off"></el-input>
							</el-form-item>
              <el-form-item label="密码：" prop="password" class="middle">
								<el-input type="password" :disabled="editType===2" v-model="popupForm.password" auto-complete="off"></el-input>
							</el-form-item>
              <el-form-item label="状态：" prop="validateStatus" class="middle">
								<el-select class="single-select-item"  v-model="popupForm.validateStatus"
                filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in validateStatusList" :key="item.validateStatusvalue"
                    :label="item.validateStatus"
                    :value="item.validateStatusvalue">
                  </el-option>
                </el-select>
							</el-form-item>
              <el-form-item label="账号类型：" prop="type" class="middle">
								<el-select class="single-select-item"  v-model="popupForm.type"
                filterable clearable placeholder="请选择">
                  <el-option v-for="(item, index) in typeList" :key="item.typevalue"
                    :label="item.type"
                    :value="item.typevalue">
                  </el-option>
                </el-select>
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
import sha256 from 'crypto-js/sha256';
// 下面这个action的是ajax请求，常用的（如查询、新增、编辑、删除）都有案例，照着抄就行了
// import { actionSysRoleList, actionSysRoleAdd, actionSysRoleDelete, actionSysRoleGet, actionSysRoleUpdate} from '@/common/js/action'
console.log(_actionCreator.init(['accountList']))
let [actionSystemAccountList, actionSystemAccountAdd, actionSystemAccountGet, actionSystemAccountUpdate, actionSystemAccountDeleteMany ] = _actionCreator.init(['accountList', 'accountAdd', 'accountGet','accountUpdate','accountDeleteMany'])
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
			pageTitle: '系统账号维护', // 当前页标题
			init: 0, // 第一次查询，控制commTable显隐，状态码去组件看
			headerList: [], // 表头，必需
			dataList: [], //表内容
			summaryArr: [], // 表格统计
			totalCount: 0, // 总数据条数
			btnAuthority: {
				editBtn: true, // 编辑按钮默认可用
				detailBtn: false // 明细按钮默认可用
			},
			selectionFlag: true, // 是否需要选择框，配合删除使用
			selectionList: [], // 返回选择框结果，配合删除使用
			/**过滤条件的 */
			searchForm: { // 搜索组的过滤条件，按需设置，排序的sort从表格内传出，表头配好就会带出来，copy就行
        loginId: '',
        userName:'',
        nickName:''
			},
			startDate: '',
			endDate: '',
			/**弹框的 */
			popupTitle: '',
			isShowPopup: false, // 控制弹框显隐
			submitLoading: false, // 新增、编辑提交中？控制一些操作
			popupForm: {
        superLoginId: '',
        nickName:'',
        userName:'',
        password:'',
        validateStatus:'',
        type:'',
        remark:''
			},
			popupFormRules: {
				superLoginId: [
					{ required: true, message: '请输入父账号ID', trigger: ['blur', 'change'] }
        ], //父账号ID校验
        nickName: [
					{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        userName: [
					{ required: true, message: '请输入登陆名', trigger: ['blur', 'change'] }
        ],
        password: [
					{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ],
        validateStatus:[
          { required: true, message: '请选择账号状态', trigger: ['blur', 'change'] }
        ],
        type:[
          { required: true, message: '请选择账号类型', trigger: ['blur', 'change'] }
        ],
      },
      superLoginIdList:[],     //新增时候选择父账号下拉框数据
      validateStatusList:[{validateStatus:'不禁用',validateStatusvalue:'0'},{validateStatus:'禁用',validateStatusvalue:'1'}],
      typeList:[{type:'普通账号',typevalue:'0'},{type:'超级管理员',typevalue:'1'}],
			editType: -1, // 0：新增，1：编辑，2：明细
			currentData: {},
      showMessageFlag: false, // 是否显示form表单校验信息
      saveloginDate:'',  //保存点击编辑时候获取到的loginID
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
      console.log(this.searchForm)
      this.$refs.commontable.filterOpts.search = this.searchForm;
			this.reGetDataList(1)
		},

		setHeaderList () {
			// 设置表头，只需要设置一次
			// 无图表表格组件必需
			// label：标题、prop：属性名、sortable：是否排序、width：固定宽度、tips：提示
			this.headerList = [
				{label: '账号ID', prop: 'loginId', sortable: true, width: 72},
				{label: '父账号', prop: 'superLoginId', sortable: true, width: 72},
				{label: '登陆名', prop: 'userName', sortable: true, width: 72},
				{label: '姓名', prop: 'nickName', sortable: true, tips: '账号的长名称'},
				{label: '上次登陆IP', prop: 'lastLoginIp', sortable: true},
				{label: '创建时间', prop: 'insertTime', sortable: true},
				{label: '状态', prop: 'validateStatus', sortable: true, width: 72},
				{label: '账号类型', prop: 'type', sortable: true, width: 72},
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
				order: 'loginId desc'
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
					if (opts.filterOpts.search.loginId) {
						params.loginId = opts.filterOpts.search.loginId
          }
          if (opts.filterOpts.search.userName) {
						params.userName = opts.filterOpts.search.userName
          }
          if (opts.filterOpts.search.nickName) {
						params.nickName = opts.filterOpts.search.nickName
					}
				}
      }
			this.$store.state.loading = true
      this.loadCode = 10
			actionSystemAccountList(params, this.source.token)
				.then((res) => {
					this.$store.state.loading = false
					this.init = 1 // 有数据置为1，显示table和分页
					if (res.code == '0') {
						if (res.data.datas.length === 0) {
							this.loadCode = 40
							// 没数据的同时隐藏table和分页
							this.init = -1
						}
            this.dataList = this.convertData(res.data.datas);
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
        item.validate == '0'?item.validateStatus = '不禁用': item.validateStatus = '禁用';
        item.type == '0'?item.type = '普通帐号': item.type = '超级管理员';
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
						return item.loginId
          })
					let params = {
						loginIds: arr
          }
          params.loginIds = params.loginIds.join(',')
					this.$store.state.loading = true
      		this.loadCode = 10
					actionSystemAccountDeleteMany(params, this.source.token)
						.then(res => {
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

      //点击新增的时候父账号下拉框里面的数据暂时先拉取到账号列表里面的全部数据， /system/account/list
      let params = {
				order: 'loginId desc'
			}
      actionSystemAccountList(params, this.source.token)
				.then((res) => {
					if (res.code == '0') {
            this.superLoginIdList = this.convertData(res.data.datas);
					} else {

					}
				})
				.catch(err => {
					console.log(err)
				})
		},

		editFn (data) {
			// 弹出编辑框
      // 编辑，先拉取数据
      this.saveloginDate = data
			this.editType = 1
			this.resetTitle('编辑')
      this.isShowPopup = true;
      // 获取数据
      let params = {
				loginId:data.loginId
      }
      actionSystemAccountGet(params, this.source.token)
      .then((res) => {
        if (res.code == '0') {
          this.popupForm.superLoginId = res.data.superLoginId
          this.popupForm.nickName = res.data.nickName
          this.popupForm.userName = res.data.userName
          this.popupForm.validateStatus = res.data.validateStatus
          this.popupForm.type = res.data.type
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
      this.saveloginDate = data
			this.editType = 1
			this.resetTitle('编辑')
      this.isShowPopup = true;
      // 获取数据
      let params = {
				loginId:data.loginId
      }
      actionSystemAccountGet(params, this.source.token)
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
						this.submitEdit(this.saveloginDate.loginId)
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

      // 密码加密处理
      this.popupForm.password = sha256(this.popupForm.password).toString().toLocaleUpperCase();
      let params = this.popupForm
			actionSystemAccountAdd(params, this.source.token)
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
    
    submitEdit(loginId){
      // 提交编辑
      let params = this.popupForm;
      params.loginId = loginId
			actionSystemAccountUpdate(params, this.source.token)
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
<style scoped  lang="less">
.test_2_purity {
	.form-button{
		width: 112px;
	}
}
</style>