<template>
  <div class="cart">
    <van-cell-group>
      <van-cell :title="`共${list.length}件宝贝`">
        <van-checkbox name="checkboxes" ref="checkboxes" slot="right-icon" v-model="checkeds">
          <span
            class="head-right-text"
            slot="icon"
            slot-scope="props"
          >{{props.checked ? icon.active : icon.inactive}}</span>
        </van-checkbox>
      </van-cell>
    </van-cell-group>
    <div class="card-goods" v-for="(item) in goods" :key="item.id">
      <van-checkbox class="card-goods__item" v-model="item.checked" checked-color="#d14624"></van-checkbox>
      <van-card :title="item.goods_name" :thumb="item.img">
        <div slot="price">
          <span class="van-card-price" v-if="item.price">{{formatPrice(item.price)}}</span>
          <span
            :class="[item.price>0 ? 'price':'','van-card-integral']"
            v-if="item.point"
          >{{item.point | toNumber}}</span>
        </div>
        <div slot="num">
          <van-stepper v-model="item.num" />
        </div>
      </van-card>
    </div>
    <van-submit-bar
      :price="totalPrice*100"
      label=" "
      :button-text="submitBarText"
      :suffix-label="totalIntegral"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checkedAll" checked-color="#d14624" @click="isCheckedAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import {
  Checkbox,
  CheckboxGroup,
  CellGroup,
  Cell,
  Card,
  SubmitBar,
  Stepper
} from 'vant'
export default {
  name: 'Cart',
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Card.name]: Card,
    [SubmitBar.name]: SubmitBar,
    [Stepper.name]: Stepper
  },
  data () {
    return {
      list: ['b'],
      checkeds: true,
      checkedAll: false,
      icon: {
        active: '管理',
        inactive: '完成'
      },
      goods: []
    }
  },
  filters: {

    toNumber (str) {
      return Number(str)
    }
  },
  computed: {
    submitBarText () {
      if (this.checkeds) {
        return '结算'
      } else {
        return '删除'
      }
    },
    // 计算总价
    totalPrice () {
      return this.goods.reduce((total, item) => {
        return total + (item.checked ? (item.price * item.num) : 0)
      }, 0)
    },
    // 计算总积分
    totalIntegral () {
      let _this = this
      let isc = 0
      let totalIntegral = this.goods.reduce((total, item) => {
        if (item.checked) {
          isc++
        }
        _this.checkedAll = isc === this.goods.length
        return total + (item.checked ? (Number(item.point) ? (Number(item.point) * item.num) : 0) : 0)
      }, 0)
      if (totalIntegral === 0) {
        return ''
      } else {
        return ('+' + totalIntegral + '积分')
      }
    }
  },
  methods: {
    formatPrice (price) {
      return price.toFixed(2)
    },
    onSubmit () {
      if (this.checkeds) {
        // this.$toast('点击结算')
        let goods = this.filerGoods('goods_id')
        if (goods.length <= 0) {
          this.$toast('请选择要结算的商品')
          return
        }
        console.log(goods)
        this.$router.push({ name: 'Order', query: { goods: JSON.stringify(goods) } })
      } else {
        // this.$toast('删除商品')
        let goods = this.filerGoods('ids')

        if (goods.length <= 0) {
          this.$toast('请选择要删除的商品')
          return
        }
        if (goods.length > 1) {
          let ids = []
          for (let i of goods) {
            ids.push(i.ids)
          }
          let data = {
            ids: ids.join(',')
          }
          console.log(data)
          this.deleteCar(data)
        } else {
          this.deleteCar(goods[0])
        }
        console.log(goods)
      }
    },
    filerGoods (name) {
      let goods = []
      if (this.checkeds) {
        for (let i of this.goods) {
          if (i.checked) {
            goods.push({ [name]: i.goods_id, num: i.num })
          }
        }
      } else {
        for (let i of this.goods) {
          if (i.checked) {
            goods.push({ [name]: i.id, num: i.num })
          }
        }
      }
      return goods
    },
    isCheckedAll () {
      if (this.checkedAll) {
        for (let i of this.goods) {
          i.checked = false
        }
      } else {
        for (let i of this.goods) {
          i.checked = true
        }
      }
    },
    // 购物车数据
    getCart () {
      this.$api.home.car().then(res => {
        if (res.status === 1) {
          let data = res.data
          for (let i of data) {
            i.checked = false
            i.price = Number(i.price)
          }
          this.goods = data
        }
        if (res.status === 0 && res.msg === '没有数据') {
          this.goods = []
        }
      })
    },
    // 删除购物车数据
    deleteCar (data) {
      this.$api.home.deleteCar(data).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.getCart()
        }
      })
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-image__img{
  object-fit: fill !important;
}
.cart {
  background: #f4f4f4;
  min-height: 100%;
  padding-bottom: calc(100px - constant(safe-area-inset-bottom));
  padding-bottom: calc(100px - env(safe-area-inset-bottom));
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}
.card-goods {
  padding: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  @include thinBorder(bottom);
  &__item {
    position: relative;
    background-color: #fff;
    padding: 0 10px;
    height: 100px;

    ::v-deep .van-checkbox__label {
      flex: 1;
      height: 75px;
      margin-left: 20px;
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }
  }
  .van-card {
    flex: 1;
    background: #fff;
    padding: 0 10px 0 0;
    .van-card__thumb {
      width: 75px;
      height: 75px;
    }
    .van-card__content {
      min-height: auto;
      height: 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .van-card__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    .van-stepper {
      @include thinBorder(
        (top, right, bottom, left),
        #ccc,
        (2px, 2px, 2px, 2px)
      );
      ::v-deep .van-stepper__minus,
      ::v-deep .van-stepper__plus {
        border-radius: 0;
        background: #fff;
        border: 0;
      }
      ::v-deep .van-stepper__input {
        margin: 0;
        background: #fff;
        position: relative;
        // @include thinBorder((right, left), #ccc);
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
      }
    }
    .van-card__title {
      font-size: 14px;
      color: #000;
      @include ellipsis();
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
}
.van-cell-group {
  background-color: #d14624;
  .van-cell {
    line-height: 50px;
    background-color: #d14624;
    color: #fff;
    font-size: 14px;
    padding: 10px;
  }
}
.head-right-text {
  font-size: 15px;
}
.van-submit-bar {
  bottom: calc(50px + constant(safe-area-inset-bottom));
  bottom: calc(50px + env(safe-area-inset-bottom));
  .van-submit-bar__price {
    color: #d14624;
  }
  .van-submit-bar__suffix-label {
    font-size: 18px;
    color: #d14624;
    margin: 0;
  }
}
.van-submit-bar__bar {
  padding-left: 10px;
}
</style>
