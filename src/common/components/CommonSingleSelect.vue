<template>
  <div class="common-single-select-tmpl">
    <span class="lable-title">{{ label }}</span>
    <el-select class="single-select-item" @change="handleOptionChange" v-model="modelValueName" filterable clearable placeholder="请选择">
      <el-option v-for="(item, index) in selectList" :key="item.valueId"
        :label="item.valueName"
        :value="item.valueId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  // 单列下拉框选择组件, 如果显示的valueName就是valueId,则将id值赋给valueName
  export default {
    name: "common-single-select",
    data () {
      return {
        // 传递出去的参数
        emitParams: {
          valueId: '',
          valueName: '',
        },
        modelValueName: '',
      };
    },
    components: {
    },
    computed: {
    },
    props: {
      // 待选择列表
      selectList: {
        type: Array,
        default: () => [],
      },
      // 过滤配置
      filterConfig: {
        type: Object,
        default: () => {},
      },
      // 自定义名称
      label: {
        type: String,
        default: '',
      },
      // 对应id需要展示的中文名称, 如果有需要就传
      valueName: '',
      // 列表里面需要选择项的id字段, 用来查询中文名称时需要用到
      valueId: '',
      // 默认项, 如果有给定默认值就去默认值
      defaultParams: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      handleOptionChange (id) {
        this.emitParams.valueId = id;
        this.selectList.forEach(item => {
          if (item[this.valueId] == id) {
            this.emitParams.valueName = item[this.valueName];
          }
        });
        this.$emit('getSingleSelect', this.emitParams);
      },
    },
    watch: {
      defaultParams: {
        handler: function (val, oldVal) {
          this.emitParams.valueId = val.valueId;
          this.emitParams.valueName = val.valueName;
          this.modelValueName = val.valueName; // 默认展示该项
          this.$emit('getSingleSelect', this.emitParams);
        },
        deep: true,
      },
    },
  };
</script>

<style lang="less">
  .common-single-select-tmpl {
    display: inline-block;
    .lable-title {
      font-size: 12px;
      color: #AAAAAA;
    }
    .single-select-item {
      height: 30px;
      .el-input {
        input {
          text-align: center;
          height: 30px;
          font-size: 12px;
          padding-right: 20px;
          padding-left: 0px;
        }
      }
    }
  }
</style>
