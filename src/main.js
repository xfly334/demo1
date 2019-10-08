import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import axios from 'axios'
import api from './api' // 将api挂载到vue的原型上
import FastClick from 'fastclick'
import { Toast, Lazyload } from 'vant' // 导入api接口
import { formatTime } from './common/filters/index'
import VueClipboard from 'vue-clipboard2'
import VueWechatTitle from 'vue-wechat-title'
Vue.config.productionTip = false
Vue.use(Lazyload).use(VueClipboard).use(VueWechatTitle)

Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype.$toast = (message, duration = 1500) => {
  Toast({
    message, duration
  })
}

Vue.prototype.$toast.success = (message, duration = 1500) => {
  Toast.success({
    message, duration
  })
}

Vue.prototype.$toast.fail = (message, duration = 1500) => {
  Toast.fail({
    message, duration
  })
}

// FastClick的ios点击穿透解决方案
FastClick.prototype.focus = function (targetElement) {
  let length
  if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
FastClick.attach(document.body)
Vue.filter('formatTime', formatTime)

// 解析url参数并获取code
function getUrlParam (name) { // name为要获取的参数名
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var rrr = decodeURIComponent(window.location.search)
  var r = rrr.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
// 请求微信服务器获取code 方法
function getUserCode () {
  const base = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
  let redirectUrl = encodeURIComponent(window.location.href)
  // let appid = 'wx8bf3e2f65747861d'
  let appid = 'wx8f3edd19c03e44eb'
  let scope = 'snsapi_userinfo'
  window.location.href = base + appid + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect'
}

// 路由变化时
router.beforeEach((to, from, next) => {
  // 读取sessionStorage的user
  let token = store.state.token
  // 已登录
  if (token) {
    next()// 释放路由 如果已经登录
  }

  // 未登录 且不是在测试环境下
  if (!token) {
    const code = getUrlParam('code')// 获取url 上面的code
    // 还未完成微信授权
    if (!code) { // 假如没code
      getUserCode()// 请求微信服务器获取code
    }

    if (code) {
      // 使用code 去登录
      axios.get('/index/index/login', {
        params: {
          code: code
        }
      }).then(res => {
        console.log(res)
        let userInfo = res.data.data
        store.state.user = userInfo
        store.state.token = userInfo.token

        // let url = decodeURIComponent(window.location.href.split('#')[0])

        next()
      }).catch(err => {
        // 登录失败，请刷新重试
        console.log(err)
      })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
