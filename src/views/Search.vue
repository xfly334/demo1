<template>
  <div class="search">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      autofocus
    >
      <div slot="action" @click="onSearch" class="search-btn">搜索</div>
    </van-search>
    <!-- <div v-if="isSearch">
      <div class="history">
        <div class="history-title">
          <div class="title">搜索历史</div>
          <div class="history-title-r">
            <van-icon name="delete" size="12" />
          </div>
        </div>
        <div class="history-tag">
          <van-tag text-color="#333" color="#f4f4f4" @click="getSearch('苹果')">苹果</van-tag>
          <van-tag text-color="#333" color="#f4f4f4" @click="getSearch('散养家土鸡')">散养家土鸡</van-tag>
        </div>
      </div>
      <div class="history hot">
        <div class="history-title">
          <div class="title">热门搜索</div>
        </div>
        <div class="history-tag">
          <van-tag text-color="#d14624" color="#f4f4f4" @click="getSearch('苹果')">苹果</van-tag>
          <van-tag text-color="#d14624" color="#f4f4f4" @click="getSearch('散养家土鸡')">散养家土鸡</van-tag>
        </div>
      </div>
    </div> -->
    <div v-if="list.length > 0">
      <router-link
        :to="{name:'Goods',query:{id:1}}"
        class="search-item"
        v-for="item in list"
        :key="item.id"
      >
        <img class="search-item-img" :src="item.img" alt />
        <div class="search-item-r">
          <div class="search-item-r-title">{{item.name}}</div>
          <div class="search-item-r-foot">
            <span class="search-item-r-price">{{item.price}}</span>
            <!-- <span class="search-item-r-jia">+</span> -->
            <span class="search-item-r-jif">+{{item.point}}积分</span>
          </div>
        </div>
      </router-link>
    </div>
    <img v-else class="no-data" src="https://shop.0571net.cn/public/static/img/wechat/img_empty_search@2x.png" alt />
  </div>
</template>

<script>
import { Search, Icon, Tag } from 'vant'
export default {
  name: 'search',
  components: {
    [Search.name]: Search,
    [Icon.name]: Icon,
    [Tag.name]: Tag
  },
  data () {
    return {
      value: '',
      // isSearch: true, // 搜索页
      list: [], // 搜索结果
      keywords: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSearch () {
      // this.$toast('搜索结果：' + this.value)
      this.keywords = this.value
      this.getSearch(this.value)
      // this.isSearch = false
    },
    inSearch () {
      // this.isSearch = true
    },
    getSearch (keywords, sort = 'desc') {
      this.$api.home.search({ keywords, sort }).then(res => {
        console.log(res)
        this.list = res.data
      })
    }
  },
  mounted () {
    let key = this.$route.query.key
    this.value = key
    this.getSearch(key)
  }
}
</script>
<style lang='scss' scoped>
.no-data{
  display: block;
  width: 180px;
  height: 180px;
  margin: 70px auto 0;
}
.van-search__content {
  padding: 0 10px;
}
.van-search__action {
  padding: 0 12px 0 10px;
}
.van-search .van-cell {
  line-height: 20px;
  border-radius: 100px;
  background: #f4f4f4;
  font-size: 13px;
  ::v-deep .van-field__control {
    line-height: 20px;
  }
}
.search-btn {
  font-size: 15px;
  color: #d14624;
}
.title {
  font-weight: bold;
  font-size: 14px;
  color: #000;
}
.van-tag {
  padding: 12px 18px;
  font-size: 13px;
  margin-right: 10px;
  margin-top: 15px;
}
.history {
  padding: 25px 0;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    &-r {
      width: 30px;
      height: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  &-tag {
    padding: 5px 12px;
  }
}
.hot {
  border-top: 10px solid #f4f4f4;
  margin: 0;
}
.search-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  @include thinBorder(bottom);
  &-img {
    width: 90px;
    height: 90px;
    margin-right: 12px;
    border-radius: 5px;
    overflow: hidden;
  }
  &-r {
    flex: 1;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-title {
      font-size: 15px;
      color: #000;
      @include ellipsis();
    }
    &-foot {
      font-size: 15px;
      color: #4c4c4c;
    }
    &-price::before {
      content: '¥';
      font-size: 12px;
    }
  }
}
</style>
