/*
* @Author: FANWEILIN
* @Date:   2018-04-20 09:54:42
* @Last Modified by:   fanweilin
* @Last Modified time: 2018-05-03 15:49:52
*/
// 权限字段
const userRights = 'op.app.merchant.count, op.app.terminal.manager, op.app.merchant.purchase, op.app.merchant.recharge, op.app.terminal.addchsub.manager, op.app.order.refund, op.app.merchant.withdraw, op.app.my.terminal.manager, op.app.merchant.wallet, op.app.count, op.app.merchant.income, op.app.merchant.distribute.prizes, op.app.purchase, op.app.reward.record, op.app.merchant.purchasein, op.app.terminal.query, op.app.custom.callback, op.app.order.data'.split(',');

import _forEach from "lodash/forEach";

// 菜单权限设置
import sidebarList from "@/common/data/permission/LeftSideBar.json";

let getSidebarRights = function getSidebarRights (sidebarList) {
  _forEach(sidebarList, (item, index) => {
    // 匹配权限设置
    // console.log(item.index, item.permission, item.title);
    if (item.hasSubs) {
      getSidebarRights(item.subs);
    }
  });
}

getSidebarRights(sidebarList);

export {
  sidebarList,
};
