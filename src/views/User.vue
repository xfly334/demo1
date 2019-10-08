<template>
  <div class="user">
    <div class="user-head">
      <div class="user-head-row">
        <div class="user-head-row-l">
          <img class="user-head-row-l-pic" :src="user.head_pic" alt />
          <div class="user-head-row-l-row">
            <div class="user-head-row-l-name">{{user.nickname}}</div>
            <div class="user-head-row-l-tel">
              <img
                class="user-head-row-l-tel-icon"
                src="https://shop.0571net.cn/public/static/img/wechat/icon_phone@2x.png"
                alt
              />
              <div
                class="user-head-row-l-tel-text"
                @click="isShow = true"
              >{{user.mobile?user.mobile : '绑定手机号'}}</div>
            </div>
          </div>
        </div>
        <div class="user-head-row-r">
          <router-link :to="{name:'Recharge'}">
            <img
              class="user-head-row-r-img"
              src="https://shop.0571net.cn/public/static/img/wechat/btn_chongzhi@2x.png"
              alt
            />
          </router-link>
        </div>
      </div>
      <div class="user-head-foot">
        <div class="user-head-foot-text">我的积分</div>
        <div class="user-head-foot-num">{{user.point}}</div>
      </div>
    </div>
    <div class="user-nav">
      <div class="user-title">我的订单</div>
      <div class="user-nav-row">
        <router-link
          class="user-nav-row-item"
          v-for="(item,index) in navArr"
          :key="index"
          :to="{name:'UserOrder',query:{type:item.type}}"
        >
          <img class="user-nav-row-item-icon" :src="item.icon" alt />
          <div class="user-nav-row-item-text">{{item.name}}</div>
        </router-link>
      </div>
    </div>
    <div class="user-list">
      <van-cell
        :title="item.title"
        :to="{name:item.url}"
        is-link
        @click="call(item.title)"
        v-for="(item,index) in classList"
        :key="index"
      />
    </div>

    <div class="model" v-show="isShow">
      <div class="model-box">
        <img
          class="model-box-img"
          src="https://shop.0571net.cn/public/static/img/wechat/cellmobile@2x.png"
          alt
        />
        <div class="model-box-foot">
          <van-field v-model="mobile" maxlength="11" placeholder="输入手机号" type="number" />
          <van-field v-model="code" clearable placeholder="输入验证码" class="code-cell">
            <van-button
              slot="button"
              size="small"
              type="primary"
              class="get-code"
              @click="getCode"
              :disabled="isCode"
            >{{codeText}}</van-button>
          </van-field>
          <div class="model-box-foot-btn">
            <van-button round size="small" color="#d14624" hairline @click="save">保存</van-button>
            <van-button round size="small" color="#ccc" plain hairline @click="cancelTel">取消</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Button, Field, Toast } from 'vant'
