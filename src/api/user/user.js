/**
 * 模块接口列表
 */
import axios from '../http' // 导入http中创建的axios实例
const user = {
  // 查询个人信息
  information () {
    return axios.get(`/index/user/information`)
  },
  // 充值记录
  rechargeList () {
    return axios.get(`/index/user/recharge_list`)
  },
  // 订单列表
  orderList (params) {
    return axios.post(`/index/User/orderList`, params)
  },
  // 订单详情
  orderInfo (params) {
    return axios.post(`/index/User/order_info`, params)
  },
  // 绑定/修改手机号
  updateMobile (params) {
    return axios.post(`/index/user/update_mobile`, params)
  },
  // 建议反馈
  feedback (params) {
    return axios.post(`/index/user/feedback`, params)
  },
  // 充值页面数据
  recharge () {
    return axios.get(`/index/user/recharge`)
  },
  // 添加充值
  addRecharge (params) {
    return axios.post(`/index/user/add_recharge`, params)
  },
  // 关于我们
  about () {
    return axios.get(`/index/user/about`)
  },
  // 添加/修改地址
  addEditAddress (params) {
    return axios.post(`/index/user/addEditAddress`, params)
  },
  // 地址详情
  addressDetail (params) {
    return axios.post(`/index/user/address_detail`, params)
  },
  // 地址列表
  address () {
    return axios.get(`/index/user/address`)
  },
  // 删除地址
  deleteAddress (params) {
    return axios.post(`/index/user/delete_address`, params)
  },
  // 设置默认地址
  setDefaultAddress (params) {
    return axios.post(`/index/user/set_default_address`, params)
  },
  // 默认地址
  defaultAddress () {
    return axios.get(`/index/user/default_address`)
  },
  // 默认地址
  wxjssdk () {
    return axios.get(`/index/index/jssdk`)
  }
}

export default user
