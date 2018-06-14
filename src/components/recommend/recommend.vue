<!--  created by dongxc on 2018// -->
<template>
  <div class="recommend">
    <div class="recommend-content">
      <!-- 当recommends已经取到 再渲染dom -->
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="item in recommends">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>

      <div class="recommend-list">
        <h1 class="list-title">热门歌单搜索</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import Slider from 'base/slider/slider'
import {getRecommend} from 'api/recommend'
export default {
  data () {
    return {
      recommends: []
    };
  },
  // created还没有执行完毕时  有可能子组件的mounted已经执行完 且没获取到数据
  created() {
    this._getRecommend()
  },
  // components: {},

  // computed: {},

  // mounted: {},

  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if(res.code == 0) {
          this.recommends = res.data.slider
        }
      })
    }
  },
  components: {
    Slider
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