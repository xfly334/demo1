<template>
  <div class="recharge">
    <div class="header">
      <router-link :to="{name:'Record'}" class="header-jl">
        <img src="https://shop.0571net.cn/public/static/img/wechat/icon_czjl@2x.png" alt />
        <span>充值记录</span>
      </router-link>
      <div class="header-title">可用积分</div>
      <div class="header-total">{{point}}</div>
    </div>
    <div class="body box">
      <div class="title">
        <span class="title-main">优惠充值</span>
        <span class="title-desc">（充的多送的多）</span>
      </div>
      <div>
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio :name="item.id" v-for="(item) in list" :key="item.id">
            <div :class="[radio === item.id ? 'active':'','radio-box']" v-if="item.name !== ''">
              <div class="radio-box-1">￥{{item.buy}}</div>
              <div class="radio-box-2">送{{item.give}}</div>
            </div>
            <div :class="[radio === item.id ? 'active':'','radio-box']" v-else>
              <div class="radio-box-3">{{item.text}}</div>
            </div>
          </van-radio>
          <van-radio name="big">
            <div :class="[radio === 'big' ? 'active':'','radio-box']">
              <div class="radio-box-3">大客户采购</div>
            </div>
          </van-radio>
          <van-radio name="entity">
            <div :class="[radio === 'entity' ? 'active':'','radio-box']">
              <div class="radio-box-3">实物礼品卡</div>
            </div>
          </van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="seckill box">
      <div class="title">
        <span class="title-main">限时秒杀</span>
        <span class="title-desc">（{{spike.start_time | formatTime('Y/M/D h:m:s')}}点开始）</span>
      </div>
      <div class="seckill-box">
        <div class="seckill-box-l">
          <img class="seckill-box-l-img" :src="spike.img" alt />
          <div class="seckill-box-l-text">
            <div class="seckill-box-l-text-title">{{spike.name}}</div>
            <div class="seckill-box-l-text-num">限量{{spike.num}}件</div>
          </div>
        </div>
        <div class="seckill-box-r">
          <van-button
            plain
            hairline
            round
            color="#d14624"
            size="small"
            @click="addRecharge(2,spike.id)"
          >马上抢</van-button>
        </div>
      </div>
    </div>
    <div class="footer-btn" @click="addRecharge(1)">充值</div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Button, Dialog } from 'vant'
import { _throttle } from '../common/utils'
export default {
  name: 'Recharge',
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Button.name]: Button,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      radio: 1,
      point: 0,
      spike: {},
      list: []
    }
  },
  methods: {
    getList () {
      this.$api.user.recharge().then(res => {
        console.log(res)
        if (res.status === 1) {
          this.point = res.data.point
          this.list = res.data.list
          this.spike = res.data.spike
        }
      })
    },
    addRecharge: _throttle(function (type, id = null) {
      let data = {
        id: id || this.radio,
        type
      }
      this.$api.user.addRecharge(data).then(res => {
        console.log(res)
        // this.$toast(res.msg)
        let datas = {
          attach: 1,
          body: '充值支付',
          order_sn: res.data
        }
        this.$api.home.prePay1(datas).then(res => {
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
            }
          } else {
            this.onBridgeReady(res.data)
          }
        })
      })
    }),
    onBridgeReady (data) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        'appId': data.appId, // 公众号名称，由商户传入
        'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
        'nonceStr': data.timeStamp, // 随机串
        'package': data.package,
        'signType': data.signType, // 微信签名方式：
        'paySign': data.paySign // 微信签名
      }, (res) => {
        console.log(res)
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          this.$toast.success('支付成功', 800)
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          console.log('已取消支付')
          this.$toast.fail('已取消支付', 800)
        } else {
          this.$toast.fail('支付失败', 800)
          console.log('支付失败')
        }
      })
    },
    radioChange (name) {
      console.log(name)
      if (name === 'big') {
        this.$router.push({ name: 'Big' })
      }
      if (name === 'entity') {
        Dialog.alert({
          title: '提示',
          message: '开发中'
        }).then(() => {
          // on close
        })
      }
    }
  },

  mounted () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.recharge {
  padding-bottom: calc(50px - constant(safe-area-inset-bottom));
  padding-bottom: calc(50px - env(safe-area-inset-bottom));
}
.header {
  height: 160px;
  background: url('https://shop.0571net.cn/public/static/img/wechat/bg_chongzhi_top@2x.png')
    no-repeat;
  background-size: 100% 100%;
  padding: 20px 10px;
  text-align: center;
  &-jl {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    span {
      font-size: 13px;
      color: #fff;
    }
  }
  &-title {
    font-size: 13px;
    color: #fff;
    opacity: 0.58;
    margin-top: 5px;
  }
  &-total {
    margin-top: 18px;
    color: #fff;
    font-size: 32px;
    font-weight: bold;
  }
}

.box {
  padding: 20px 10px;
  border-bottom: 10px solid #f4f4f4;
  .title {
    display: flex;
    align-items: center;
    border-left: 3px solid #d14624;
    padding-left: 10px;
    &-main {
      font-size: 16px;
      color: #000;
      font-weight: bold;
    }
    &-desc {
      font-size: 12px;
      color: #a5a5a5;
      margin-left: 5px;
    }
  }
}
.van-radio-group {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 110px);
  justify-content: space-between;
  grid-row-gap: 10px;
  ::v-deep .van-radio__icon {
    position: absolute;
    z-index: -1;
  }
  ::v-deep .van-radio__label {
    margin: 0;
  }
  .van-radio {
    overflow: initial;
  }
  .radio-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include thinBorder(
      (top, right, bottom, left),
      #a5a5a5,
      (2px, 2px, 2px, 2px)
    );
    height: 50px;
    width: 110px;
    background: #fff;
    &.active {
      background: #d14624;
      &,
      .radio-box-1,
      .radio-box-2,
      .radio-box-3 {
        color: #fff;
      }
    }
    &-1,
    &-3 {
      font-size: 15px;
      color: #000;
    }
    &-2 {
      font-size: 12px;
      color: #999;
    }
  }
}
.seckill-box {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  &-l {
    flex: 1;
    display: flex;
    align-items: center;
    height: 75px;
    &-img {
      width: 100px;
      height: 75px;
      margin-right: 10px;
    }
    &-text {
      flex: 1;
      height: 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      &-title {
        color: #000;
        font-size: 15px;
      }
      &-num {
        color: #999;
        font-size: 13px;
      }
    }
  }
}
.footer-btn {
  position: fixed;
  left: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: linear-gradient(-90deg, #cb2620, #d14624);
  font-size: 15px;
  color: #fff;
  font-weight: bold;
}
</style>
