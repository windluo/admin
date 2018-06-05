<template>
  <div>
    <el-tree
      class="filter-tree"
      :data="dataList"
      empty-text=""
      node-key="configObj.id"
      :props="configObj"
      :expand-on-click-node="false"
      ref="commonTreeSelect">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <label class="modify-checkBox" v-if="data.isCheck !== false"
          :class="{lowerLevelVisible: data[configObj.status] == 1, justSelfVisible: data[configObj.status] == 0, noSelect: data[configObj.status] != 0 && data[configObj.status] != 1}"
          :for="data[configObj.id]">
          <input @click.stop.pre="selectNode(node, data)" :id="data[configObj.id]" type="checkbox">
        </label>
        <span class="display-content">{{ data[configObj.label] }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  export default {
    name: "common-three-status-tree-select",
    data () {
      return {
        // 数据源, 数据样式如下
        testList: [
          {
            menuCode: 1,
            label: '一级 1',
            status: 1,
            nodes: [
              {
                menuCode: 2,
                label: '二级 1-1',
                status: 3,
                nodes: [{
                  menuCode: 3,
                  label: '三级 1-1-1',
                  status: 2,
                }, {
                  menuCode: 4,
                  label: '三级 1-1-2',
                  status: 1,
                }]
              },
              {
                menuCode: 5,
                label: '二级 1-2',
                status: 3,
                nodes: [{
                  menuCode: 6,
                  label: '三级 1-2-1',
                  status: 2,
                }, {
                  menuCode: 7,
                  label: '三级 1-2-2',
                  status: 3,
                }]
              }
            ]
          }
        ],
      }
    },
    components: {
    },
    computed: {
    },
    props: {
      // 展示子项字段配置以及展示相关属性配置
      configObj: {
        type: Object,
        default () {
          return {
            children: 'nodes',
            label: 'label',
            id: 'id',
            status: 'status',
          }
        },
      },
      // 树形数据, 默认如testList结构的数据
      dataList: {
        type: Array,
        default () {
          return [];
        },
      },
    },
    created: function () {
    },
    mounted () {
    },
    methods: {
      selectNode (node, data) {
        // console.log(node)
        // 循环展示三种状态
        let status = data[this.configObj.status] == 0 ? 1 : (data[this.configObj.status] == 1 ? 2 : 0);
        this.$set(data, this.configObj.status, status);

        let id = data[this.configObj.id];

        this.dataList.forEach(item => {
          // 如果有子项并且父项选择的是下级可见, 则下级全部要置为下级可见
          if (id == item[this.configObj.id] && item.nodes.length > 0 && status == 1) {
            console.log(item)
          } else if (item.nodes.length > 0) {
            // 遍历第二级
            item.nodes.forEach(second => {
              if (id == second[this.configObj.id] && second.nodes.length > 0 && status == 1) {
                second.nodes.forEach(node => {
                  this.$set(node, this.configObj.status, status);
                })
              } else if (second.nodes.length > 0) {
                // 遍历第三级
                second.nodes.forEach(third => {
                  if (id == third[this.configObj.id] && third.nodes.length > 0 && status == 1) {
                    console.log(third)
                    third.nodes.forEach(node => {
                      this.$set(node, this.configObj.status, status);
                    })
                  } else if (third.nodes.length > 0) {
                    console.log(third)
                  }
                })
              }
            })
          }
        })
      },
    },
  };
</script>

<style scoped lang="less">
  // 自定义树选择内容
  .custom-tree-node {
    // 模拟选择框效果
    .modify-checkBox {
      display: inline-block;
      margin-right: 5px;
      width: 12px;
      height: 12px;
      line-height: 1;
      cursor: pointer;
      position: relative;
      user-select: none;
      input[type="checkbox"] {
        height: 0px;
        width: 0px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }
    // 展示内容设置
    .display-content {
      cursor: default;
      -webkit-font-smoothing: antialiased;
    }
  }
  // 下级可见的样式 对应 1
  .lowerLevelVisible {
    background: url('../images/lower-level-visible.png') no-repeat;
    background-size: 100% 100%;
  }
  // 仅看自己的样式 对应 2
  .justSelfVisible {
    background: url('../images/just-self-visible.png') no-repeat;
    background-size: 100% 100%;
  }
  // 不选中的样式 对应 除了 0 和 1 之外的值
  .noSelect {
    background: url('../images/no-select.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
