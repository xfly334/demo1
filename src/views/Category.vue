<template>
  <div class="category">
    <van-search
      placeholder="请输入商品名称搜索"
      v-model="value"
      show-action
      shape="round"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <div class="sidebar-box">
      <div class="box-left">
        <van-sidebar v-model="activeKey" @change="SidebarChange(activeKey)">
          <van-sidebar-item :title="item.name" v-for="(item) in list" :key="item.id" />
        </van-sidebar>
      </div>
      <div class="box-right">
        <div class="warp">
          <div class="box1">
            <ul class="classify">
              <li
                :class="[index == classifyKey ? 'active':'','item']"
                v-for="(item,index) in list[activeKey].son"
                :key="item.id"
                @click="classifyChange(index,item.id)"
              >{{item.name}}</li>
            </ul>
          </div>
        </div>
        <div class="cont">
          <div class="cont-head">
            <div class="cont-head-l"></div>
            <div class="cont-head-r">
              <van-dropdown-menu>
                <!-- <van-dropdown-item v-model="value1" :options="option1" /> -->
                <van-dropdown-item :title="titleItem" ref="item">
                  <ul class="sort">
                    <li class="sort-item" @click="onConfirm('综合排序')">综合</li>
                    <!-- <li class="sort-item" @click="onConfirm('销量排序')">销量</li> -->
                    <li class="sort-item">
                      <van-dropdown-menu active-color="#D14624">
                        <van-dropdown-item
                          @change="itemChange2"
                          title="销量"
                          v-model="value2"
                          :options="option2"
                        />
                      </van-dropdown-menu>
                    </li>
                    <li class="sort-item">
                      <van-dropdown-menu active-color="#D14624">
                        <van-dropdown-item
                          @change="itemChange3"
                          title="价格"
                          v-model="value3"
                          :options="option3"
                        />
                      </van-dropdown-menu>
                    </li>
                  </ul>
                </van-dropdown-item>
              </van-dropdown-menu>
            </div>
          </div>
          <div class="list">
            <div class="list-item" v-for="(item) in goods" :key="item.id">
              <img class="item-img" :src="item.img" @click="toGoods(item.id)" />
              <div class="item-right">
                <div class="item-head" @click="toGoods(item.id)">{{item.name}}</div>
                <div class="item-foot">
                  <div class="item-foot-price" @click="toGoods(item.id)">
                    <span class="price" v-if="item.price !== '0.00'">{{item.price}}</span>
                    <span v-if="item.price !== '0.00'">+</span>
                    <span class="int">{{item.point}}积分</span>
                  </div>
                  <div class="item-foot-sale">
                    <div class="sale-title" @click="toGoods(item.id)">已售{{item.sale_num}}件</div>
                    <img
                      class="add-shop"
                      src="https://shop.0571net.cn/public/static/img/wechat/btn_classify_add@2x.png"
                      @click="addCart(item.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <img
              v-show="goods.length === 0"
              class="no-data"
              src="https://shop.0571net.cn/public/static/img/wechat/img_empty_search@2x.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search, Sidebar, SidebarItem, DropdownMenu, DropdownItem, Toast } from 'vant'
