<template>
  <div class="common-merchant-select-tmpl">
    <span class="lable-title">{{ label }}</span>
    <el-select class="single-select-item" popper-class="select-list-style"
      @change="handleOptionChange" v-model="modelValueName" filterable clearable placeholder="请选择"
      @visible-change="visibleChange">
      <el-option v-for="(item, index) in filteredMerchantList" :key="item.merchantId"
        :label="item.merchantName"
        :value="item.merchantId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  // 运营商下拉框选择组件, 如果显示的valueName就是valueId,则将id值赋给valueName
  export default {
    name: "common-merchant-select",
    data () {
      return {
        // 传递出去的参数
        emitParams: {
          merchantId: '',
          merchantName: '',
        },
        modelValueName: '',
        merchantList: [],
        filteredMerchantList: [],
      };
    },
    props: {
      // 过滤配置, 根据入参的省市区代码过滤可以选择的运营商列表
      filterConfig: {
        type: Object,
        default: function () {
          return {
            provinceId: '',
            cityId: '',
            districtId: '',
          };
        },
      },
      // 自定义名称
      label: {
        type: String,
        default: '运营商：',
      },
      // 默认项, 如果有给定默认值就去默认值
      defaultParams: {
        type: Object,
        default: function () {
          return {
            merchantId: '',
            merchantName: '',
          };
        },
      },
    },
    created () {
      this.queryMerchant();
    },
    methods: {
      // 打开或隐藏选择项时
      visibleChange (val) {
        if (val === false) return;
        // 过滤选择列表逻辑开始
        if (this.filterConfig.provinceId && this.filterConfig.cityId && this.filterConfig.districtId) {
          let tempArr = [];
          this.merchantList.forEach(item => {
            if (item.provinceId == this.filterConfig.provinceId && item.cityId == this.filterConfig.cityId && item.districtId == this.filterConfig.districtId) {
              tempArr.push(item);
            }
          });
          this.modelValueName = '';
          this.filteredMerchantList = tempArr;
        } else {
          this.filteredMerchantList = this.merchantList;
        }
      },
      // 选择项变化时
      handleOptionChange (id) {
        this.emitParams.merchantId = id;
        this.merchantList.forEach(item => {
          if (item.merchantId == id) {
            this.emitParams.merchantName = item.merchantName;
          }
        });
        this.$emit('getMerchantSelect', this.emitParams);
      },
      // 查询后台运营商数据列表, 接口请求逻辑写在下面
      queryMerchant () {
      },
    },
    watch: {
      defaultParams: {
        handler: function (val, oldVal) {
          if (val.merchantId != oldVal.merchantId) {
            this.emitParams.merchantId = val.merchantId;
            this.emitParams.merchantName = val.merchantName;
            this.modelValueName = val.merchantName; // 默认展示该项
            this.$emit('getMerchantSelect', this.emitParams);
          }
        },
        deep: true,
      },
      'filterConfig.provinceId': function (val) {
        this.modelValueName = '';
      },
      'filterConfig.cityId': function (val) {
        this.modelValueName = '';
      },
      'filterConfig.districtId': function (val) {
        this.modelValueName = '';
      },
    },
  };
</script>

<style lang="less">
  .common-merchant-select-tmpl {
    display: inline-block;
    .lable-title {
      font-size: 12px;
      color: #AAAAAA;
    }
    .single-select-item {
      height: 26px!important;
      line-height: 26px!important;
      box-sizing: border-box;
      .el-input {
        input {
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          padding-right: 30px;
          padding-left: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
