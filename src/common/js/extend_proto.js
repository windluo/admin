/* 原型对象扩展 */

/* 时间原型对象扩展 */
// 增加天数
Date.prototype.addDay = function (day) {
  return new Date(this.getTime() + day * 24 * 60 * 60 * 1000);
}

// 格式化时间,
Date.prototype.formate = function () {
  let month = (this.getMonth() + 1) / 10 >= 1 ? this.getMonth() + 1 : `0${this.getMonth() + 1}`;
  let day = this.getDate() / 10 >= 1 ? this.getDate() : `0${this.getDate()}`;
  return `${this.getFullYear()}-${month}-${day}`;
}
