<!--  created by dongxc on 2018// -->
<template>
  <div class="recommend">
    <div class="recommend-content">
      <div>
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
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img :src="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <!-- vhtml会对html字符做转义 -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import Slider from 'base/slider/slider'
import {getRecommend,getDiscList} from 'api/recommend'
export default {
  data () {
    return {
      recommends: [],
      discList: []
    };
  },
  // created还没有执行完毕时  有可能子组件的mounted已经执行完 且没获取到数据
  created() {
    //调接口
    this._getRecommend()
    this._getDiscList()
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
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if(res.code == 0) {
          this.discList = res.data.list
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
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
</style>