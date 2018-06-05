<template>
	<div class="template-left-sidebar">
    <el-menu class="el-menu-sidebar"
      background-color="#3A3834" text-color="#6F6C68" active-text-color="#FD9938" :unique-opened="isUniqueOpened"
      @open="handleOpen" @close="handleClose" @select="handleSelect"
      :collapse="$store.state.isHiddenSidebar">
      <template v-for="(item, index) in sidebarList">
        <el-submenu :index="item.menuCode" v-if="item.nodes.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </template>
          <template v-for="(subItem, subIndex) in item.nodes">
            <el-submenu :index="subItem.menuCode"
              v-if="subItem.nodes.length > 0">
              <span slot="title">{{ subItem.menuName }}</span>
              <!-- 三级菜单 -->
              <el-menu-item v-for="(el, count) in subItem.nodes" :key="count"
                :index="el.menuCode" :route="el.menuCode">
                {{ el.menuName }}
              </el-menu-item>
            </el-submenu>
            <!-- 二级菜单 -->
            <el-menu-item v-else
              :index="subItem.menuCode" :route="subItem.menuCode">
              <i :class="subItem.icon"></i>
              <span slot="title">{{ subItem.menuName }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <!-- 一级菜单 -->
        <el-menu-item v-else
          :index="item.menuCode" :route="item.menuCode">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
	</div>
</template>

<script>
  // 引入转驼峰命名的方法
  import { transferMenuCodeToPath } from '@/common/js/filters.js';
  export default {
    name: "left-sidebar",
    data () {
      return {
        isCollapse: true,
        sidebarList: [],
        isUniqueOpened: true,
      };
    },
    computed: {
    },
    props: {
      value: '',
    },
    created: function () {
      // 测试案列菜单
      let testMenu = {
        menuNameEn: 'demo',
        menuName: '测试案列',
        orderSeq: 0,
        menuUrl: 'demo',
        menuCode: 'demo',
        menuId: '1',
        menuType: '1',
        remark: null,
        parentId: 0,
        icon: 'el-icon-caret-right',
        nodes: [
          {
            menuNameEn: 'test-1',
            menuName: 'test-1-1-1',
            orderSeq: 0,
            menuUrl: 'test-1',
            menuCode: 'demo.test-1',
            menuId: '1',
            menuType: '1',
            remark: null,
            parentId: 0,
            nodes: []
          },
          {
            menuNameEn: 'test-2',
            menuName: 'test-1-1-2',
            orderSeq: 0,
            menuUrl: 'test-2',
            menuCode: 'demo.test-2',
            menuId: '1',
            menuType: '1',
            remark: null,
            parentId: 0,
            nodes: []
          },
          {
            menuNameEn: 'test-2-purity',
            menuName: 'test-1-1-2-purity',
            orderSeq: 0,
            menuUrl: 'test-2-purity',
            menuCode: 'demo.test-2-purity',
            menuId: '1',
            menuType: '1',
            remark: null,
            parentId: 0,
            nodes: []
          }
        ]
      }
      // 获取查询到的菜单栏
      let sessionMenulist = sessionStorage.getItem('loadMenuList'), menuList = [];
      if (sessionMenulist) {
        menuList = JSON.parse(sessionMenulist);
        menuList.forEach(el => {
          el.icon = 'el-icon-caret-right';
        });
      }
      menuList.push(testMenu);
      this.sidebarList = menuList;
    },
    methods: {
      handleOpen (key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose (key, keyPath) {
        // console.log(key, keyPath);
      },
      /*
        该处较麻烦, 如顶级menuCode是 system, 二级是system.menu, 三级是system.menu.auto
        那么将会把每个的menuCode的最后一个层次组装起来, 即对应取system menu auto 组成路径 system/menu/auto
        路由匹配只关心最后一层的路径匹配到的模板, 至于在哪个父级下面则不关心
       */
      handleSelect (index, indexPath) {
        let arr = [];
        if (indexPath instanceof Array) {
          indexPath.forEach((item, index) => {
            arr.push(transferMenuCodeToPath(item));
          });
        }
        this.toLink(`/${arr.join('/')}`);
      },
    },
  };
</script>

<style scoped lang="less">
  .template-left-sidebar {
    background-color: rgb(50, 65, 87);
    position: absolute;
    left: 0;
    top: 46px;
    bottom: 0px;
    color: rgb(191, 203, 217);
    box-sizing: border-box;
    overflow-y: auto;
    .el-menu-sidebar:not(.el-menu--collapse) {
      width: 200px;
    }
    ul {
      height: 100%;
    }
  }
</style>
