<template>
  <div class="goods">
    <van-swipe
      class="goods-swipe"
      :autoplay="3000"
      indicator-color="#D14624"
      v-if="goods.images !== undefined && goods.images.length > 0"
    >
      <van-swipe-item v-for="thumb in goods.images" :key="thumb">
        <img :src="thumb" />
      </van-swipe-item>
    </van-swipe>
    <van-swipe class="goods-swipe" :autoplay="3000" indicator-color="#D14624" v-else>
      <van-swipe-item>
        <img :src="goods.img" />
      </van-swipe-item>
    </van-swipe>
    <div class="goods-box">
      <div class="goods-title">
        <div class="goods-title-left">{{ goods.name }}</div>
        <div class="goods-title-right">
          <img
            class="goods-title-right-collect"
            v-if="goods.is_collect === 1"
            src="https://shop.0571net.cn/public/static/img/wechat/icon_collect_on@2x.png"
            alt="已收藏"
            @click="isCollect(2)"
          />
          <img
            class="goods-title-right-collect"
            v-else
            @click="isCollect(1)"
            src="https://shop.0571net.cn/public/static/img/wechat/icon_collect_normal@2x.png"
            alt="未收藏"
          />
        </div>
      </div>
      <div class="goods-group">
        <div class="goods-prices">
          <span class="goods-prices-price" v-if="goods.price !== '0.00'">{{ goods.price }}</span>
          <span class="goods-prices-integral" v-if="goods.price !== '0.00'">+</span>
          <span class="goods-prices-integral">{{goods.point}}积分</span>
        </div>
        <div class="goods-express">已售{{goods.sale_num}}份</div>
      </div>
    </div>
    <div class="line">
      <van-cell
        :title="'宝贝评价('+evaList.score_people+')'"
        is-link
        value="查看全部"
        :to="{name:'Comment',query:{id:goods.id}}"
      />
      <div class="box" v-if="evaList.score_people > 0">
        <div class="comment-item">
          <div class="comment-item-head">
            <div class="comment-item-head-l">
              <img class="comment-item-head-l-img" :src="evaList.list[0].head_pic" />
              <div class="comment-item-head-l-name">{{evaList.list[0].name}}</div>
            </div>
            <div class="comment-item-head-r">{{evaList.list[0].add_time}}</div>
          </div>
          <div class="comment-item-cont">{{evaList.list[0].content}}</div>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="title">商品详情</div>
      <div class="goods-info" v-html="goods.content"></div>
    </div>
    <van-goods-action safe-area-inset-bottom>
      <van-goods-action-icon icon="cart-o" :to="{name:'Cart'}">购物车</van-goods-action-icon>
      <van-goods-action-button type="warning" @click="show = true">加入购物车</van-goods-action-button>
      <van-goods-action-button type="danger" @click="show = true">立即购买</van-goods-action-button>
    </van-goods-action>
    <van-sku
      v-model="show"
      :sku="sku"
      :goods="goods"
      :goods-id="goods.id"
      hide-selected-text
      close-on-click-overlay
      safe-area-inset-bottom
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    >
      <div slot="sku-header" style="display:flex;align-items:center;padding:20px;">
        <img :src="goods.img" alt style="width:75px;height:75px;margin-right:20px;" />
        <div>
          <div style="color:#ee0a24;font-size:22px;">{{sku.price}}</div>
          <div style="font-size:12px;color:#969799;margin-top:20px;">库存:{{sku.stock_num}}</div>
        </div>
      </div>
    </van-sku>
  </div>
</template>

