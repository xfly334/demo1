/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import base from './base'
// import router from '../router'
import Qs from 'qs'
import store from '../store/index'
import { Toast } from 'vant'

// 创建 axios 实例
let service = axios.create({
  baseURL: base.url,
  timeout: 10000
})
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    case 500:
      tip('服务器繁忙')
      break
    default:
      console.log(other)
  }
}

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
service.interceptors.request.use(
  config => {
    // 在发送请求之前做处理...
    config.headers = Object.assign(config.method === 'get' ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    } : {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }, config.headers)
    if (config.method === 'post') {
      const contentType = config.headers['Content-Type']
      // 根据Content-Type转换data格式
      if (contentType) {
        if (contentType.includes('multipart')) { // 类型 'multipart/form-data;'
          // config.data = data;
        } else if (contentType.includes('json')) { // 类型 'application/json;'
          // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
          config.data = JSON.stringify(config.data)
        } else { // 类型 'application/x-www-form-urlencoded;'
          // 服务器收到的raw body(原始数据) name=nowThen&age=18
          config.data = Qs.stringify(config.data)
        }
      }
    }
    const token = store.state.token
    // token && (config.headers.Authorization = token)
    token && (config.headers.token = token)
    return Promise.resolve(config)
  },
  error => Promise.error(error))

// 响应拦截器
service.interceptors.response.use(
  // 请求成功
  res => {
    // Toast.clear()
    return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)
  },
  // 请求失败
  error => {
    // 断网 或者 请求超时 状态
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        console.log('超时了')
        Toast.fail('请求超时，请检查网络是否连接正常')
      } else {
        // 可以展示断网组件
        console.log('断网了')
        Toast.fail('请求失败，请检查网络是否已连接')
      }
      return
    }
    const { response } = error
    errorHandle(response.status, response.data.message)
  })

export default service
