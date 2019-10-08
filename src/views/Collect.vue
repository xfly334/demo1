<template>
  <div class="collect">
    <router-link
      class="item"
      :to="{name:'Goods',query:{id:item.id}}"
      v-for="item in list"
      :key="item.id"
    >
      <img class="item-img" :src="item.img" />
      <div class="item-r">
        <div class="item-r-h">{{item.name}}</div>
        <div class="item-r-f">
          <span class="price" v-if="item.price">{{item.price}}</span>
          <span class="score" v-if="item.price && item.point">+</span>
          <span class="score" v-if="item.point">{{item.point}}积分</span>
        </div>
      </div>
    </router-link>
    <img v-if="list.length === 0" class="no-data" src="https://shop.0571net.cn/public/static/img/wechat/img_empty_collect.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'collect',
  components: {},
  data () {
    return {
      list: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    getList () {
      this.$api.home.myCollect().then(res => {
        if (res.status === 1) {
          this.list = res.data
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang='scss' scoped>
.price::before {
  content: '¥';
  font-size: 12px;
}
.no-data{
  display: block;
  width: 180px;
  height: auto;
  margin: 70px auto 0;
}
.item {
  display: flex;
  align-items: center;
  padding: 15px 20px 15px 10px;
  @include thinBorder(bottom);
  &-img {
    width: 90px;
    height: 90px;
    margin-right: 12px;
  }
  &-r {
    flex: 1;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-h {
      font-size: 15px;
      color: #000;
    }
    &-f {
      color: #4c4c4c;
      font-size: 15px;
    }
  }
}
</style>
