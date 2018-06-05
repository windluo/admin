
export function leftpad  (str, len, ch) {
  // str：要转换的字符串/数字、len：转多长、ch：拼接符
  str = String(str)
  var i = -1
  if (!ch && ch !== 0) ch = ' '
  len = len - str.length
  while (++i < len) {
    str = ch + str
  }
  return str
}

export function convertDate (val) {
  if (!val) return ''
  // new Date有个坑
  // new Date('YYYY-MM-DD') or new Date('YYYY/MM/DD') 在IE/safari下返回null
  // 毕竟官方压根没提供过这种实例的例子
  // 目前后台返回的是这种格式：YYYY-MM-DD HH:MM:SS
  return val.substr(0, 11)
}

// 初始化时间, 获取对应年月日的时间对象
// new Date有个坑
// new Date('YYYY-MM-DD') or new Date('YYYY/MM/DD') 在IE/safari下返回null
// 针对类似这种格式：YYYY-MM-DD HH:MM:SS 或者 YYYY-MM-DD 处理
// 返回一个六位数的数组, 时间的6个参数
export function initDateForm (val) {
  if (!val || val == 'undefined' || val == 'null') return [];
  let arr = val.split(' ');
  let arr1 = arr[0].split('-');
  arr1[1] = arr1[1] - 1;
  let arr2 = [];
  if (arr[1] && arr[1].length > 2) {
    arr2 = arr[1].split(':');
  } else {
    arr2 = [0, 0, 0];
  }
  return arr1.concat(arr2);
}

// 把source对象的值赋给target对象
// 仅赋值source对象中有值的属性
export function assignObjectRight (target, source) {
  // 暂未考虑多层
  if (source) {
    for (let i in source) {
      if (source[i]) {
        target[i] = source[i]
      }
    }
  }
}

// 把source对象的值赋给target对象
// 仅赋值target中有的属性
export function assignObject (target, source) {
  // 暂未考虑多层
  for (let i in target) {
    target[i] = source[i]
  }
}

// 清空目标对象属性的值
export function emptyObject (target) {
  // 暂未考虑多层
  for (let i in target) {
    target[i] = ''
  }
}

export function resetTitle (pageTitle, title) {
  // 重设弹框标题
  return pageTitle + '—' + title
}

// 转化后台配置的菜单编码 取出最后一层级的路径 如system.menu 第一层取出system, 第二层取出menu
export function transferMenuCodeToPath (menuCode) {
  if ([undefined, null, '', 'undefined', 'null'].some(el => el == menuCode)) return '';
  let arr = menuCode.split('.');
  return arr[arr.length - 1];
}
