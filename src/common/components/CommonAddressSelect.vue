<template>
  <div class="common-address-select-tmpl">
    <!-- 省 -->
    <span class="label-title" v-if="!hideLabel">省份：</span>
    <el-select class="address-select-item"
      :disabled="disabled"
      @change="handleProvinceChange"
      v-model="provinceName"
      filterable
      clearable
      ref="addressProvinceElSelect"
      placeholder="请选择省"
      :class="{
        'is-error': validateState[0] === 'error',
        'is-validating': validateState[0] === 'validating',
        'is-success': validateState[0] === 'success',
      }"
    >
      <el-option v-for="(item, index) in provinceList" :key="item.categoryId"
        :label="item.categoryName"
        :value="item.categoryId">
      </el-option>
    </el-select>
    <!-- 市 -->
    <span class="label-title" v-if="!hideLabel">城市：</span>
    <el-select class="address-select-item"
      :disabled="disabled"
      @change="handleCityChange"
      v-model="cityName"
      filterable
      clearable
      ref="addressCityElSelect"
      placeholder="请选择市"
      :class="{
        'is-error': validateState[1] === 'error',
        'is-validating': validateState[1] === 'validating',
        'is-success': validateState[1] === 'success',
      }"
    >
      <el-option v-for="(item, index) in cityList" :key="item.categoryId"
        :label="item.categoryName"
        :value="item.categoryId">
      </el-option>
    </el-select>
    <!-- 区 -->
    <span class="label-title" v-if="!hideLabel">区县：</span>
    <el-select class="address-select-item"
      :disabled="disabled"
      @change="handleDistrictChange"
      v-model="districtName"
      filterable
      clearable
      ref="addressDistrictElSelect"
      placeholder="请选择区"
      :class="{
        'is-error': validateState[2] === 'error',
        'is-validating': validateState[2] === 'validating',
        'is-success': validateState[2] === 'success',
      }"
    >
      <el-option v-for="(item, index) in districtList" :key="item.categoryId"
        :label="item.categoryName"
        :value="item.categoryId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  // 引入本地地址数据
  import resAddress from '@/common/data/address.json';
  let addressData = resAddress.datastr;
  export default {
    name: "common-address-select",
    data () {
      return {
        // 地址组件传出去的参数,省市区id和中文名称
        emitParams: {
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: '',
        },
        // 展示项
        provinceName: '',
        cityName: '',
        districtName: '',
        // 选择项列表
        provinceList: [],
        cityList: [],
        districtList: [],
      };
    },
    components: {
    },
    computed: {
    },
    props: {
      disabled: { // 是否禁用，true的情况下会禁用所有
        type: Boolean,
        default: false
      },
      validateState: { //省市区校验，validating：默认情况、success：成功，绿色框、error：失败，红色框
        tyep: Array,
        default: () => {return ['validating', 'validating', 'validating']}
      },
      hideLabel: { // 隐藏label
        type: Boolean,
        default: false
      },
      // 默认地址
      defaultAddress: {
        type: Object,
        default: function () {
          return {
            provinceId: '',
            cityId: '',
            districtId: '',
          };
        },
      },
    },
    created: function () {
      // 获取省数据
      this.provinceList = this.getAddress('0', true);
    },
    mounted () {
      // 取默认值
      this.initDefault();
    },
    methods: {
      // 需要强制隐藏下拉框时调用, 封装成跟element-ui调用类似
      blur () {
        this.$refs.addressCityElSelect.blur()
        this.$refs.addressProvinceElSelect.blur()
        this.$refs.addressDistrictElSelect.blur()
      },
      // 初始化默认值
      initDefault () {
        this.emitParams = this.getChineseName(this.defaultAddress);
        this.provinceName = this.emitParams.provinceName;
        this.cityName = this.emitParams.cityName;
        this.districtName = this.emitParams.districtName;
        // this.$emit('getAddress', this.emitParams);
      },
      // 获取地区数据, 一开始就来判断flag, 为true时获取省数据, 需排除国外数据
      getAddress (id, flag = false) {
        let addressList = [];
        if (flag === true) {
          addressData.forEach(item => {
            if (item.upCategoryId == id && item.level != '3') {
              addressList.push(item);
            }
          });
        } else {
          addressData.forEach(item => {
            if (item.upCategoryId == id) {
              addressList.push(item);
            }
          });
        }
        return addressList;
      },
      // 选中省, 清空数据并将选择结果发送出去
      handleProvinceChange (id) {
        this.emitParams.cityName = '';
        this.emitParams.cityId = '';
        this.emitParams.districtName = '';
        this.emitParams.districtId = '';
        this.emitParams.provinceName = '';
        this.provinceName = '';
        this.cityName = '';
        this.districtName = '';
        this.emitParams.provinceId = id;
        this.districtList = [];
        this.emitParamsFn(this.provinceList, 'provinceName', id);
        this.cityList = this.getAddress(id);
      },
      // 选中市, 清空数据并将选择结果发送出去
      handleCityChange (id) {
        this.emitParams.districtName = '';
        this.emitParams.districtId = '';
        this.emitParams.cityName = '';
        this.cityName = '';
        this.districtName = '';
        this.emitParams.cityId = id;
        this.emitParamsFn(this.cityList, 'cityName', id);
        this.districtList = this.getAddress(id);
      },
      // 选中区, 清空数据并将选择结果发送出去
      handleDistrictChange (id) {
        this.emitParams.districtName = '';
        this.districtName = '';
        this.emitParams.districtId = id;
        this.emitParamsFn(this.districtList, 'districtName', id);
      },
      // 将数据传送出去
      emitParamsFn (list, name, id) {
        list.forEach(item => {
          if (item.categoryId == id) {
            this[name] = item.categoryName;
            this.emitParams[name] = item.categoryName;
          }
        });
        this.$emit('getAddress', this.emitParams);
      },
      // 查询默认值的中文名称和下拉项
      getChineseName (addressObj) {
        let obj = {
          provinceId: addressObj.provinceId,
          provinceName: '',
          cityId: addressObj.cityId,
          cityName: '',
          districtId: addressObj.districtId,
          districtName: '',
        };
        this.cityList = this.getAddress(addressObj.provinceId);
        this.districtList = this.getAddress(addressObj.cityId);
        addressData.forEach(item => {
          if (item.categoryId == addressObj.provinceId) obj.provinceName = item.categoryName;
          if (item.categoryId == addressObj.cityId) obj.cityName = item.categoryName;
          if (item.categoryId == addressObj.districtId) obj.districtName = item.categoryName;
        });
        return obj;
      },
      // 外部需要一键清空时, 清除选择数据, 内部清除数据逻辑在别的地方以单独处理
      clear () {
        for (var key in this.emitParams) {
          this.emitParams[key] = '';
        }
        this.$emit('getAddress', this.emitParams);
      },
    },
    watch: {
      defaultAddress: {
        handler: function (val, oldVal) {
          if (val.provinceId != oldVal.provinceId) this.initDefault();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="less">
  .common-address-select-tmpl {
    display: inline-block;
    .label-title {
      font-size: 12px;
      color: #AAAAAA;
    }
    .address-select-item {
      height: 26px!important;
      line-height: 26px!important;
      &.is-error{
        .el-input__inner{
          border-color: #f56c6c;
        }
      }
      &.is-success{
        .el-input__inner{
          border-color: #c0c4cc;
        }
      }
      .el-input {
        input {
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          padding-right: 20px;
          padding-left: 0px;
          text-indent: 10px;
          vertical-align: top;
        }
      }
    }
  }
</style>
