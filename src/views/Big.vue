<template>
  <div class="big">
    <div v-html="big"></div>
  </div>
</template>

<script>
export default {
  name: 'big',
  components: {},
  data () {
    return {
      big: ''
    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  mounted () {
    this.$api.user.recharge().then(res => {
      console.log(res)
      if (res.status === 1) {
        this.big = res.data.big
      }
    })
  }
}
</script>
<style lang='scss' scoped>
.big {
  font-size: 14px;
  color: #333;
  padding:20px 25px;
  line-height: 1.5;
}
</style>
