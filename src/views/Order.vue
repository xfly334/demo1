<template>
  <div class="order">
    <div class="address">
      <van-cell
        v-if="Object.keys(address).length === 0"
        title="请选择一个收货地址"
        icon="https://shop.0571net.cn/public/static/img/wechat/icon_address@2x.png"
        is-link
        :to="{name:'AddressList'}"
      />
      <van-cell
        v-else
        icon="https://shop.0571net.cn/public/static/img/wechat/icon_address@2x.png"
        is-link
        :to="{name:'AddressList'}"
      >
        <template slot="title">
          <div class="address-group">
            <span class="address-group-title">收件人：</span>
            <span class="address-group-name">{{address.consignee}}</span>
            <span class="address-group-tel">{{address.mobile}}</span>
          </div>
          <div class="address-group">
            <span class="address-group-title">收货地址：</span>
            <span
              class="address-group-addinfo"
            >{{address.province}} {{address.city}} {{address.district}} {{address.address}}</span>
          </div>
        </template>
      </van-cell>
    </div>
    <div class="order-goods line">
      <van-card
        v-for="(item,index) in goods"
        :key="index"
        :num="item.num"
        :title="item.name"
        :thumb="item.img"
      >
        <div slot="price">
          <span class="van-card-price" v-if="item.price !== '0.00'">{{item.price}}</span>
          <span
            :class="[item.price !== '0.00' ? 'price':'','van-card-integral']"
            v-if="item.point"
          >{{item.point}}</span>
        </div>
      </van-card>
    </div>
    <div class="line">
      <van-field
        v-model="message"
        label="备注"
        type="textarea"
        placeholder="请输入留言"
        rows="1"
        autosize
      />
    </div>
    <van-submit-bar
      safe-area-inset-bottom
      :price="totalPrice"
      button-text="提交订单"
      :suffix-label="totalIntegral"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { Cell, Card, Field, SubmitBar } from 'vant'
export default {
  name: 'Order',
  components: {
    [Cell.name]: Cell,
    [Card.name]: Card,
    [Field.name]: Field,
    [SubmitBar.name]: SubmitBar
  },
  data () {
    return {
      message: '',
      defaultAdd: true,
      goods: [],
      goods_id: [],
      order_sn: ''
    }
  },
  computed: {
    totalPrice () {
      return (
        this.goods.reduce((total, item) => {
          console.log(total + Number(item.price))
          return total + Number(item.price) * item.num
        }, 0) * 100
      )
    },
    totalIntegral () {
      return (
        '+' + this.goods.reduce((total, item) => {
          return total + item.point * item.num
        }, 0) + '积分'
      )
    },
    address () {
      return this.$store.state.add
    }
  },
  beforeRouteEnter (to, from, next) {
    // 这里还无法访问到组件实例，this === undefined
    let path = from.name
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (path !== 'AddressList') {
        vm.getAdd()
      }
    })
  },
  methods: {
    formatPrice (price) {
      return price.toFixed(2)
    },
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
          this.$api.home.pay(this.order_sn).then(res => {
            console.log(res)
            this.$router.push({ name: 'UserOrder' })
          })
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          console.log('已取消支付')
          this.$toast.fail('已取消支付', 800)
          this.$router.push({ name: 'UserOrder' })
        } else {
          this.$toast.fail('支付失败', 800)
          console.log('支付失败')
        }
      })
    },
    onSubmit () {
      // this.$toast('点击结算')
      let vm = this
      let data = {
        address_id: this.address.id,
        remark: this.message,
        goods: JSON.stringify(this.goods_id)
      }
      console.log(data)
      this.$api.home.addOrder(data).then(res => {
        console.log(res)
        this.order_sn = res.data
        let datas = {
          attach: 2,
          body: '商品支付',
          order_sn: res.data
        }
        return this.$api.home.prePay(datas)
      }).then(res => {
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
    getInfo (arr) {
      for (let i of arr) {
        this.$api.home.goodsDetail({ id: i.goods_id }).then(res => {
          console.log(res)
          if (res.status === 1) {
            let data = res.data
            data.num = i.num
            this.goods.push(data)
          }
        })
      }
      console.log(this.goods)
    },
    getAdd () {
      this.$api.user.defaultAddress().then(res => {
        console.log(res)
        if (res.status === 1) {
          this.$store.commit('setAdd', res.data)
          // this.defaultAdd = false
        } else {
          this.$store.commit('setAdd', {})
        }
      })
    }
  },
  mounted () {
    let arr = JSON.parse(this.$route.query.goods)
    console.log(arr)
    this.goods_id = arr
    this.getInfo(arr)
  }
}
</script>

<style lang="scss" scoped>
.line {
  border-top: 10px solid #f4f4f4;
}
.address-group {
  font-size: 14px;
  display: flex;
  // align-items: center;

  &-title {
    color: #999;
    // min-width: 60px;
  }
  &-name {
    color: #000;
    margin-right: 32px;
  }
  &-addinfo {
    flex: 1;
  }
}
.order {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: #f5f5f5;
  .address {
    min-height: 60px;
    display: flex;
    align-items: center;
    background: #fff;
    .van-cell {
      font-size: 14px;
      color: #000;
      display: flex;
      align-items: center;
    }
  }
}
.van-card {
  flex: 1;
  background: #fff;
  padding: 15px;
  margin: 0;
  @include thinBorder(bottom, #e5e5e5);
  .van-card__thumb {
    width: 95px;
    height: 95px;
  }
  .van-card__content {
    min-height: auto;
    height: 95px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .van-card__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .van-card__title {
    font-size: 14px;
    color: #000;
  }
  .van-card__num {
    font-size: 13px;
  }
  .van-card__price {
    font-size: 15px;
    color: #d14624;
  }
  .van-card-price::before {
    content: '￥';
  }
  .van-card-integral.price::before {
    content: '+';
  }
  .van-card-integral::after {
    content: '积分';
  }
}
::v-deep .van-field__body {
  min-height: 24px;
}
.van-submit-bar {
  .van-submit-bar__price {
    color: #d14624;
  }
  .van-submit-bar__suffix-label {
    font-size: 18px;
    color: #d14624;
    margin: 0;
  }
  .van-submit-bar__text {
    text-align: left;
  }
}
.van-submit-bar__bar {
  padding-left: 10px;
}
</style>
