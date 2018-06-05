<template>
  <div class="account-role-manage-tmpl">
    <header class="head-title">
      账号列表
    </header>
    <section class="select-condtion">
      <span>应用: </span>
      <el-select class="single-select-item" @change="handleOptionChange" v-model="modelValueName"
        filterable clearable placeholder="请选择">
        <el-option v-for="(item, index) in applyList" :key="item.valueId"
          :label="item.valueName"
          :value="item.valueId">
        </el-option>
      </el-select>
      <el-button class="el-query-btn" type="warning" @click="queryAccountList">查询</el-button>
    </section>
    <section class="tree-select">
      <el-tree v-show='loadCode==loadStatus.code_hasData' :highlight-current="true" :default-expand-all="true"
        :data="accountList" :props="defaultProps"
        node-key="accountRoleManageAccountList"
        @node-click="handleNodeClick">
      </el-tree>
      <!-- 占空内容 -->
      <span v-show='loadCode!=loadStatus.code_hasData' style="visibility: hidden">ee</span>
    </section>
  </div>
</template>

<script>
  import { loadStatus } from '@/common/js/constant.js';
  export default {
    name: 'account-role-manage',
    data () {
      return {
        applyList: [
          {
            valueName: '招财猫管理系统',
            valueId: '123214213213',
          }
        ],
        modelValueName: '',
        // 账号列表
        accountList: [
          {
            userName: '账号列表',
            children: [
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'userName'
        },
        loading: true,
        loadCode: loadStatus.code_init,
        loadStatus: loadStatus,
      }
    },
    components: {
    },
    computed: {
    },
    props: {
    },
    created: function () {
    },
    mounted () {
    },
    methods: {
      handleOptionChange () {
      },
      handleNodeClick (params) {
        console.log(params);
      },
      // 查询账号列表数据
      queryAccountList () {
        // 查询后台数据逻辑
      },
    },
  };
</script>

<style scoped lang="less">
  .account-role-manage-tmpl {
    // 头部标题样式
    .head-title {
      line-height: 30px;
      background-color: #fff;
      font-size: 14px;
      padding: 0 20px;
      display: inline-block;
      text-align: center;
      color: #6F6C68;
    }
    // 条件选择框样式
    .select-condtion {
      line-height: 30px;
      background-color: #fff;
      padding: 10px 20px 0px;
      position: relative;
      z-index: 1;
      .el-query-btn {
        margin-left: 5px;
      }
    }
    // 树形选择样式
    .tree-select {
      position: absolute;
      padding-top: 10px;
      top: 90px;
      bottom: 10px;
      background-color: #fff;
      overflow-y: auto;
      min-width: 200px;
    }
  }
</style>
