<template>
  <div class="user-order">
    <van-tabs
      v-model="active"
      @click="onTabChange"
      sticky
      background="#F4F4F4"
      title-active-color="#D14624"
      color="#D14624"
      title-inactive-color="#000"
      line-height="2px"
      line-width="20%"
    >
      <van-tab :title="item" v-for="(item,index) in tabList" :key="index">
        <div>
          <van-list v-model="loading" error-text="请求失败，点击重新加载" :finished="finished" @load="onLoad">
            <van-panel
              :title="it.add_time | formatTime('Y/M/D h:m:s')"
              :status="statusText(it.order_status)"
              v-for="it in list"
              :key="it.id"
              :class="[index !== 0 ? 'active':'']"
            >
              <router-link :to="{ name: 'OrderInfo',query: { id: it.id }}" class="item-body">
                <div class="item-body-head">
                  <img class="item-body-head-l" :src="it.goods[0].img" alt />
                  <div class="item-body-head-r">
                    <div class="item-body-head-r-title">{{it.goods[0].goods_name}}</div>
                    <div class="item-body-head-r-desc">
                      <div class="item-body-head-r-desc-price">
                        <span class="price">{{it.goods[0].price}}</span>
                        <span>+{{it.goods[0].point}}积分</span>
                      </div>
                      <div class="item-body-head-r-desc-num">x1</div>
                    </div>
                  </div>
                </div>
                <div class="item-body-foot">
                  <span class="item-body-foot-span1">共{{it.goods.length}}件商品 合计：</span>
                  <span class="item-body-foot-span2 price">{{it.money}}</span>
                  <span class="item-body-foot-span3">+{{it.point}}积分</span>
                </div>
              </router-link>
              <div slot="footer" class="footer" v-if="it.order_status === 0">
                <van-button size="small" class="default" @click="cancelOrder(it.id)">取消订单</van-button>
                <van-button plain size="small" class="main" @click="toPay(it.order_sn)">付款</van-button>
              </div>
              <!-- <div slot="footer" class="footer" v-if="it.order_status === 1">
                <van-button plain size="small" class="main" @click="cancelOrder(it.id)">取消订单</van-button>
              </div>-->
              <div slot="footer" class="footer" v-if="it.order_status === 2">
                <van-button size="small" class="default" @click="logistics(it)">查看物流</van-button>
                <van-button plain size="small" class="main" @click="confirmReceipt(it.id)">确认收货</van-button>
              </div>
              <div slot="footer" class="footer" v-if="it.order_status === 3">
                <van-button
                  plain
                  size="small"
                  class="main"
                  :to="{name:'Appraise',query:{order_id:it.id}}"
                >去评价</van-button>
              </div>
            </van-panel>
          </van-list>
          <div class="empty" v-if="list.length === 0">
            <img
              class="empty-img"
              src="https://shop.0571net.cn/public/static/img/wechat/img_empty_order@2x.png"
              alt
            />
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div v-show="show" class="model">
      <div class="model-box">
        <img
          class="model-box-title"
          src="https://shop.0571net.cn/public/static/img/wechat/text_ViewLogistics@2x.png"
        />
        <div class="logistics">
          <div class="logistics-title">{{logisticsName}}</div>
          <div class="logistics-id">{{copy}}</div>
        </div>
        <div class="model-foot">
          <div
            class="model-foot-btn copy"
            v-clipboard:copy="copy"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制</div>
          <div class="model-foot-btn cancel" @click="show = false">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, Panel, List, Button, Dialog } from 'vant'
