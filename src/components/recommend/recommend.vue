<!--  created by dongxc on 2018// -->
<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper"></div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单搜索</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import {getRecommend} from 'api/recommend'
export default {
  // data () {
  //   return {
  //   };
  // },
  created() {
    this._getRecommend()
  },
  // components: {},

  // computed: {},

  // mounted: {},

  methods: {
    _getRecommend() {
      alert(1)
      getRecommend().then((res) => {
        if(res.code == 0) {
          
          console.log(res.data.slider)
        }
      })
    }
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
</style>