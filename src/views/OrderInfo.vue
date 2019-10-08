<template>
  <div class="OrderInfo">
    <div class="bg"></div>
    <div class="status">{{statusText(info.order_status)}}</div>
    <div class="add">
      <img
        class="add-icon"
        src="https://shop.0571net.cn/public/static/img/wechat/icon_address@2x.png"
        alt
      />
      <div class="add-r">
        <div class="add-r-head">
          <span class="add-r-head-name">{{info.consignee}}</span>
          <span class="add-r-head-tel">{{info.mobile}}</span>
        </div>
        <div class="add-r-foot">{{info.address}}</div>
      </div>
    </div>
    <div class="goods">
      <div class="goods-item" v-for="item in info.goods" :key="item.id">
        <img class="goods-item-img" :src="item.img" alt />
        <div class="goods-item-r">
          <div class="goods-item-r-head">{{item.goods_name}}</div>
          <div class="goods-item-r-foot">
            <div class="goods-item-r-foot-price">
              <span class="price">{{item.price}}</span>
              <span class="score">{{item.point}}积分</span>
            </div>
            <div class="goods-item-r-foot-num">X {{item.num}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="total-head">
        <div class="total-head-l">总计</div>
        <div class="total-head-r">
          <span class="price">{{info.money}}</span>
          <span class="score">{{info.point}}积分</span>
        </div>
      </div>
      <div class="total-foot">买家留言：{{info.remark}}</div>
    </div>
    <div class="desc">
      <div class="desc-row">
        <span class="desc-row-title">订单编号：</span>
        <span class="desc-row-cont">{{info.order_sn}}</span>
      </div>
      <div class="desc-row">
        <span class="desc-row-title">创建时间：</span>
        <span class="desc-row-cont">{{info.add_time | formatTime('Y/M/D h:m:s')}}</span>
      </div>
      <div class="desc-row" v-if="info.pay_time">
        <span class="desc-row-title">付款时间：</span>
        <span class="desc-row-cont">{{info.pay_time | formatTime('Y/M/D h:m:s')}}</span>
      </div>
      <div class="desc-row" v-if="info.logistics">
        <span class="desc-row-title">物流单号：</span>
        <span class="desc-row-cont">{{info.logistics}}</span>
      </div>
      <div class="desc-row" v-if="info.company">
        <span class="desc-row-title">物流公司：</span>
        <span class="desc-row-cont">{{info.company}}</span>
      </div>
    </div>
    <div class="footer">
      <div
        class="footer-btn cancel"
        @click="cancelOrder(info.id)"
        v-if="info.order_status === 0"
      >取消订单</div>
      <div class="footer-btn pay" @click="toPay(info.order_sn)" v-if="info.order_status === 0">去付款</div>
      <div
        class="footer-btn pay"
        @click="confirmReceipt(info.id)"
        v-if="info.order_status === 2"
      >确认收货</div>
      <router-link
        class="footer-btn pay"
        :to="{name:'Appraise',query:{order_id:info.id}}"
        v-if="info.order_status === 3"
      >去评价</router-link>
    </div>
  </div>
</template>

<script>
import { Card, Dialog } from 'vant'
export default {
  name: 'OrderInfo',
  components: {
    [Card.name]: Card,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      info: {}
    }
  },
  computed: {},
  methods: {
    statusText (status) {
      if (status === 0) {
        return '等待买家付款'
      } else if (status === 1) {
        return '等待卖家发货'
      } else if (status === 2) {
        return '等待买家确认收货'
      } else if (status === 3) {
        return '等待买家评价'
      } else if (status === 4) {
        return '已完成'
      } else if (status === 5) {
        return '已取消'
      } else if (status === 6) {
        return '超时'
      }
    },
    cancelOrder (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定取消该订单？'
      }).then(() => {
        this.$api.home.cancelOrder({ id }).then(res => {
          console.log(res)
          if (res.status === 1) {
            this.$toast.success(res.msg, 500)
            this.getInfo(id)
          } else {
            this.$toast(res.msg)
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    getInfo (id) {
      this.$api.user.orderInfo({ id }).then(res => {
        console.log(res)
        this.info = res.data
      })
    },
    // 微信支付
    onBridgeReady (data) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        'appId': data.appId, // 公众号名称，由商户传入
        'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
        'nonceStr': data.nonceStr, // 随机串
        'package': data.package,
        'signType': data.signType, // 微信签名方式：
        'paySign': data.paySign // 微信签名
      }, (res) => {
        console.log(res)
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          // this.$api.home.pay(this.order_sn).then(res => {
          //   console.log(res)
          // })
          this.getInfo()
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          console.log('已取消支付')
          this.$toast.fail('已取消支付', 800)
        } else {
          this.$toast.fail('支付失败', 800)
          console.log('支付失败')
        }
      })
    },
    toPay (sn) {
      let vm = this
      let data = {
        attach: 2,
        body: '商品支付',
        order_sn: sn
      }
      this.$api.home.prePay(data).then(res => {
        console.log(res)
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(res.data), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(res.data))
            document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(res.data))
          }
        } else {
          this.onBridgeReady(res.data)
        }
      })
    },
    confirmReceipt (id) {
      this.$api.home.confirm_receipt({ id }).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.page = 1
          this.list = []
          this.$toast.success(res.msg, 500)
          setTimeout(() => {
            this.getInfo(id)
          }, 500)
        }
      })
    }
  },
  mounted () {
    let id = Number(this.$route.query.id)
    console.log(this.$route.query)
    this.getInfo(id)
  }
}
</script>
<style lang='scss' scoped>
.OrderInfo {
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - constant(safe-area-inset-bottom));
  height: calc(100% - env(safe-area-inset-bottom));
  z-index: -1;
  background: #f4f4f4;
}
.price::before {
  content: '¥';
  font-size: 12px;
}
.score::before {
  content: '+';
  font-size: 15px;
}
.status {
  line-height: 100px;
  padding-left: 18px;
  background: #d14624;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}
.add {
  min-height: 80px;
  background: #fff;
  display: flex;
  padding: 20px 15px;
  align-items: center;
  &-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
  &-r {
    flex: 1;
    display: flex;
    min-height: 40px;
    flex-direction: column;
    justify-content: space-between;
    &-head {
      color: #000;
      font-size: 14px;
      &-tel {
        margin-left: 30px;
      }
    }
    &-foot {
      color: #000;
      font-size: 14px;
    }
  }
}
.goods {
  border-top: 10px solid #f4f4f4;
  padding: 15px 10px;
  &-item {
    height: 95px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    &-img {
      width: 95px;
      height: 95px;
      margin-right: 10px;
    }
    &-r {
      flex: 1;
      display: flex;
      height: 95px;
      flex-direction: column;
      justify-content: space-between;
      &-head {
        font-size: 14px;
        color: #000;
        @include ellipsis();
      }
      &-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-price {
          color: #d14624;
          font-size: 14px;
        }
        &-num {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
.total {
  padding: 0 10px;
  background: #fff;
  &-head {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include thinBorder(bottom, #e5e5e5);
    &-l {
      font-size: 14px;
      color: #000;
    }
    &-r {
      color: #d14624;
      font-size: 14px;
    }
  }
  &-foot {
    min-height: 45px;
    padding: 5px 0;
    line-height: 1.5;
    font-size: 14px;
    color: #000;
    display: flex;
    align-items: center;
  }
}
.desc {
  background: #fff;
  padding: 10px;
  border-top: 10px solid #f4f4f4;
  &-row {
    color: #666;
    font-size: 14px;
    line-height: 28px;
    &-title {
      margin-right: 20px;
    }
  }
}
.footer {
  position: fixed;
  left: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  &-btn {
    flex: 1;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 15px;
  }
  .cancel {
    background: #f99114;
  }
  .pay {
    background: #d14624;
  }
}
</style>
