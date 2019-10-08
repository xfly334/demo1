/**
 * 接口域名的管理
 */
// const host = `http://shop.0571net.cn`
let isPro = process.env.NODE_ENV === 'production'
const base = {
  url: isPro ? `http://shop.0571net.cn` : '/api'
}

export default base