<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku
} from 'vant'
export default {
  name: 'Goods',
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [Sku.name]: Sku
  },
  data () {
    return {
      goods: {},
      evaList: {list:[]},
      show: false,
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        price: '1.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        none_sku: true // 无规格
      }
    }
  },
  mounted () {
    let id = Number(this.$route.query.id)
    this.getInfo(id)
    this.evaluateList(id)
  },
  methods: {
    // 获取商品详情
    getInfo (id) {
      this.$api.home.goodsDetail({ id: id }).then(res => {
        let data = res.data
        if (res.status !== 1) {
          this.$toast(res.msg)
        }
        this.goods = data
        this.goods.picture = data.img
        this.sku.price = `${data.price !== '0.00' ? '¥' + data.price + '+' : ''}${data.point}积分`
        this.sku.stock_num = Number(data.now_num)
      })
    },
    // 立即购买
    onBuyClicked (obj) {
      console.log(obj)
      let goods = [{
        goods_id: obj.goodsId,
        num: obj.selectedNum
      }]
      this.$router.push({ name: 'Order', query: { goods: JSON.stringify(goods) } })
    },
    // 加入购物车
    onAddCartClicked (obj) {
      let data = {
        id: obj.goodsId,
        num: obj.selectedNum
      }
      this.$api.home.addCar(data).then(res => {
        if (res.status === 1) {
          this.$toast(res.msg)
          this.show = false
        }
      })
    },
    // 收藏
    isCollect (type) {
      let data = {
        id: this.goods.id,
        type: type
      }
      this.$api.home.collect(data).then(res => {
        if (res.status === 1) {
          this.goods.is_collect = type === 1 ? type : 0
        }
        this.$toast(res.msg)
      })
    },
    // 商品评价列表
    evaluateList (id) {
      this.$api.home.evaluateList(id).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.evaList = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
  border-top: 10px solid #eee;
}
.van-cell {
  padding: 15px 10px;
  &__title {
    font-size: 15px;
    color: #000;
    font-weight: bold;
  }
  &__value {
    font-size: 14px;
    color: #000;
  }
  &__right-icon {
    color: #000;
    font-size: 14px;
  }
}
.goods-box,
.box {
  padding: 15px 10px;
}
.van-goods-action {
  border-top: 1px solid #ccc;
}
.goods {
  padding-bottom: 60px;
  &-swipe {
    img {
      width: 100%;
      height: 375px;
      display: block;
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &-left {
      flex: 1;
      font-size: 16px;
      font-weight: bold;
      line-height: 24px;
      @include ellipsis();
    }
    &-right {
      width: 18px;
      height: 18px;
      margin-left: 10px;
      &-collect {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
  &-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .goods-express {
      color: #999;
      font-size: 12px;
    }
  }
  &-prices {
    color: #d14624;
    font-weight: bold;
    margin-top: 14px;
    &-price,
    &-integral {
      font-size: 18px;
      vertical-align: middle;
    }
    &-price::before {
      content: '¥';
      font-size: 12px;
    }
    // &-integral::before {
    //   content: '+';
    //   font-size: 15px;
    //   height: 18px;
    //   vertical-align: middle;
    // }
    // &-integral::after {
    //   content: '积分';
    //   font-size: 18px;
    //   height: 18px;
    //   vertical-align: middle;
    // }
  }
  &-cell-group {
    margin: 15px 0;
    .van-cell__value {
      color: #999;
    }
  }
  &-tag {
    margin-left: 5px;
  }
}
.title {
  font-size: 15px;
  color: #000;
  font-weight: bold;
  padding: 0 10px;
  height: 47px;
  line-height: 47px;
  @include thinBorder(bottom, #e5e5e5);
}
.goods-info {
  padding-top: 11px;
}
.comment-item {
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-l {
      display: flex;
      align-items: center;
      &-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 6px;
      }
      &-name {
        font-size: 14px;
        color: #333;
      }
    }
    &-r {
      font-size: 12px;
      color: #999;
    }
  }
  &-cont {
    font-size: 12px;
    color: #666;
    line-height: 18px;
    margin-top: 14px;
  }
}
.van-goods-action-icon {
  width: 80px;
}
.van-goods-action-button {
  height: 50px;
  border-radius: 0;
  margin: 0;
}
</style>
