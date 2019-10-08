<template>
  <div class="diy">
    <div v-html="info.content" v-wechat-title="info.title"></div>
  </div>
</template>

<script>

export default {
  name: 'diy',
  components: {},
  data () {
    return {
      html: '',
      info: {}
    }
  },
  computed: {},
  watch: {},
  methods: {
    onLoad (id) {
      this.$api.home.indexList().then(res => {
        let data = res.data
        for (let i of data.banner) {

          if (Number(i.id) === Number(id)) {
            this.info = i
            console.log(id)
            console.log(this.info)
          }
        }
      })
    }
  },
  mounted () {
    let id = this.$route.query.id
    this.onLoad(id)
  }
}
</script>
<style lang='scss' scoped>
.diy {
  font-size: 14px;
  color: #333;
}
</style>
