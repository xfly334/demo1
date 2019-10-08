import Vue from 'vue'
import Router from 'vue-router'
// import axios from 'axios'
// import store from '../store/index'
// 正常加载
import Tabbar from '@/components/TabBar/index.vue'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/',
    name: 'tabbar',
    component: Tabbar,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home'),
        meta: { title: '商城' }
      },
      {
        path: '/category',
        name: 'Category',
        component: () => import('../views/Category'),
        meta: { title: '分类' }
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/Cart'),
        meta: { title: '购物车' }
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/user/recharge',
    name: 'Recharge',
    component: () => import('../views/Recharge'),
    meta: { title: '充值' }
  },
  {
    path: '/user/recharge/big',
    name: 'Big',
    component: () => import('../views/Big'),
    meta: { title: '大客户采购' }
  },
  {
    path: '/user/recharge/record',
    name: 'Record',
    component: () => import('../views/RechargeRecord'),
    meta: { title: '充值记录' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search'),
    meta: { title: '搜索' }
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../views/Goods'),
    meta: { title: '商品详情' }
  },
  {
    path: '/comment',
    name: 'Comment',
    component: () => import('../views/Comment'),
    meta: { title: '评价列表' }
  }, {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order'),
    meta: { title: '确认订单' }
  }, {
    path: '/user/address',
    name: 'AddressList',
    component: () => import('../views/AddressList'),
    meta: { title: '地址列表' }
  }, {
    path: '/user/address/add',
    name: 'AddressAdd',
    component: () => import('../views/AddEdit'),
    meta: { title: '新增地址' }
  }, {
    path: '/user/address/edit',
    name: 'AddEdit',
    component: () => import('../views/AddEdit'),
    meta: { title: '编辑地址' }
  }, {
    path: '/integral',
    name: 'Integral',
    component: () => import('../views/Integral'),
    meta: { title: '部分积分商品' }
  }, {
    path: '/integral',
    name: 'AllIntegral',
    component: () => import('../views/Integral'),
    meta: { title: '全额积分商品' }
  }, {
    path: '/appraise',
    name: 'Appraise',
    component: () => import('../views/Appraise'),
    meta: { title: '评价' }
  },
  {
    path: '/user/suggest',
    name: 'Suggest',
    component: () => import('../views/Suggest'),
    meta: { title: '建议反馈' }
  }, {
    path: '/home/diy',
    name: 'Diy',
    component: () => import('../views/Diy'),
    meta: { title: 'diy' }
  },
  {
    path: '/user/order',
    name: 'UserOrder',
    component: () => import('../views/UserOrder'),
    meta: { title: '我的订单' }
  },
  {
    path: '/user/order/info',
    name: 'OrderInfo',
    component: () => import('../views/OrderInfo'),
    meta: { title: '订单详情' }
  },
  {
    path: '/user/order/collect',
    name: 'Collect',
    component: () => import('../views/Collect'),
    meta: { title: '我的收藏' }
  }, {
    path: '/user/about',
    name: 'About',
    component: () => import('../views/About'),
    meta: { title: '关于我们' }
  },
  {
    path: '*', // 404 调到首页
    redirect: '/home'
  }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
