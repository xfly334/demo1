<template>
  <div class="appraise">
    <div v-for="(item) in goods" :key="item.id">
      <div class="appraise-head" style="align-items:flex-end">
        <div class="appraise-head-title">商品名称：{{item.goods_name}}</div>
      </div>
      <div class="appraise-head">
        <div class="appraise-head-title">商品评价</div>
        <van-rate
          v-model="item.score"
          icon="https://shop.0571net.cn/public/static/img/wechat/img_star_on@2x.png"
          void-icon="https://shop.0571net.cn/public/static/img/wechat/img_star_normal@2x.png"
        />
      </div>
      <div class="cont">
        <textarea name v-model="item.content" id="textarea" placeholder="宝贝满足您的期待吗？说说它的优点和美中不足吧"></textarea>
        <van-uploader v-model="item.images" multiple :max-count="9" :after-read="afterRead" />
      </div>
    </div>

    <div class="submit" safe-area-inset-bottom @click="submit">确认发布</div>
  </div>
</template>

<script>
import { Rate, Uploader } from 'vant'
export default {
  name: 'Appraise',
  components: {
    [Rate.name]: Rate,
    [Uploader.name]: Uploader
  },
  data () {
    return {
      fileList: [],
      goods: [],
      datas: []
    }
  },
  methods: {
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file)
      console.log(this.goods)
      setTimeout(() => {
        this.goods.forEach((item, index) => {
          let imgs = []
          item.images.forEach((item, index) => {
            let formData = new window.FormData()
            formData.append('images', item.file)
            this.$axios.post('/index/uploadify/imageUp', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(res => {
              console.log(res)
              if (res.data.status === 1) {
                imgs.push(res.data.data)
              }
            })
          })
          console.log(imgs)
          let data = {
            order_id: item.order_id,
            goods_id: item.goods_id,
            images: imgs,
            content: item.content,
            score: item.score
          }
          this.datas.push(data)
          console.log(this.datas)
        })
      })
    },
    getOrder (id) {
      this.$api.user.orderInfo({ id }).then(res => {
        console.log(res)
        for (let i of res.data.goods) {
          this.goods.push({ order_id: res.data.id, goods_name: i.goods_name, goods_id: i.goods_id, score: 5, content: '', images: [] })
        }
      })
    },
    submit () {
      console.log(this.datas)
      for (let i of this.datas) {
        console.log(i.images)
        if (i.content === '') {
          this.$toast.fail('请填写内容', 1000)
          return
        }
        if (i.images instanceof Array) {
          i.images = i.images.join(',')
        }
        this.$api.home.evaluate(i).then(res => {
          console.log(res)
          if (res.status === 1) {
            this.$toast.success(res.msg, 1000)
          }
        })
      }
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
      // this.goods.forEach((item, index) => {
      //   let imgs = []
      //   item.images.forEach((item, index) => {
      //     let formData = new window.FormData();
      //     formData.append("images", item.file);
      //     this.$axios.post('/api/index/uploadify/imageUp', formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data"
      //       }
      //     }).then(res => {
      //       console.log(res)
      //       if (res.data.status === 1) {
      //         imgs.push(res.data.data)
      //       }
      //     })
      //   })
      //   console.log(imgs)
      //   let data = {
      //     order_id: item.order_id,
      //     goods_id: item.goods_id,
      //     images: imgs,
      //     content: item.content,
      //     score: item.score
      //   }
      //   this.datas.push(data)
      //   console.log(this.datas)
      //   for (let i of this.datas) {
      //     i.images = i.images.join(',')
      //     console.log(i)
      //     this.$api.home.evaluate(i).then(res => {
      //       console.log(res)
      //       if (res.status === 1) {
      //         this.$toast.success(res.msg, 1000)
      //       }
      //     })
      //   }
      // })
      // console.log(this.datas)

      // console.log(this.datas)
      // for (let i of this.goods) {
      //   let img = []
      //   for (let j of i.images) {
      //     let formData = new window.FormData();
      //     formData.append("images", j.file);
      //     this.$axios.post('/api/index/uploadify/imageUp', formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data"
      //       }
      //     }).then(res => {
      //       console.log(res)
      //       if (res.data.status === 1) {
      //         img.push(res.data.data)
      //       }
      //     })
      //   }
      //   i.images = img.join(',')
      //   let data = {
      //     order_id: i.order_id,
      //     goods_id: i.goods_id,
      //     images: i.images,
      //     content: i.content,
      //     score: i.score
      //   }
      //   this.datas.push(data)
      // }

      // this.$api.home.evaluate(data).then(res => {
      //   console.log(res)
      //   if (res.status === 1) {
      //     this.$toast.success(res.msg, 1000)
      //   }
      // })
    }
  },
  mounted () {
    let orderId = this.$route.query.order_id
    this.orderId = orderId
    this.getOrder(orderId)
  }
}
</script>

<style lang="scss" scoped>
.appraise-head {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  &-title {
    color: #666;
    font-size: 15px;
    margin-right: 12px;
  }
}
.cont {
  padding: 0 10px;
  #textarea {
    width: 355px;
    height: 154px;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 13px;
    font-size: 14px;
    color: #333;
    margin-bottom: 20px;
  }
}
.submit {
  position: fixed;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: linear-gradient(-90deg, #cb2620, #d14624);
  text-align: center;
  font-size: 15px;
  color: #fff;
}
</style>
