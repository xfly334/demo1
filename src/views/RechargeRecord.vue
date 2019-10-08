<template>
  <div class="RechargeRecord">
    <div v-if="list.length > 0">
      <div class="record-item" v-for="item in list" :key="item.id">
        <div class="record-item-l">
          <div class="record-item-l-title">充值金额{{item.money}}元</div>
          <div class="record-item-l-desc">{{item.add_time | formatTime('Y.M.D h:m:s')}}</div>
        </div>
        <div class="record-item-r">
          <span class="record-item-r-title">到账积分</span>
          <span class="record-item-r-num">{{item.point}}</span>
        </div>
      </div>
    </div>
    <img
      class="no-data"
      v-else
      src="https://shop.0571net.cn/public/static/img/wechat/img_empty_czjl@2x.png"
      alt
    />
  </div>
</template>

<script>
export default {
  name: 'RechargeRecord',
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
      this.$api.user.rechargeList().then(res => {
        console.log(res)
        this.list = res.data
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang='scss' scoped>
.no-data {
  display: block;
  width: 180px;
  height: auto;
  margin: 72px auto 0;
}
.record-item {
  padding: 0 10px;
  height: 70px;
  @include thinBorder(bottom);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-l {
    &-title {
      color: #000;
      font-size: 16px;
    }
    &-desc {
      font-size: 13px;
      color: #ccc;
      margin-top: 10px;
    }
  }
  &-r {
    font-size: 16px;
    color: #000;
    &-num {
      color: #d14624;
    }
  }
}
</style>
