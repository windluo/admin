
import _axios from './_axios'
import domain from './domain'
import Qs from 'qs'

/**********************demo用**********************/

// 首页信息查询测试案例版
export function apiOrderInformation (data, cancelToken, flag = true) {
  // let url = 'http://192.168.1.145:9001/report/orderinfomation/list';
  let url = domain.domain_system + '/report/orderinfomation/list';
  return _axios.post(url, data, cancelToken, flag)
}

// 导出数据-测试案例版
export function exportOrderExcelData (instance, data, cancelToken) {
  // let url = 'http://192.168.1.145:9001/getData';
  let url = domain.domain_system + '/report/orderinfomation/export';
  return instance.$axios.get(url, {params: data, responseType: 'blob'});
}

// 导出数据-测试案例版
// export function exportOrderExcelData (instance, data) {
//   // let url = 'http://192.168.1.145:9001/getData';
//   let url = domain.domain_system + '/report/export';
//   return instance.$axios.post(url, {params: data, responseType: 'blob'});
// }

// 图表添加备注信息-测试案例版
export function addEchartsRemarkInfo (params = {}, cancelToken, flag) {
  let url = domain.domain_system + '/report/orderinfomation/addRemark';
  return _axios.get(url, params, cancelToken, flag);
}

// 登录前获取秘钥的接口
export function geyAccountKey (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/account/key';
  // let url = 'http://192.168.1.145:9001/system/account/key';
  return _axios.post(url, data, cancelToken, flag);
}

// 登录验证接口
export function accountLogin (data) {
  let url = domain.domain_system + '/system/account/login';
  // let url = 'http://192.168.1.145:9001/system/account/login';
  return _axios.post(url, data);
}

// 获取账号列表
export function accountList (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/account/list';
  // let url = 'http://192.168.1.145:9001/system/account/list';
  return _axios.post(url, data, cancelToken, flag);
}

// 查询运营商列表数据
export function queryMerchantList (params, cancelToken, flag = true) {
  // let url = domain.domain_ticket
  let url = 'http://192.168.1.145:9001/lotteryService'
  params.api = 'tmkj.supply.merchant.query'
  return _axios.get(url, params, cancelToken, flag)
}

// 查询商户列表，需要跟上面的统一
export function queryMerchantList2 (params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/merchant/merchantList'
  return _axios.post(url, params, cancelToken)
}

// 查询网点列表
export function queryOutletsList (params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/grid/list'
  return _axios.post(url, params, cancelToken)
}

// 查询网点详情
export function queryOutletsDetail (params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/grid/get'
  return _axios.post(url, params, cancelToken)
}

// 新增网点
export function addOutlets (params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/grid/add'
  return _axios.post(url, params, cancelToken)
}

// 编辑网点
export function updateOutlets (params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/grid/update'
  return _axios.post(url, params, cancelToken)
}

// 删除网点
export function deleteOutlets (params, cancelToken) {
  let url = ''
  if (params.gridId.length <= 1) {
    params.gridId = params.gridId.join('')
    url = domain.domain_system + '/baseinfo/grid/delete'
  } else {
    // 批量删除，后续要做权限控制
    params.gridIds = params.gridId.join(',')
    delete params.gridId
    url = domain.domain_system + '/baseinfo/grid/bdelete'
  }
  return _axios.post(url, params, cancelToken)
}

// 导出网点数据
export function exportOutlets (instance, params, cancelToken) {
  let url = domain.domain_system + '/baseinfo/grid/export'
  // return _axios.post(url, params, cancelToken)
  return instance.$axios.get(url, {params: params, responseType: 'blob'})
}

/***************************** 菜单管理 *************************************/
// 查询菜单树形结构
export function queryMenuTreelist (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/treelist';
  return _axios.post(url, data, cancelToken);
}

// 删除选中单个菜单
export function actionSysMenuDelete (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/delete';
  return _axios.post(url, data, cancelToken, flag);
}

// 删除选中多个菜单
export function actionSysMenuDeleteMany (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/deleteMany';
  return _axios.post(url, data, cancelToken, flag);
}

// 新增菜单
export function actionSysMenuAdd (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/add';
  return _axios.post(url, data, cancelToken, flag);
}

// 查询菜单某项信息
export function actionSysMenuGet (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/get';
  return _axios.post(url, data, cancelToken, flag);
}

// 修改某项菜单提交信息
export function actionSysMenuUpdate (data, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/menu/update';
  return _axios.post(url, data, cancelToken, flag);
}

