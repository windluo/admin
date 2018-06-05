// 常量数据

// 请求状态码判断
let loadStatus = {
  code_init: 99, // 初始值
  code_err: 80, // 80 报错时
  code_noData: 40, // 40 没有数据
  code_hasData: 20, // 20 请求成功有数据时
  code_request: 10, // 10 发起请求时
};

// 后台返参状态码, 根据后台的返参统一写在这里
let resStatus = {
  successCode: 0, // 返回成功时
  successString: 'OK', // 返回成功时
};

export {
  loadStatus,
  resStatus,
};
