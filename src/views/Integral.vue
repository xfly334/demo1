<template>
  <div class="integral">
    <van-tabs
      v-model="active"
      sticky
      background="#F4F4F4"
      title-active-color="#D14624"
      color="#D14624"
      line-height="2px"
      title-inactive-color="#000"
      @click="onClick"
    >
      <van-tab :title="title" v-for="(title,index) in navList" :key="index">
        <van-grid :column-num="2" :border="false" v-if="active === index">
          <van-grid-item
            v-for="item in goods"
            :key="item.id"
            :to="{name:'Goods',query:{id:item.id}}"
          >
            <div class="item">
              <img class="item-img" :src="item.img" alt />
              <div class="item-title">{{item.name}}</div>
              <div class="item-body">
                <span class="item-body-price" v-if="item.price !== '0.00'">{{item.price}}</span>
                <span class="item-body-add" v-if="item.price !== '0.00'">+</span>
                <span class="item-body-num">{{item.point}}积分</span>
              </div>
              <div class="item-sell">已售{{item.sale_num}}件</div>
            </div>
          </van-grid-item>
          <img
            class="no-data"
            v-if="goods.length === 0"
            src="https://shop.0571net.cn/public/static/img/wechat/img_empty_search@2x.png"
            alt
          />
        </van-grid>
      </van-tab>
      <!-- <van-tab title="销量">销量</van-tab> -->
      <!-- <van-tab title="价格">价格</van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, Grid, GridItem } from 'vant'
export default {
  name: 'integral',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  data () {
    return {
      active: 0,
      navList: ['综合', '销量', '价格'],
      goods: [],
      goodsType: null,
      type: 0
    }
  },
  computed: {},
  watch: {},
  methods: {
    getGoods (goodsType = null, type = 0, sort = 'desc') {
      if (type === 2) {
        sort = 'asc'
      }
      let data = {
        goods_type: goodsType || this.goodsType,
        sort,
        type
      }
      this.$api.home.search(data).then(res => {
        console.log(res)
        this.goods = res.data
      })
    },
    onClick (name, title) {
      this.getGoods(this.goodsType, name)
    }
  },
  mounted () {
    console.log(this.$route.query)
    let goodsType = this.$route.query.goods_type || ''
    this.goodsType = goodsType
    this.getGoods(goodsType)
  }
}
</script>
<style lang='scss' scoped>
.no-data {
  display: block;
  width: 180px;
  height: 180px;
  margin: 70px auto 0;
}
::v-deep .van-tab--active {
  font-weight: bold;
}
// ::v-deep .van-tabs__content {
//   margin-top: 15px;
// }
// ::v-deep .van-grid-item__content {
// width: 170px;
// padding: 0;
// }
.item {
  max-width: 170px;
  padding: 0 0 12px;
  background: #ffffff;
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  overflow: hidden;
  .item-img {
    width: 170px;
    height: 170px;
    background: #ddd;
  }
  .item-title {
    padding: 0 10px;
    font-size: 14px;
    color: #000;
    margin-top: 12px;
  }
  .item-body {
    color: #d14624;
    font-size: 18px;
    padding: 0 10px;
    margin-top: 10px;
    &-price::before {
      content: '¥';
      font-size: 12px;
    }
    &-add {
      font-size: 15px;
    }
  }
  .item-sell {
    margin-top: 10px;
    padding: 0 10px;
    color: #999;
    font-size: 11px;
  }
}
</style>
