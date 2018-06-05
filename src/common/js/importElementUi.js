/*
* @Author: fanweilin
* @Date:   2018-04-25 17:19:21
* @Last Modified by:   fanweilin
* @Last Modified time: 2018-05-11 16:40:16
*/
import Vue from 'vue';

import {
  form,
  formItem,
  button,
  input,
  Row,
  Col,
  pagination,
  datePicker,
  Pagination,
  MessageBox,
  Message,
  Checkbox,
  CheckboxGroup,
  Tooltip,
  Tree,
  dropdown,
  dropdownMenu,
  dropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Radio,
  RadioGroup,
  select,
  option,
  Loading,
  Notification
} from 'element-ui';

Vue.use(Loading.directive);

Vue.component('el-form', form);
Vue.component('el-form-item', formItem);
Vue.component('el-button', button);
Vue.component('el-input', input);
Vue.component('el-row', Row);
Vue.component('el-col', Col);
Vue.component('el-pagination', pagination);
Vue.component('el-date-picker', datePicker);
Vue.component('el-pagination', Pagination);
Vue.component('el-checkbox', Checkbox);
Vue.component('el-checkbox-group', CheckboxGroup);
Vue.component('el-tooltip', Tooltip);
Vue.component('el-dropdown', dropdown);
Vue.component('el-dropdown-menu', dropdownMenu);
Vue.component('el-dropdown-item', dropdownItem);
Vue.component('el-menu', Menu);
Vue.component('el-submenu', Submenu);
Vue.component('el-menu-item', MenuItem);
Vue.component('el-radio', Radio);
Vue.component('el-radio-group', RadioGroup);
Vue.component('el-select', select);
Vue.component('el-option', option);
Vue.component('el-tree', Tree);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;