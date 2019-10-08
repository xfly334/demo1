<template>
  <div class="about">
    <div v-html="value"></div>
  </div>
</template>

<script>
export default {
  name: 'About',
  components: {},
  data () {
    return {
      value: ''
    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  mounted () {
    this.$api.user.about().then(res => {
      console.log(res)
      this.value = res.data.value
    })
  }
}
</script>
<style lang='scss' scoped>
.about{
  padding: 20px 25px;
  font-size: 14px;
}
</style>