/***************************** 自增ID *************************************/
// 获取自增ID列表
export function actionSysAutoIdList (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/autoId/list'
  return _axios.post(url, params, cancelToken)
}
// 新增自增ID
export function actionSysAutoIdAdd (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/autoId/add'
  return _axios.post(url, params, cancelToken)
}
// 编辑自增ID
export function actionSysAutoIdUpdate (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/autoId/update'
  return _axios.post(url, params, cancelToken)
}
// 删除自增ID
export function actionSysAutoIdDelete (params, cancelToken, flag = true) {
  let url = ''
  if (params.autoId.length <= 1) {
    params.autoId = params.autoId.join('')
    url = domain.domain_system + '/system/autoId/delete'
  } else {
    // 批量删除，后续要做权限控制
    params.autoIds = params.autoId.join(',')
    delete params.autoId
    url = domain.domain_system + '/system/autoId/bdelete'
  }
  return _axios.post(url, params, cancelToken)
}

/***************************** 参数配置 *************************************/
// 参数配置列表
export function actionSysParamList (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/list'
  return _axios.post(url, params, cancelToken)
}
// 新增参数
export function actionSysParamAdd (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/add'
  return _axios.post(url, params, cancelToken)
}
// 获取参数
export function actionSysParamGet (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/get'
  return _axios.post(url, params, cancelToken)
}
// 更新参数
export function actionSysParamUpdate (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/update'
  return _axios.post(url, params, cancelToken)
}
// 删除参数
export function actionSysParamDelete (params, cancelToken, flag = true) {
  let url = ''
  if (params.paramId.length <= 1) {
    params.paramId = params.paramId.join('')
    url = domain.domain_system + '/system/param/delete'
  } else {
    // 批量删除，后续要做权限控制
    params.paramIds = params.paramId.join(',')
    delete params.paramId
    url = domain.domain_system + '/system/param/bdelete'
  }
  return _axios.post(url, params, cancelToken)
}
// 数组类型——参数详情列表
export function actionSysParamListDetail (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/listDetail'
  return _axios.post(url, params, cancelToken)
}
// 数组类型——新增参数
export function actionSysParamAddDetail (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/addDetail'
  return _axios.post(url, params, cancelToken)
}
// 数组类型——获取参数
export function actionSysParamGetDetail (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/getDetail'
  return _axios.post(url, params, cancelToken)
}
// 数组类型——更新参数
export function actionSysParamUpdateDetail (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/param/updateDetail'
  return _axios.post(url, params, cancelToken)
}
// 数组类型——删除参数
export function actionSysParamDeleteDetail (params, cancelToken, flag = true) {
  let url = ''
  params.paramId = params.paramId
  if (params.detailKey.length <= 1) {
    params.detailKey = params.detailKey.join('')
    url = domain.domain_system + '/system/param/deleteDetail'
  } else {
    // 批量删除，后续要做权限控制
    params.detailKeys = params.detailKey.join(',')
    delete params.detailKey
    url = domain.domain_system + '/system/param/bdeleteDetail'
  }
  return _axios.post(url, params, cancelToken)
}

/***************************** 数据权限 *************************************/
// 数据权限列表
export function actionSysDataOpList (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/dataOp/list'
  return _axios.post(url, params, cancelToken)
}
// 添加数据权限
export function actionSysDataOpAdd (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/dataOp/add'
  return _axios.post(url, params, cancelToken)
}
// 获取数据权限
export function actionSysDataOpGet (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/dataOp/get'
  return _axios.post(url, params, cancelToken)
}
// 删除数据权限
export function actionSysDataOpDelete (params, cancelToken, flag = true) {
  let url = ''
  if (params.dataOpId.length <= 1) {
    params.dataOpId = params.dataOpId.join('')
    url = domain.domain_system + '/system/dataOp/delete'
  } else {
    // 批量删除，后续要做权限控制
    params.dataOpIds = params.dataOpId.join(',')
    delete params.dataOpId
    url = domain.domain_system + '/system/dataOp/bdelete'
  }
  return _axios.post(url, params, cancelToken)
}
// 获取权限数据，dataTree
export function actionSysDataOpDataTree (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/dataOp/dataTree'
  return _axios.post(url, params, cancelToken)
}

/***************************** 角色管理 *************************************/
// 角色列表
export function actionSysRoleList (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/role/list'
  return _axios.post(url, params, cancelToken)
}
// 新增角色
export function actionSysRoleAdd (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/role/add'
  return _axios.post(url, params, cancelToken)
}
// 获取角色信息
export function actionSysRoleGet (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/role/get'
  return _axios.post(url, params, cancelToken)
}
// 删除角色
export function actionSysRoleDelete (params, cancelToken, flag = true) {
  let url = ''
  if (params.roleId.length <= 1) {
    params.roleId = params.roleId.join('')
    url = domain.domain_system + '/system/role/delete'
  } else {
    // 批量删除，后续要做权限控制
    params.roleIds = params.roleId.join(',')
    delete params.roleId
    url = domain.domain_system + '/system/role/bdelete'
  }
  return _axios.post(url, params, cancelToken)
}
// 修改角色
export function actionSysRoleUpdate (params, cancelToken, flag = true) {
  let url = domain.domain_system + '/system/role/update'
  return _axios.post(url, params, cancelToken)
}