import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      head_pic: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINgAfw3mZgFbQibKuylemicexmYTWXFHib0R0yQKH9EicXpk4RBficaPoABAibQ5IJItzgrNN6tSzurcbQ/132',
      id: 3,
      last_login: 1569487195,
      mobile: '18668241887',
      nickname: 'メ丶飞',
      open_id: 'onTpTxM6o6_2vcA4CQqkJeBLT0cQ',
      point: 0,
      reg_time: 1569483573,
      token: '5d900e3ccd19715697219165d900e3ccd1d9'
    },
    add: {},
    defaultAdd: false,
    token: '5d900e3ccd19715697219165d900e3ccd1d9'
  },
  mutations: {
    setAdd (state, data) {
      state.add = data
    },
    setDeAdd (state, data) {
      state.defaultAdd = data
    }
  },
  actions: {
  }
})

// 在组件中使用
// computed: {
//   user() {
//     return this.$store.state.user;
//   }
// }

// 在需要的时候更新数据
// this.$store.commit("updateUser", user);
