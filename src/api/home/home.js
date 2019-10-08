/**
 * 模块接口列表
 */
import axios from '../http' // 导入http中创建的axios实例
const home = {
  // 首页列表
  indexList (params) {
    return axios.post(`/index/shop/index`, params)
  },
  // 发送验证码
  send (params) {
    return axios.post(`/index/index/send`, params)
  },
  // 登录
  login (params) {
    return axios.post(`/index/index/login`, params)
  },
  // 商品详情
  goodsDetail (params) {
    return axios.post(`/index/shop/goods_detail`, params)
  },
  // 我的购物车
  car () {
    return axios.get(`/index/shop/car`)
  },
  // 加入购物车
  addCar (params) {
    return axios.post(`/index/shop/add_car`, params)
  },
  // 添加订单
  addOrder (params) {
    return axios.post(`/index/Shop/add_order`, params)
  },
  // 取消订单
  cancelOrder (params) {
    return axios.post(`/index/Shop/cancelOrder`, params)
  },
  // 商品评价列表
  evaluateList (params) {
    return axios.get(`/index/shop/evaluate_list?id=${params}`)
  },
  // 分类
  category () {
    return axios.get(`/index/shop/category`)
  },
  // 搜索
  search (params) {
    return axios.post(`/index/shop/search`, params)
  },
  // 收藏（取消收藏）商品
  collect (params) {
    return axios.post(`/index/shop/collect`, params)
  },
  // 删除购物车
  deleteCar (params) {
    return axios.post(`/index/shop/delete_car`, params)
  },
  // 添加评价
  evaluate (params) {
    return axios.post(`/index/shop/evaluate`, params)
  },
  // 我的收藏
  myCollect () {
    return axios.get(`/index/shop/my_collect`)
  },
  // 支付
  prePay (params) {
    return axios.post(`/index/payment/pre_pay`, params)
  },
  // 充值支付
  prePay1 (params) {
    return axios.post(`/index/payment1/pre_pay`, params)
  },
  // 积分支付
  pay (params) {
    return axios.post(`/index/shop/pay`, params)
  },
  // 确认收货
  confirm_receipt (params) {
    return axios.post(`/index/Shop/confirm_receipt`, params)
  },
  // 支付2
  pre_pay (params) {
    return axios.post(`/index/payment/pre_pay`, params)
  },
  // 支付2
  imageUp (params) {
    return axios.post(`/index/uploadify/imageUp`, params)
  }
}

export default home
