<template>
  <div class="common-assembly-template-style role-data-manage-tmpl" v-if="!init">
    <header class="head-title">
      <span>数据权限分配</span>
    </header>

    <!-- 查询条件区域 -->
    <section class="select-condtion clearfloat" v-if="loadCode < 40 && !init">
      <!-- 登录名称输入选择 -->
      <el-radio-group v-model="queryKey" class="condition-top clearfloat" @change="radioSelectChange">
        <div class="condition-top query-login-name">
          <el-radio label="loginName">登录名：</el-radio>
          <el-select v-model="loginId" :disabled="queryKey!='loginName'" clearable filterable placeholder="请选择">
            <el-option v-for="item in accountList"
              :key="item.loginId"
              :label="item.userName"
              :value="item.loginId">
              <span class="pull-down-select-left">{{ item.userName }}</span>
              <span class="pull-down-select-right">{{ item.nickName }}</span>
            </el-option>
          </el-select>
        </div>
        <!-- 角色名称 -->
        <div class="condition-top">
          <el-radio label="roleName">角色名称：</el-radio>
          <el-select v-model="roleId" :disabled="queryKey!='roleName'" clearable filterable placeholder="请选择">
            <el-option v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
              <span class="pull-down-select-left">{{ item.roleName }}</span>
              <span class="pull-down-select-right">{{ roleTyleObj[item.roleType] }}</span>
            </el-option>
          </el-select>
        </div>
      </el-radio-group>
      <!-- 相关按钮 -->
      <div class="el-query condition-top">
        <el-button class="el-query-btn" type="warning" @click="queryData">查询</el-button>
      </div>
    </section>

    <table ref="tableTest" class="role-data-manage-table" v-if="loadCode < 40 && !init">
      <tr>
        <td rowspan="2" class="table-display">
          <!-- 表格数据展示 -->
          <common-single-select-table
            :headerList="headerList" :selection="true"
            :tableList="tableList" :userFlag="userFlag"
            :total="totalNum"
            ref="roleDataSelectTable"
            @getSelectList="getSelectList"
            @selectionChange="selectionRadioChange">
          </common-single-select-table>
        </td>
        <td class="explain-icon-useful" colspan="20">
          提示：<span><img src="../../common/images/lower-level-visible.png" alt="下级可见">下级可见</span><span><img src="../../common/images/just-self-visible.png" alt="仅看自己">仅看自己</span><span><img src="../../common/images/no-select.png" alt="不选中">不选中</span>
        </td>
      </tr>
      <tr>
        <!-- 树形展示 -->
        <td v-for="n in 1" class="tree-display">
          <common-three-status-tree-select
            :configObj="tableConfigObj"
            :dataList="dataList"></common-three-status-tree-select>
        </td>
      </tr>
    </table>
    <section class="submit-content" v-if="loadCode < 40 && !init">
      <el-button type="warning" class="middle form-button" @click="submitContent">
        提&nbsp;交
      </el-button>
    </section>
    <!-- 没有数据提示 -->
    <common-error-tip :loadCode="loadCode"></common-error-tip>
  </div>
</template>

