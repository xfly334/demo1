<template>
  <div class="suggest">
    <div class="suggest-head">
      <van-field v-model="title" label="标题" placeholder="反馈标题" />
    </div>
    <div class="cont">
      <textarea v-model="content" name id="textarea" placeholder="反馈内容"></textarea>
      <van-uploader v-model="fileList" multiple :max-count="9" :after-read="afterRead" />
    </div>
    <div class="submit" safe-area-inset-bottom @click="submit">确认</div>
  </div>
</template>

<script>
import { Uploader, Field } from 'vant'
export default {
  name: 'suggest',
  components: {
    [Uploader.name]: Uploader,
    [Field.name]: Field
  },
  data () {
    return {
      title: '',
      content: '',
      fileList: [],
      images: []
    }
  },
  methods: {
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file)
      this.fileList.forEach((item, index) => {
        let formData = new window.FormData()
        formData.append('images', item.file)
        this.$axios.post('/index/uploadify/imageUp', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.images.push(res.data.data)
          }
        })
        console.log(this.images)
      })
    },
    submit () {
      if (this.title === '') {
        this.$toast.fail('请填写标题', 1000)
        return
      }
      if (this.content === '') {
        this.$toast.fail('请填写内容', 1000)
        return
      }

      let data = {
        title: this.title,
        content: this.content,
        images: this.images.join(',')
      }
      console.log(data)
      this.$api.user.feedback(data).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.$toast.success(res.msg, 500)
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest-head {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.van-cell {
  background: #f4f4f4;
}
::v-deep .van-field__control {
  line-height: 24px;
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