export default {
  name: 'Category',
  components: {
    [Search.name]: Search,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [DropdownMenu.name]: DropdownMenu,
    [Toast.name]: Toast,
    [DropdownItem.name]: DropdownItem
  },
  data () {
    return {
      value: '', // 搜索内容
      activeKey: 0, // 侧导航索引
      classifyKey: 0,
      list: [{ son: [] }],
      classify: [{ name: '芒果' }, { name: '水果' }, { name: '车厘子' }],
      value1: 0,
      goods: [],
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      value2: -1,
      option2: [
        { text: '销量升序', value: 0 },
        { text: '销量降序', value: 1 }
      ],
      value3: -1,
      option3: [
        // { text: '默认排序', value: 0 },
        { text: '价格升序', value: 0 },
        { text: '价格降序', value: 1 }
      ],
      titleItem: '默认排序',
      searchData: {
        keywords: null, // 关键字
        type: null, // 排序1销量 2价格 3评分 其他默认是综合
        type_id: null, // 二级分类id
        first_type_id: null, // 一级分类id
        goods_type: null, // 全额积分时传1
        sort: 'desc' // 排序 asc升序 desc降序
      }
    }
  },

  methods: {
    toGoods(id){
      this.$router.push({name:'Goods',query:{id}})
    },
    itemChange (e) {
      console.log(e)
    },
    itemChange2 (e) {
      console.log(e)
      this.searchData.type = 1
      if (e === 0) {
        this.searchData.sort = 'asc'
      } else {
        this.searchData.sort = 'desc'
      }
      this.search(this.searchData)
      this.titleItem = this.option2[e].text
      this.onConfirm()
    },
    itemChange3 (e) {
      console.log(e)
      this.searchData.type = 2
      if (e === 0) {
        this.searchData.sort = 'asc'
      } else {
        this.searchData.sort = 'desc'
      }
      this.search(this.searchData)
      // if (e !== 0) {
      this.titleItem = this.option3[e].text
      // } else {
      //   this.titleItem = '价格排序'
      // }
      this.onConfirm()
    },
    onConfirm (e) {
      console.log(e)
      if (e === '综合排序') {
        this.searchData.type = null
        this.searchData.sort = 'desc'
        this.search(this.searchData)
      }
      if (e && typeof e === 'string') {
        this.titleItem = e
      }
      this.$refs.item.toggle()
    },
    SidebarChange (index) {
      console.log('侧边导航索引' + index)
      this.classifyKey = 0
      // let data = {
      //   type_id: this.list[index].son[0].id,
      //   sort: 'desc'
      // }
      this.searchData.type_id = this.list[index].son[0].id
      this.search(this.searchData)
    },
    search (data) {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.$api.home.search(data).then(res => {
        console.log(res)
        this.goods = res.data
        Toast.clear()
      })
    },
    classifyChange (index, id) {
      console.log('右边索引' + index)
      this.classifyKey = index
      // let data = {
      //   type_id: id,
      //   sort: 'desc'
      // }
      this.searchData.type_id = id
      this.search(this.searchData)
    },
    onSearch () {
      this.$router.push({ name: 'Search', query: { key: this.value } })
    },
    getList () {
      this.$api.home.category().then(res => {
        console.log(res)
        this.list = res.data
        // console.log(res.data[0].son[0].id)
        // let data = {
        //   type_id: res.data[0].son[0].id,
        //   sort: 'desc'
        // }
        this.searchData.type_id = res.data[0].son[0].id
        return this.$api.home.search(this.searchData)
      }).then(goods => {
        console.log(goods)
        this.goods = goods.data
      })
    },
    addCart (id) {
      let data = {
        id,
        num: 1
      }
      this.$api.home.addCar(data).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.$toast.success(res.msg, 300)
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
::v-deep .van-field__control {
  line-height: 20px;
}
.van-cell {
  line-height: 20px;
}
.no-data {
  display: block;
  margin: 50px auto 0;
  width: 50%;
  height: auto;
}
.van-sidebar-item {
  font-size: $font-size-base;
  color: $color-666;
  height: 45px;
  line-height: 45px;
  padding: 0;
  text-align: center;
  background-color: #f4f4f4;
}
.van-sidebar-item--select {
  border-color: $color-theme;
  color: $color;
  background-color: #fff;
}
.category {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: calc(100% - 50px - constant(safe-area-inset-bottom));
  height: calc(100% - 50px - env(safe-area-inset-bottom));
  .sidebar-box {
    display: flex;
    height: calc(100% - 54px);
    @include thinBorder(top);
    .box-left {
      @include thinBorder(right);
      background-color: #f4f4f4;
    }
  }
}
.box-right {
  flex: 1;
  background: #fff;
  .warp {
    height: 45px;
    overflow: hidden;
    .box1 {
      height: 45px;
      overflow-x: scroll;
      .classify {
        height: 45px;
        display: -webkit-box;
        align-items: center;
        padding: 0 10px;
        .item {
          display: flex;
          margin: 0 10px;
          font-size: 13px;
          color: #838083;
          &.active {
            color: $color-theme;
          }
        }
      }
    }
  }
  .cont {
    height: calc(100% - 45px);
    overflow: hidden;
    @include thinBorder(top);
    .cont-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 10px 0 20px;
      .cont-head-l {
        font-size: 13px;
      }
      .cont-head-r {
        ::v-deep .van-dropdown-menu__title {
          color: $color-999;
          font-size: 12px;
        }
        .van-hairline--top-bottom::after,
        .van-hairline-unset--top-bottom::after {
          border: 0;
        }
        .van-dropdown-item--down {
          width: calc(100% - 85px);
          left: auto;
        }
        .sort {
          @include thinBorder(top);
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 50px;
          font-size: 13px;
          ::v-deep .van-dropdown-menu__title {
            color: #000;
            font-size: 13px;
          }
        }
      }
    }
    .list {
      height: calc(100% - 40px);
      overflow-y: auto;
      .list-item {
        display: flex;
        height: 130px;
        padding-top: 15px;
        .item-img {
          width: 100px;
          height: 100px;
          margin-right: 14px;
        }
        .item-right {
          flex: 1;
          height: 115px;
          padding-right: 8px;
          padding-bottom: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          @include thinBorder(bottom, #eee);
          .item-head {
            color: #000;
            font-size: 16px;
            @include ellipsis();
          }
          .item-foot {
            width: 100%;
            .item-foot-price {
              width: 100%;
              color: #f96946;
              font-size: 16px;
              .price {
                font-weight: bold;
                &::before {
                  content: '¥';
                  font-size: 12px;
                  font-weight: normal;
                }
              }
              .int {
                font-weight: bold;
                // &::before {
                //   content: '+';
                //   font-size: 16px;
                // }
              }
            }
            .item-foot-sale {
              height: 27px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              .sale-title {
                font-size: 12px;
                color: $color-999;
                margin-bottom: 3px;
              }
              .add-shop {
                width: 27px;
                height: 27px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
