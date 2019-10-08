<template>
  <div id="app" :class="tabbarShow ? 'tab':''" v-cloak>
    <router-view />
    <!-- <Tabbar v-if="tabbarShow" /> -->
  </div>
</template>
<script>
// import Tabbar from '@/components/TabBar/index.vue'
export default {
  components: {
    // Tabbar
  },
  data () {
    return {
      tabbarShow: true
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route (to, from) {
      // 判断是否显示tabbar
      if (
        to.path === '/' ||
        to.path === '/home' ||
        to.path === '/cart' ||
        to.path === '/user' ||
        to.path === '/category'
      ) {
        this.tabbarShow = true
      } else {
        this.tabbarShow = false
      }
    }
  },
  methods: {
    getUrlParam (name) { // name为要获取的参数名
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var rrr = decodeURIComponent(window.location.search)
      var r = rrr.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  },
  mounted () {
    // console.log('hometoken:' + this.$store.state.token)
    // const appid = 'wx8bf3e2f65747861d'
    // let redirectUrl = window.location.href
    // // let redirectUrl = 'http://shop.0571net.cn/index/index/index#/home'
    // redirectUrl = encodeURIComponent(redirectUrl)
    // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
    // let code = this.getUrlParam('code')
    // console.log('code' + code);
    // if (code) {
    //   this.$api.home.login({ code: code }).then(res => {
    //     console.log('login:');
    //     console.log(res);
    //     store.commit("SET_TOKEN", res.access_token);

    //   })
    // }

    // this.$api.user.information().then(res => {
    //   console.log(res)
    // })
  }
}
</script>
<style lang="scss">
@import './style/normalize.scss';
@import './style/reset.scss';
.tab {
  padding-bottom: 50px;
}
</style>
