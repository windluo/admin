
/*****************************引入菜单组件*****************************/

/*****************************基础信息下面的模块*****************************/
// 自增ID管理
const autoIncreaseId = resolve => require.ensure([], () => {resolve(require('@/views/container/AutoIncreaseIdManage'))}, 'autoIncreaseIdManage');

// 系统参数配置
const params = resolve => require.ensure([], () => {resolve(require('@/views/container/ParamsManage/index'))}, 'paramsManage');

// 地区信息维护
const district = resolve => require.ensure([], () => {resolve(require('@/views/container/DistrictManage'))}, 'districtManage');

/*****************************系统管理下面的模块*****************************/
// 系统账号维护
const account = resolve => require.ensure([], () => {resolve(require('@/views/container/AccountManage'))}, 'accountManage');

// 账户角色关联
const accountRole = resolve => require.ensure([], () => {resolve(require('@/views/container/accountRoleManage'))}, 'accountRoleManage');

// 系统菜单维护
const menu = resolve => require.ensure([], () => {resolve(require('@/views/container/MenuManage'))}, 'menuManage');

// 系统角色维护
const role = resolve => require.ensure([], () => {resolve(require('@/views/container/RoleManage'))}, 'roleManage');

// 数据权限配置
const data = resolve => require.ensure([], () => {resolve(require('@/views/container/DataManage'))}, 'dataManage');

// 角色菜单分配
const roleMenu = resolve => require.ensure([], () => {resolve(require('@/views/container/RoleMenuManage'))}, 'roleMenuManage');

// 数据权限分配
const roleData = resolve => require.ensure([], () => {resolve(require('@/views/container/RoleDataManage'))}, 'roleDataManage');

// 操作日志查询
const log = resolve => require.ensure([], () => {resolve(require('@/views/container/OperationLog'))}, 'operationLog');

export default {
  autoIncreaseId,
  district,
  params,
  account,
  accountRole,
  menu,
  role,
  roleMenu,
  log,
  data,
  roleData,
};
