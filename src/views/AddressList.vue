<template>
  <div class="address-list" v-cloak>
    <div class="bg"></div>
    <div>
      <van-radio-group v-model="radio" @change="radioChange" v-if="list.length > 0">
        <div class="address-list-item" v-for="item in list" :key="item.id">
          <div class="address-list-item-title" @click="selectAdd(item.id)">
            <span class="address-list-item-title-name">{{item.consignee}}</span>
            <span class="address-list-item-title-tel">{{item.mobile}}</span>
          </div>
          <div class="address-list-item-desc" @click="selectAdd(item.id)">
            <p
              class="address-list-item-desc-info"
            >{{item.province}} {{item.city}} {{item.district}} {{item.address}}</p>
          </div>
          <div class="address-list-item-foot">
            <van-radio :name="item.id">
              <span
                :class="[item.is_default === 1 ?'active':'','radio-span']"
              >{{item.is_default === 1 ? '已设为默认':'设为默认'}}</span>
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ||item.is_default  ? icon.active : icon.inactive"
              />
            </van-radio>
            <div class="address-list-item-foot-r">
              <router-link
                :to="{name:'AddEdit',query:{id:item.id}}"
                class="address-list-item-foot-r-btn"
              >
                <img
                  class="address-list-item-foot-r-btn-icon"
                  src="https://shop.0571net.cn/public/static/img/wechat/icon_eidt@2x.png"
                  alt
                />
                <span class="address-list-item-foot-r-btn-text">编辑</span>
              </router-link>
              <div class="address-list-item-foot-r-btn">
                <img
                  class="address-list-item-foot-r-btn-icon"
                  src="https://shop.0571net.cn/public/static/img/wechat/icon_cancel@2x.png"
                  alt
                />
                <span
                  class="address-list-item-foot-r-btn-text"
                  @click="removeAdd(item.id,item.is_default)"
                >删除</span>
              </div>
            </div>
          </div>
        </div>
      </van-radio-group>
      <img
        v-else
        class="no-list-img"
        src="https://shop.0571net.cn/public/static/img/wechat/img_empty_address@2x.png"
        alt
      />
      <router-link :to="{name:'AddressAdd'}" class="footer-btn">
        <div class="footer-btn-box">
          <img
            class="footer-btn-box-icon"
            src="https://shop.0571net.cn/public/static/img/wechat/icon_add@2x.png"
            alt
          />
          <span class="footer-btn-box-text">添加新地址</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Dialog } from 'vant'
export default {
  name: 'AddressList',
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      radio: 0,
      chosenAddressId: '1',
      isOrder: false,
      icon: {
        active: 'https://shop.0571net.cn/public/static/img/wechat/icon_checked@2x.png',
        inactive: 'https://shop.0571net.cn/public/static/img/wechat/icon_unCheckecd@2x.png'
      },
      list: []
    }
  },
  beforeRouteEnter (to, from, next) {
    // 这里还无法访问到组件实例，this === undefined
    console.log(to)
    console.log(from)
    let path = from.name
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (path === 'Order') {
        vm.isOrder = true
      }
    })
  },
  methods: {
    // 修改默认地址
    radioChange (name) {
      this.$api.user.setDefaultAddress({ id: name }).then(res => {
        console.log(res)

        if (this.isOrder) {
          this.$toast.success(res.msg, 500)
          setTimeout(() => {
            this.selectAdd(name)
          }, 500)
        } else {
          this.$toast.success(res.msg)
        }
        this.getList()
      })
    },
    getList () {
      this.$api.user.address().then(res => {
        console.log(res)
        this.list = res.data
      })
    },
    removeAdd (id, isDefault) {
      Dialog.confirm({
        message: '是否删除该地址！'
      }).then(() => {
        this.$api.user.deleteAddress({ id }).then(res => {
          console.log(res)
          if (res.status === 1) {
            if (isDefault) {
              this.$store.commit('setAdd', {})
            }
            this.getList()
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    selectAdd (id) {
      if (!this.isOrder) {
        return
      }
      this.$api.user.addressDetail({ id }).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.$store.commit('setAdd', res.data)
          this.$router.go(-1)
        }
      })
    }
  },
  mounted () {
    this.getList()
    console.log(this.$route.query)
  }
}
</script>

<style lang="scss" scoped>
.address-list {
  background: #f4f4f4;
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}
.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - constant(safe-area-inset-bottom));
  height: calc(100% - env(safe-area-inset-bottom));
  background: #f4f4f4;
  z-index: -1;
}

.no-list-img {
  display: block;
  width: 180px;
  height: auto;
  margin: 70px auto 0;
}
.address-list-item {
  background: #fff;
  margin-top: 10px;
  padding: 15px 0 0;
  &-title {
    color: #4c4c4c;
    font-size: 15px;
    padding: 0 15px;
    &-tel {
      margin-left: 20px;
    }
  }
  &-desc {
    color: #858585;
    font-size: 14px;
    padding: 10px 15px 20px;
  }
  &-foot {
    display: flex;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    @include thinBorder(top);
    &-r {
      display: flex;
      align-items: center;
      &-btn {
        display: flex;
        align-items: center;
        &:last-child {
          margin-left: 15px;
        }
        &-icon {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        &-text {
          color: #4c4c4c;
          font-size: 12px;
        }
      }
    }
    .van-radio {
      font-size: 12px;
      color: #d14624;
      .radio-span {
        color: #4c4c4c;
        &.active {
          color: #d14624;
        }
      }
      ::v-deep &__icon {
        width: 16px;
        height: 16px;
        line-height: 0;
      }
    }
  }
}
.footer-btn {
  display: block;
  position: fixed;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;
  height: 50px;
  background: linear-gradient(-90deg, #cb2620, #d14624);
  &-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    &-icon {
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
    &-text {
      font-size: 15px;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