import wx from 'weixin-js-sdk'
export default {
  name: 'UserOrder',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Panel.name]: Panel,
    [List.name]: List,
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  filters: {
    status: (type) => {

    }
  },
  data () {
    return {
      active: 0,
      copy: '',
      tabList: ['全部', '待付款', '待发货', '待收货', '待评价'],
      list: [],
      loading: false,
      finished: false,
      show: false,
      type: 0,
      page: 1,
      error: false,
      logisticsName: ''
    }
  },
  computed: {

  },
  methods: {
    statusText (status) {
      if (status === 0) {
        return '待付款'
      } else if (status === 1) {
        return '待发货'
      } else if (status === 2) {
        return '待收货'
      } else if (status === 3) {
        return '待评价'
      } else if (status === 4) {
        return '已完成'
      } else if (status === 5) {
        return '已取消'
      } else if (status === 6) {
        return '超时'
      }
    },
    onTabChange (name, title) {
      this.type = name - 1
      console.log(name)
      console.log(this.type)
      this.page = 1
      this.list = []
      this.onLoad()
    },
    logistics (item) {
      this.copy = item.logistics
      this.show = true
      this.logisticsName = item.company
    },
    onCopy: function (e) {
      this.$toast('复制成功')
    },
    onError: function (e) {
      this.$toast('复制失败')
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
            setTimeout(() => {
              this.page = 1
              this.list = []
              this.onLoad()
            }, 500)
          } else {
            this.$toast(res.msg)
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    onLoad () {
      this.$api.user.orderList({ type: this.type, page: this.page }).then(res => {
        console.log(res)
        this.page++
        if (res.status === 1) {
          // 加载状态结束
          this.loading = false
          this.list = this.list.concat(res.data)
        } else {
          // 加载状态结束
          this.loading = false
          // 数据全部加载完成
          this.finished = true
        }
      }).catch(() => {
        this.error = true
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
            this.onLoad()
          }, 500)
        }
      })
    },
    // 微信支付
    onBridgeReady (data) {
      // wx.chooseWXPay({
      //   timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //   nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      //   package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      //   signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //   paySign: data.paySign, // 支付签名
      //   success: function (res) {
      //     // 支付成功后的回调函数
      //     console.log(res)
      //   }
      // })
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
          //   this.page = 1
          //   this.list = []
          //   this.onLoad()
          // })
          this.page = 1
          this.list = []
          this.onLoad()
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
      let data = {
        attach: 2,
        body: '商品支付',
        order_sn: sn
      }
      this.$api.home.prePay(data).then(res => {
        console.log(res)
        let vm = this
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
    }
  },

  mounted () {
    let type = Number(this.$route.query.type) || -1
    console.log(this.$route.query)
    this.active = type
    this.type = type ? type - 1 : -1
    console.log(type)
  }
}
</script>
<style lang='scss' scoped>
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0;
}
.van-panel:nth-of-type(n + 1) {
  border-top: 10px solid #f4f4f4;
}
::v-deep .van-tabs__wrap--scrollable .van-tab {
  flex: 0 0 20% !important;
}
::v-deep .van-button--small {
  line-height: 30px;
}
.price::before {
  content: '¥';
  font-size: 12px;
}
::v-deep .van-tabs--line .van-tabs__wrap {
  height: 50px;
}
::v-deep .van-tab {
  line-height: 50px;
}
.empty {
  text-align: center;
  &-img {
    display: inline-block;
    width: 180px;
    height: auto;
    margin: 30px auto;
  }
}
.van-tabs__content {
  .van-cell:not(:last-child)::after {
    border: 0;
  }
  .van-cell {
    padding: 10px;
  }
  .van-cell__title {
    font-size: 12px;
    color: #858585;
  }
  .item-body {
    padding: 10px;
    display: block;
    &-head {
      display: flex;
      align-items: center;
      height: 70px;
      &-l {
        width: 70px;
        height: 70px;
        margin-right: 15px;
      }
      &-r {
        flex: 1;
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        &-title {
          font-size: 14px;
          color: #000;
          @include ellipsis();
        }
        &-desc {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-price {
            font-size: 15px;
            color: #4c4c4c;
          }
          &-num {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
    &-foot {
      margin-top: 15px;
      text-align: right;
      font-size: 14px;
      color: #4c4c4c;
      &-span2 {
        color: #d14624;
      }
      &-span3 {
        color: #d14624;
      }
    }
  }
  .van-panel__footer {
    &::after {
      border-color: #e5e5e5;
    }
    .footer {
      text-align: right;
      button {
        font-size: 14px;
        border-radius: 5px;
      }
      .default {
        color: #858585;
        border-color: #aaaaaa;
      }
      .main {
        margin-left: 10px;
        color: #d14624;
        border-color: #d14624;
      }
    }
  }
}
.model {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  &-box {
    width: 280px;
    height: 190px;
    position: relative;
    z-index: 100;
    background: #fff;
    &-title {
      width: 100%;
      height: auto;
    }
  }
  .logistics {
    &-title,
    &-id {
      font-weight: bold;
      font-size: 18px;
      color: #000;
      margin-top: 13px;
      text-align: center;
    }
  }
  &-foot {
    margin-top: 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 38px;
    &-btn {
      width: 112px;
      height: 38px;
      line-height: 38px;
      border-radius: 100px;
      font-size: 15px;
      text-align: center;
    }
    .copy {
      background: #d14624;
      color: #fff;
    }
    .cancel {
      background: #fff;
      @include thinBorder(
        (top, right, bottom, left),
        #ccc,
        (100px, 100px, 100px, 100px)
      );
      color: #d14624;
    }
  }
}
</style>
