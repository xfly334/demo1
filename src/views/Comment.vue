<template>
  <div class="comment">
    <div class="comment-title">宝贝评价({{list.score_people}})</div>
    <div class="box" v-if="list.score_people > 0">
      <div class="comment-item" v-for="(item,index) in list.list" :key="index">
        <div class="comment-item-head">
          <div class="comment-item-head-l">
            <img
              class="comment-item-head-l-img"
              :src="item.head_pic"
              alt
            />
            <div class="comment-item-head-l-name">{{item.name}}</div>
          </div>
          <div class="comment-item-head-r">{{item.add_time}}</div>
        </div>
        <div class="comment-item-cont" v-html="item.content"></div>
        <div class="comment-item-imgs" v-if="item.images.length > 0">
          <div class="comment-item-imgs-box">
            <van-image
              width="100"
              height="100"
              lazy-load
              class="comment-item-imgs-box-img"
              v-for="(img,idx) in item.images"
              :key="idx"
              :src="img"
              alt
              @click="seeImg(item.images,idx)"
            />
          </div>
        </div>
      </div>
    </div>
    <img
      class="no-data"
      v-else
      src="https://shop.0571net.cn/public/static/img/wechat/img_empty_pinglun@2x.png"
      alt
    />
  </div>
</template>

<script>
import { Image, ImagePreview } from 'vant'
export default {
  name: 'comment',
  components: {
    [Image.name]: Image,
    [ImagePreview.name]: ImagePreview
  },
  data () {
    return {
      isClone: false,
      list: null
    }
  },
  methods: {
    seeImg (arr, idx) {
      this.isClone = true
      ImagePreview({
        images: arr,
        startPosition: idx,
        closeOnPopstate: true,
        onClose () {
          this.isClone = false
          // do something
        }
      })
    },
    getList (id) {
      this.$api.home.evaluateList(id).then(res => {
        console.log(res)
        this.list = res.data
      })
    }
  },
  mounted () {
    let id = this.$route.query.id
    console.log(this.$route.query)
    this.getList(id)
  }
}
</script>

<style lang="scss" scoped>
.comment {
  background: #fff;
}
.no-data {
  display: block;
  width: 180px;
  margin: 70px auto 0;
}
.comment-title {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  background: #f4f4f4;
  font-weight: bold;
  font-size: 15px;
}

.comment-item {
  padding: 15px;
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
  &-imgs {
    height: 100px;
    overflow: hidden;
    margin-top: 15px;
    &-box {
      display: flex;
      height: 100px;
      overflow-x: scroll;
      &-img {
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin-right: 10px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