<script>
  /*数据权限分配模块*/
  import CommonErrorTip from '@/common/components/CommonErrorTip'
  // 引入单选table组件
  import CommonSingleSelectTable from '@/common/components/CommonSingleSelectTable'
  // 引入树形选择控件
  import CommonThreeStatusTreeSelect from '@/common/components/CommonThreeStatusTreeSelect'
  let [ actionSystemAccountList, actionSystemRoleList, actionSystemDataAllotGet ] = _actionCreator.init(['accountList', 'roleList', 'dataAllotGet']);
  // 引入深拷贝文件
  import _cloneDeep from "lodash/cloneDeep";
  import Domain from "@/common/js/domain.js";
  export default {
    name: "role-data-manage",
    data () {
      return {
        loading: false,
        pagesize: 10,
        totalNum: 0,
        currentPage: 1,
        // 查询条件
        queryKey: 'loginName',
        // 表头展示
        headerList: [],
        // 表格正文内容
        tableList: [],
        userFlag: '', // 区分当前哪个列表在使用表格
        loadCode: 99, // 99 初始值 10 发起请求时, 20请求成功有数据时, 40 没有数据, 80报错时
        init: true, // 第一次查询
        // 取消请求参数
        source: '',
        tableWidth: '',
        // 树形数据
        dataList: [],
        // 获取用来选择的用户名
        accountList: [],
        loginId: '', // 用户ID
        userName: '', // 登录名
        nickName: '', // 姓名
        // 角色选择列表
        roleList: [],
        roleId: '', // 角色Id
        roleName: '', // 角色Id
        roleTyleObj: {
          '0': '系统角色',
          '1': '数据角色',
        },
        // 树形结构展示数据字段配置
        tableConfigObj: {
          children: 'nodes', // 下级节点名称
          label: 'dataName', // 展示名称
          id: 'dataKeyId', // 唯一id
          status: 'dataFilterType', // 选中情形的字段 0 仅看自己， 1 下级可见 其他任何值 不选中
        },
      }
    },
    components: {
      CommonErrorTip,
      CommonSingleSelectTable,
      CommonThreeStatusTreeSelect,
    },
    created () {
      this.$store.state.loading = false;
      this.source = this.$axios.CancelToken.source();
    },
    mounted: function () {
      this.init = true;
      // 默认查询账号列表数据
      this.getAccountList()
    },
    beforeRouteLeave (to, from, next) {
      this.cancelAxios();
      next()
    },
    methods: {
      // 获取账号列表数据
      getAccountList () {
        let accountData = {
          loginId: this.loginId,
          userName: this.userName,
          nickName: this.nickName,
          pagesize: this.pagesize,
          pagenum: this.currentPage,
          // order: '',
        };
        this.loading = true;
        this.$store.state.loading = true;
        this.loadCode = 10;
        actionSystemAccountList(accountData, this.source.token, false).then(res => {
          this.loading = false;
          this.$store.state.loading = false;
          this.init = false;
          // 重置数据
          this.headerList = [];
          this.tableList = [];
          this.userFlag = 'account';
          if (res.code === '0') {
            this.loadCode = 20;
            // console.log(res);
            this.headerList = [
              {label: '账号ID', prop: 'id'},
              {label: '登录名', prop: 'userName'},
              {label: '姓名', prop: 'nickName'},
            ];
            let resData = res.data;
            this.totalNum = resData.totalNum;
            this.accountList = resData.datas;
            let tableList = [];
            resData.datas.forEach(item => {
              let obj = {};
              obj.id = item.loginId;
              obj.loginId = item.loginId;
              obj.radioChecked = item.loginId;
              obj.userName = item.userName;
              obj.nickName = item.nickName;
              obj.name = 'account'; // 标记当前选中的是哪一个列表的数据
              tableList.push(obj);
            })
            this.tableList = tableList;
          } else {
            this.loadCode = 40;
          }
        }, err => {
          this.loadCode = 80;
          this.loading = false;
          this.$store.state.loading = false;
          console.log(err);
        });
      },
      // 获取角色数据列表
      getRoleDataList () {
        let roleData = {
          roleId: this.roleId,
          roleName: this.roleName,
          pagenum: this.currentPage,
          pagesize: this.pagesize,
          // order: '',
        };
        this.loading = true;
        this.$store.state.loading = true;
        this.loadCode = 10;
        actionSystemRoleList(roleData, this.source.token, false).then(res => {
          this.loading = false;
          this.$store.state.loading = false;
          this.init = false;
          // 重置数据
          this.headerList = [];
          this.tableList = [];
          this.userFlag = 'role';

          if (res.code === '0') {
            let resData = res.data;
            this.totalNum = resData.totalNum;
            // 配置表头
            this.headerList = [
              {label: '角色ID', prop: 'id'},
              {label: '角色名称', prop: 'roleName'},
              {label: '角色类型', prop: 'roleTypeCh'},
            ];
            this.roleList = resData.datas;
            let tableList = [];
            resData.datas.forEach(item => {
              let obj = {};
              obj.id = item.roleId;
              obj.roleId = item.roleId;
              obj.radioChecked = item.roleId;
              obj.roleName = item.roleName;
              obj.roleType = item.roleType;
              obj.roleTypeCh = this.roleTyleObj[item.roleType];
              obj.name = 'role'; // 标记当前选中的是哪一个列表的数据
              tableList.push(obj);
            })
            this.tableList = tableList;

          } else {
            this.loadCode = 40;
          }
        }, err => {
          this.loadCode = 80;
          this.loading = false;
          this.$store.state.loading = false;
          console.log(err);
        })
      },
      // 过滤区域单选框变化时
      radioSelectChange (val) {
        this.currentPage = 1;
        this.$refs.roleDataSelectTable.pagesize = 10; // 重置之前选中的每页显示的条数
        this.pagesize = 10;
        // 用户名查询时
        if (val === 'loginName') {
          this.loginId = '';
          this.userName = '';
          this.nickName = '';
          this.getAccountList();
        } else if (val === 'roleName') {
          this.roleId = '';
          this.roleName = '';
          this.getRoleDataList();
        }
      },
      // 查询过滤区域的数据
      queryData () {
        this.dataList = []; // 每次查询树形数据置空
        this.$refs.roleDataSelectTable.radioSelect = ''; // 当前表格选择项置空
        // 查询用户名刷选的数据
        if (this.queryKey == 'loginName') {
          let flag = false;
          this.accountList.forEach(item => {
            if (item.loginId == this.loginId) {
              this.userName = item.userName;
              this.nickName = item.nickName;
              flag = true;
            }
          })
          if (!flag) { // 清空则查询所有的
            this.userName = '';
            this.loginId = '';
            this.nickName = '';
          }
          this.getAccountList();
        } else if (this.queryKey == 'roleName') {
          let flag = false;
          this.roleList.forEach(item => {
            if (item.roleId == this.roleId) {
              this.roleName = item.roleName;
              flag = true;
            }
          })
          if (!flag) { // 清空则查询所有的
            this.roleName = '';
            this.roleId = '';
          }
          this.getRoleDataList();
        }
      },
      // 表格翻页或者页码改变时调用的方法
      getSelectList (val) {
        // if (!val || (val && val.length <= 0)) return false;
        // 如果是账户查询在使用该页面
        if (val.userFlag === 'account') {
          // 如果每页条数发生变化, 重置到第一页, 重新查询
          if (val.pagesize != this.pagesize) {
            this.pagesize = val.pagesize;
            this.currentPage = 1;
          // 如果只是翻页
          } else {
            this.currentPage = val.currentPage;
          }
          this.getAccountList();
        } else if (this.userFlag === 'role') {
          // 如果每页条数发生变化, 重置到第一页, 重新查询
          if (val.pagesize != this.pagesize) {
            this.pagesize = val.pagesize;
            this.currentPage = 1;
          // 如果只是翻页
          } else {
            this.currentPage = val.currentPage;
          }
          this.getRoleDataList();
        }
      },
      // 表格选择框变化时
      selectionRadioChange (val) {
        // console.log(val)
        let data = {
          relationId: val.id,
          // 关联类型 1 角色-数据 2 用户-数据
          relationType: val.name === 'account' ? '2' : '1',
        };
        actionSystemDataAllotGet(data, this.source.token, false).then(res => {
          if (res.code === '0') {
            // dataKeyId
            let resData = res.data;
            // [
            //   {
            //     dataKeyId: 1,
            //     dataName: '一级 1',
            //     status: 1,
            //     nodes: [
            //       {
            //         dataKeyId: 2,
            //         dataName: '二级 1-1',
            //         status: 3,
            //         nodes: [{
            //           dataKeyId: 3,
            //           dataName: '三级 1-1-1',
            //           status: 2,
            //         }, {
            //           dataKeyId: 4,
            //           dataName: '三级 1-1-2',
            //           status: 1,
            //         }]
            //       },
            //     ]
            //   }
            // ]
            resData.datas[0].dataEntitys[0].isCheck = false; // 第一项不能选择
            this.dataList = [resData.datas[0].dataEntitys[0]];
            // console.log(this.dataList)
          }
        }, err => {
          console.log(err);
        })
      },
      // 提交更改
      submitContent () {
        console.log(this.dataList);
      },
      // 取消ajax请求时调用
      cancelAxios () {
        this.source.cancel('Operation canceled by the user.');
      },
    },
  };
</script>

<style lang="less">
  .role-data-manage-tmpl {
    background-image: url('../../common/images/head_backGround.png');
    background-repeat: repeat-x;
    background-position: top top;
    background-color: #fff;
    .head-title {
      width: 100%;
    }
    .query-login-name {
      margin-right: 30px !important;
    }
    width: 100%;
    height: 100%;
    overflow: auto;
    // 自适应表格样式
    table.role-data-manage-table {
      background-color: #fff;
      // margin-left: 20px;
      td.table-display {
        vertical-align: top;
        padding-left: 20px;
      }
      // 其他列树形展示样式
      td.tree-display {
        padding: 10px 40px 0px 40px;
      }
    }
    // 第一行的样式, 三个图表说明
    .explain-icon-useful {
      height: 14px;
      text-indent: 60px;
      span {
        margin-left: 20px;
      }
      img {
        margin-right: 10px;
        width: 10px;
        height: 10px;
      }
    }
    // 提交按钮样式
    .submit-content {
      margin: 30px;
    }
  }
  // 过滤区域样式
  // 登录名选择下拉列的样式
  .pull-down-select-left {
    float: left;
    margin-right: 15px;
  }
  .pull-down-select-right {
    float: right;
  }
</style>
