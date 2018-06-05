import _axios from './_axios'
import _upperFirst from 'lodash/upperFirst'
import actionUrlConfig from './actionUrlConfig'

/********************** 正式用 **********************/

var ActionCreator = function () {
  this.targetUrl = []
  this.action = []

  this.getFnName =  (target) => {
    // 转换名字，生成action方法名
    // target是url
    // url：baseinfo/grid/list, 转换后的格式：actionBaseinfoGridList
    let res = 'action'
    target = target.split('/')
    target.forEach(item => {
      res += _upperFirst(item)
    })
    return res
  }

  this.createAction = () => {
    // 拿到名字，生成ajax请求函数
    this.action = []
    this.targetUrl.forEach(item => {
      let fnName = this.getFnName(item.url)
      /*
        参数说明
          params 请求入参
          cancelToken 请求ajax请求的标记, 详细用法参考文档或者登陆模块, test_1模块
          flag 是否使用默认的错误提示, true 使用默认的, false使用自定义的提示, 例如返回没有数据或者网络错误时的提示
          type 请求方式, 默认发送 post 请求, 更改传入的type值可以更改请求方式
       */
      let actionFn = function (params, cancelToken, flag = true, type = 'post') {
        let url = item.domain + item.url;
        if (type.toLocaleLowerCase() === 'post') return _axios.post(url, params, cancelToken, flag);
        if (type.toLocaleLowerCase() === 'get') return _axios.get(url, params, cancelToken, flag);
      }
      // 给个名字标识当前是哪个请求
      actionFn.prototype.name = fnName
      this.action.push(actionFn)
    })
  }

  this.init = (arr) => {
    this.targetUrl = []
    arr.forEach(item => {
      this.targetUrl.push(actionUrlConfig[item])
    })
    this.createAction()

    // 返回生成的ajax请求函数
    return this.action
  }
}

let action = new ActionCreator()
export default action
