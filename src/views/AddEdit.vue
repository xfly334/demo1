<template>
  <div class="AddEdit">
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-set-default
      @save="onSave"
    />
  </div>
</template>

<script>
import { AddressEdit } from 'vant'
import areaList from '../common/area'
export default {
  name: 'AddEdit',
  components: {
    [AddressEdit.name]: AddressEdit
  },
  data () {
    return {
      areaList,
      id: null,
      searchResult: [],
      addressInfo: {}
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSave (item) {
      this.$toast('save')
      console.log(item)
      let data = {
        consignee: item.name,
        mobile: item.tel,
        province: item.province,
        city: item.city,
        district: item.county,
        address: item.addressDetail,
        code: item.areaCode,
        id: item.id,
        is_default: item.isDefault ? 1 : 0
      }
      this.$api.user.addEditAddress(data).then(res => {
        console.log(res)
        this.$toast.success(res.msg, 800)
        if (res.status === 1) {
          setTimeout(() => {
            this.$router.go(-1)
          }, 800)
        }
      })
    },
    getInfo (id) {
      this.$api.user.addressDetail({ id }).then(res => {
        console.log(res)
        if (res.status === 1) {
          this.addressInfo = {
            id: res.data.id,
            name: res.data.consignee,
            tel: res.data.mobile,
            province: res.data.province,
            city: res.data.city,
            county: res.data.district,
            addressDetail: res.data.address,
            areaCode: String(res.data.code),
            isDefault: !!res.data.is_default
          }
        }
      })
    }
  },
  mounted () {
    let id = this.$route.query.id ? this.$route.query.id : false
    this.id = id
    id && this.getInfo(id)
  }
}
</script>
<style lang='scss'>
.van-switch--on {
  background: linear-gradient(-90deg, #cb2620, #d14624);
}
.van-button--danger {
  background: linear-gradient(-90deg, #cb2620, #d14624);
  border: 0;
}
.van-address-edit__buttons {
  padding: 0;
  position: fixed;
  width: 100%;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  & .van-button {
    margin: 0;
    border-radius: 0;
  }
}
</style>
