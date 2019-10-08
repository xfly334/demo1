<template>
  <div>
    <router-view />
    <van-tabbar
      route
      v-model="active"
      class="active_tab"
      active-color="#D14624"
      inactive-color="#A5A5A5"
      :z-index="9999"
      safe-area-inset-bottom
    >
      <van-tabbar-item
        v-for="(item,index) in tabbars"
        :key="index"
        @click="tab(index,item.name)"
        :to="(item.url)"
        replace
      >
        <span :class="currIndex == index ? active:''">{{ item.title }}</span>
        <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant'

Vue.use(Tabbar).use(TabbarItem)
export default {
  name: 'Tabbar',
  data () {
    return {
      currIndex: 0,
      active: 0,
      tabbars: [
        {
          name: 'home',
          title: '首页',
          url: '/home',
          normal: require('../../assets/img/icon_home@2x.png'),
          active: require('../../assets/img/icon_home_on@2x.png')
        },
        {
          name: 'category',
          title: '分类',
          url: '/category',
          normal: require('../../assets/img/home_classfiy@2x.png'),
          active: require('../../assets/img/icon_classfiy_on@2x.png')
        },
        {
          name: 'cart',
          title: '购物车',
          url: '/cart',
          normal: require('../../assets/img/icon_cart@2x.png'),
          active: require('../../assets/img/icon_cart_on@2x.png')
        },
        {
          name: 'user',
          title: '我的',
          url: '/user',
          normal: require('../../assets/img/icon_wode@2x.png'),
          active: require('../../assets/img/icon_wode_on@2x.png')
        }
      ]
    }
  },
  methods: {
    tab (index, val) {
      this.currIndex = index
      // this.$router.push(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.active_tab img {
  width: 22px;
  height: 22px;
}
</style>
