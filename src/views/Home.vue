<template>
  <div class="home">
    <van-search
      placeholder="请输入商品名称搜索"
      v-model="value"
      show-action
      shape="round"
      @focus="getSearch"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-swipe :autoplay="5000" indicator-color="#000000">
      <van-swipe-item
        v-for="image in banner"
        :key="image.id"
        @click="bannerClick(image.title,image.id)"
      >
        <img v-lazy="image.img" />
      </van-swipe-item>
    </van-swipe>
    <router-link :to="{name:'Recharge',meta:{title:'123'}}">
      <img
        class="recharge"
        src="https://shop.0571net.cn/public/static/img/wechat/bg_jf_chongzhi@2x.png"
        alt="积分充值"
      />
    </router-link>
    <div class="integral">
      <img
        class="integral-left"
        src="https://shop.0571net.cn/public/static/img/wechat/bg_jf_choujiang@2x.png"
        alt="积分抽奖"
        @click="lottery"
      />
      <div class="integral-right">
        <router-link :to="{name:'AllIntegral',query:{goods_type:1}}">
          <img
            src="https://shop.0571net.cn/public/static/img/wechat/bg_jf_quane@2x.png"
            alt="全额积分商品"
          />
        </router-link>
        <router-link :to="{name:'Integral'}">
          <img
            src="https://shop.0571net.cn/public/static/img/wechat/bg_jf_bufen@2x.png"
            alt="部分积分商品"
          />
        </router-link>
      </div>
    </div>
    <div class="hot-title">
      <img
        class="title-img"
        src="https://shop.0571net.cn/public/static/img/wechat/title_home_hot@2x.png"
        alt="热销体检"
      />
    </div>
    <div class="hot-cont">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;padding:10px 12px">
          <router-link :to="{name:'Goods',query:{id:good.id}}" v-for="good in goods" :key="good.id">
            <div class="hot-cont-item">
              <img class="cont-item-img" :src="good.img" alt />
              <div class="cont-item-foot">
                <div class="foot-title ellipsis">{{good.name}}</div>
                <div class="foot-price ellipsis">
                  <span class="price" v-if="good.price !== '0.00'">{{good.price}}</span>
                  <span class="int" v-if="good.price !== '0.00'">+</span>
                  <span class="int">{{good.point}}积分</span>
                </div>
                <div class="foot-sale ellipsis">已售{{good.sale_num}}件</div>
              </div>
            </div>
          </router-link>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Search, Swipe, SwipeItem, Grid, GridItem, Dialog, List } from 'vant'
// import wx from 'weixin-js-sdk'
export default {
  name: 'Home',
  data () {
    return {
      value: '',
      goods: [],
      banner: [],
      loading: false,
      finished: false,
      page: 1
    }
  },
  components: {
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Dialog.name]: Dialog,
    [List.name]: List
  },
  methods: {
    onSearch () {
      this.$router.push({ name: 'Search', query: { key: this.value } })
    },
    onCancel () {
      this.$toast(this.$t('cancel'))
    },
    onLoad () {
      this.$api.home.indexList({ page: this.page }).then(res => {
        let data = res.data
        if (!this.banner.length) {
          this.banner = data.banner
        }
        if (data.goods.length) {
          this.page++
          this.loading = false
          this.goods = this.goods.concat(data.goods)
        } else {
          this.loading = false
          this.finished = true
        }
      })
    },
    bannerClick (title, id) {
      if (title) {
        this.$router.push({ name: 'Diy', query: { id } })
      }
    },
    getSearch () {
      // this.$router.push({ name: 'Search' })
    },
    // 积分抽奖
    lottery () {
      Dialog.alert({
        title: '提示',
        message: '该模块暂未开放，敬请期待！'
      }).then(() => {
        // on close
      })
    }
  },
  mounted () {
    // this.onLoad()
    // this.$api.user.wxjssdk().then(res => {
    //   console.log(res)
    //   wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: res.data.appId, // 必填，公众号的唯一标识
    //     timestamp: res.data.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
    //     signature: res.data.signature, // 必填，签名
    //     jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
    //   })
    // })
  }
}
</script>
<style lang="scss" scoped>
.van-cell {
  line-height: 20px;
}
::v-deep .van-field__control {
  line-height: 20px;
}
.home {
  ::v-deep .van-grid-item__content--center {
    padding: 0;
  }
}

.van-swipe {
  height: 190px;
}
.recharge {
  display: block;
  width: 355px;
  height: auto;
  margin: 10px auto;
}
.integral {
  margin: 0 10px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 165px;
  overflow: hidden;
  .integral-left {
    width: 155px;
    height: auto;
  }
  .integral-right {
    width: 195px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    img {
      width: 100%;
      height: auto;
    }
  }
}
.hot-title {
  width: 100%;
  height: 50px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  .title-img {
    width: 124px;
    height: auto;
  }
}
.hot-cont {
  // margin: 12px 0;
  // display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  &-item {
    width: 170px;
    height: 254px;
    background: #ffffff;
    margin-bottom: 10px;
    box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    .cont-item-img {
      width: 170px;
      height: 170px;
      background: #fd8248;
      border-radius: 5px 5px 0px 0px;
    }
    .cont-item-foot {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 0 0 0 12px;
      .foot-title {
        width: 100%;
        line-height: 36px;
        font-size: 14px;
        color: #000;
      }
      .foot-price {
        width: 100%;
        color: #d14624;
        font-size: 18px;
        .price::before {
          content: '¥';
          font-size: 12px;
        }
        // .int::before {
        //   content: '+';
        //   font-size: 15px;
        // }
      }
      .foot-sale {
        margin-top: 9px;
        width: 100%;
        font-size: 11px;
        color: #999;
      }
    }
  }
}
</style>