import { _throttle } from '../common/utils'
export default {
  name: 'User',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Field.name]: Field,
    [Toast.name]: Toast
  },
  data () {
    return {
      user: {},
      isShow: false,
      mobile: '',
      codeText: '获取验证码',
      code: null,
      errorMessage: '',
      isCode: false,
      error: false,
      navArr: [
        {
          icon: 'https://shop.0571net.cn/public/static/img/wechat/icon_menu_all@2x.png',
          name: '全部',
          type: null
        }, {
          icon: 'https://shop.0571net.cn/public/static/img/wechat/icon_menu_payFor@2x.png',
          name: '待付款',
          type: 1
        }, {
          icon: 'https://shop.0571net.cn/public/static/img/wechat/icon_menu_deliver@2x.png',
          name: '待发货',
          type: 2
        }, {
          icon: 'https://shop.0571net.cn/public/static/img/wechat/icon_menu_takeGoods@2x.png',
          name: '待收货',
          type: 3
        }, {
          icon: 'https://shop.0571net.cn/public/static/img/wechat/icon_menu_evaluate@2x.png',
          name: '待评价',
          type: 4
        }
      ],
      classList: [{
        title: '我的收藏',
        url: 'Collect'
      }, {
        title: '我的地址',
        url: 'AddressList'
      }, {
        title: '关于我们',
        url: 'About'
      }, {
        title: '建议反馈',
        url: 'Suggest'
      }, {
        title: '联系客服',
        url: ''
      }]
    }
  },
  computed: {
    // user () {
    //   return this.$store.state.user;
    // }

  },
  methods: {
    call (title) {
      console.log(title)
      if (title === '联系客服') {
        window.location.href = `tel:${this.user.custom_mobile}`
      }
    },
    // 发送验证码
    getCode: _throttle(function () {
      if (this.mobile === '' || this.mobile.length <= 0) {
        this.$toast.fail('号码不能为空')
        return false
      }
      if (this.mobile.length < 11) {
        this.$toast.fail('手机号格式错误')
        return false
      }
      let type = 1
      if (this.user.mobile !== '') {
        type = 2
      }
      let data = {
        mobile: this.mobile,
        type: type
      }
      this.$api.home.send(data).then(res => {
        console.log(res)
        this.$toast.success(res.msg, 1000)
        if (res.status === 1) {
          let timer = 119
          this.isCode = true
          let authTimetimer = setInterval(() => {
            this.codeText = timer + 's'
            timer--
            if (this.isShow) {
              if (timer < 0) {
                this.isCode = false
                this.codeText = '获取验证码'
                clearInterval(authTimetimer)
              }
            } else {
              this.isCode = false
              this.codeText = '获取验证码'
              clearInterval(authTimetimer)
            }
          }, 1000)
        }
      })
    }),
    cancelTel () {
      this.isShow = false
      this.mobile = ''
      this.code = ''
    },
    // 绑定手机号
    save: _throttle(function () {
      let type = 1
      if (this.user.mobile !== '') {
        type = 2
      }
      if (this.mobile === '') {
        this.$toast.fail('号码不能为空')
        return false
      }
      if (this.mobile.length < 11) {
        this.$toast.fail('手机号格式错误')
        return false
      }
      let data = {
        type,
        mobile: this.mobile,
        code: this.code
      }
      this.$api.user.updateMobile(data).then(res => {
        console.log(res)
        this.$toast.success(res.msg, 1000)
        if (res.status === 1) {
          this.isShow = false
          this.mobile = ''
          this.code = ''
          this.getInfo()
        }
      })
    }),
    getInfo () {
      this.$api.user.information().then(res => {
        console.log(res)
        if (res.status === 1) {
          this.user = res.data
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style lang="scss" scoped>
.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  &-box {
    width: 280px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    &-img {
      width: 100%;
      height: auto;
    }
    &-foot {
      padding: 0 20px 10px;
      .van-cell {
        padding: 15px 16px;
      }
      .code-cell {
        padding: 15px 0 15px 16px;
      }
      .get-code {
        background: #fff;
        color: #d14624;
        border: 0;
        font-size: 14px;
        &.van-button:active::before {
          opacity: 0;
        }
      }
      ::v-deep .van-field__control {
        font-size: 16px;
      }

      &-btn {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        .van-button--small {
          width: 112px;
          height: 38px;
          font-size: 15px;
        }
      }
    }
  }
}
.user {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  min-height: 100%;
  padding-bottom: calc(50px - constant(safe-area-inset-bottom));
  padding-bottom: calc(50px - env(safe-area-inset-bottom));
  background: #f4f4f4;
}
.user-head {
  width: 100%;
  background: url('https://shop.0571net.cn/public/static/img/wechat/bg_personal_top@2x.png')
    no-repeat;
  background-size: 100% 100%;
  height: 200px;
  padding-top: 15px;
  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 7px 0 25px;
    &-l {
      display: flex;
      align-items: center;
      &-pic {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #fff;
        overflow: hidden;
        margin-right: 10px;
      }
      &-name {
        color: #fff;
        font-size: 15px;
      }
      &-tel {
        margin-top: 13px;
        display: flex;
        align-items: center;
        padding: 5px 7px;
        @include thinBorder(
          (top, right, bottom, left),
          #fff,
          (3px, 3px, 3px, 3px)
        );
        &-icon {
          width: 18px;
          height: 18px;
        }
        &-text {
          font-size: 14px;
          color: #fff;
        }
      }
    }
    &-r-img {
      width: 71px;
      height: auto;
    }
  }

  &-foot {
    margin-top: 30px;
    text-align: center;
    &-text {
      color: #fff;
      font-size: 14px;
    }
    &-num {
      font-size: 32px;
      color: #fff;
      margin-top: 10px;
    }
  }
}
.user-nav {
  padding: 17px 10px;
  background: #fff;
  &-row {
    margin-top: 20px;
    padding: 0 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &-icon {
        width: 34px;
        height: 34px;
      }
      &-text {
        font-size: 13px;
        color: #666;
        margin-top: 6px;
      }
    }
  }
}
.user-title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
.user-list {
  background: #fff;
  padding: 0 10px;
  border-top: 10px solid #f4f4f4;
  .van-cell {
    line-height: 30px;
    &::after {
      border-color: #e0e0e0;
    }
  }
}
</style>
