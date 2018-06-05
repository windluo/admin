
import domain from './domain'
let domain_system = domain.domain_system

let urlList = {
  // gridList: 键， url: 链接，domain：接口域名，导出的接口在导出组件内
  /************************************* test_1案列接口 *******************************************************/
  'reportOrderinfomationList': {url: '/report/orderinfomation/list', domain: domain_system},
  'reportOrderinfomationAddRemark': {url: '/report/orderinfomation/addRemark', domain: domain_system},
  /************************************* 登录相关接口 *******************************************************/
  'accountKey': { url: '/system/account/key', domain: domain_system}, // 获取秘钥
  'accountLogin': { url: '/system/account/login', domain: domain_system}, // 登录接口
  /************************************* 网点 *******************************************************/
  'gridList': { url: '/baseinfo/grid/list', domain: domain_system},
  'gridGet': { url: '/baseinfo/grid/get', domain: domain_system},
  'gridAdd': { url: '/baseinfo/grid/add', domain: domain_system},
  'gridUpdate': { url: '/baseinfo/grid/update', domain: domain_system},
  'gridDelete': { url: '/baseinfo/grid/delete', domain: domain_system}, // 单个删除
  'gridBdelete': { url: '/baseinfo/grid/bdelete', domain: domain_system}, // 批量删除
  /************************************* 运营商 *******************************************************/
  'merchantList': { url: '/baseinfo/merchant/merchantList', domain: domain_system},
  /************************************* 自增ID *******************************************************/
  'autoIdList': { url: '/system/autoId/list', domain: domain_system},
  'autoIdAdd': { url: '/system/autoId/add', domain: domain_system},
  'autoIdGet': { url: '/system/autoId/get', domain: domain_system},
  'autoIdDeleteMany': { url: '/system/autoId/deleteMany', domain: domain_system},
  'autoIdUpdate': { url: '/system/autoId/update', domain: domain_system},
  /************************************* 参数配置 *******************************************************/
  'paramList': { url: '/system/param/list', domain: domain_system},
  'paramAdd': { url: '/system/param/add', domain: domain_system},
  'paramGet': { url: '/system/param/get', domain: domain_system},
  'paramDeleteMany': { url: '/system/param/deleteMany', domain: domain_system},
  'paramUpdate': { url: '/system/param/update', domain: domain_system},
  'paramListDetail': { url: '/system/param/listDetail', domain: domain_system},
  'paramAddDetail': { url: '/system/param/addDetail', domain: domain_system},
  'paramGetDetail': { url: '/system/param/getDetail', domain: domain_system},
  'paramDeleteDetailMany': { url: '/system/param/deleteDetailMany', domain: domain_system},
  'paramUpdateDetail': { url: '/system/param/updateDetail', domain: domain_system},
  'paramListSystemParam': { url: '/system/param/listSystemParam', domain: domain_system},
  /************************************* 数据权限 *******************************************************/
  'dataOpList': { url: '/system/dataOp/list', domain: domain_system},
  'dataOpDeleteMany': { url: '/system/dataOp/deleteMany', domain: domain_system},
  'dataOpAdd': { url: '/system/dataOp/add', domain: domain_system},
  /************************************* 角色管理（系统角色） *******************************************************/
  'roleList': { url: '/system/role/list', domain: domain_system},
  'roleAdd': { url: '/system/role/add', domain: domain_system},
  'roleGet': { url: '/system/role/get', domain: domain_system},
  // 'roleDelete': { url: '/system/role/delete', domain: domain_system},
  'roleDeleteMany': { url: '/system/role/deleteMany', domain: domain_system}, // 批量删除这个接口有问题，跟单删一样，就是参数不一样
  'roleUpdate': { url: '/system/role/update', domain: domain_system},
  /************************************* 数据权限分配 *******************************************************/
  'dataAllotGet': { url: '/system/dataAllot/get', domain: domain_system}, // 查询数据权限信息
  /************************************* 系统账号维护 *******************************************************/
  'accountList': { url: '/system/account/list', domain: domain_system},
  'accountAdd': { url: '/system/account/add', domain: domain_system},
  'accountGet': { url: '/system/account/get', domain: domain_system},
  'accountUpdate': { url: '/system/account/update', domain: domain_system},
  'accountDeleteMany': { url: '/system/account/deleteMany', domain: domain_system},
  /************************************* 地区信息维护 *******************************************************/
  'regionList': {url: '/system/region/list', domain: domain_system},
  'regionGet': {url: '/system/region/get', domain: domain_system},
  'regionUpdate': {url: '/system/region/update', domain: domain_system},
  'regionDeleteMany': {url: '/system/region/deleteMany', domain: domain_system},
  'regionAdd': {url: '/system/region/add', domain: domain_system},
  /************************************* 系统菜单维护模块 接口 *******************************************************/
  'menuTreeList': {url: '/system/menu/treelist', domain: domain_system}, // 查询菜单树形结构
  'menuTreeDelete': {url: '/system/menu/delete', domain: domain_system}, // 删除选中的菜单
  'menuAdd': {url: '/system/menu/add', domain: domain_system}, // 新增菜单
  'menuGet': {url: '/system/menu/get', domain: domain_system}, // 查询菜单某项信息
  'menuUpdate': {url: '/system/menu/update', domain: domain_system}, // 修改菜单某项信息
}

export default urlList
