<!--  created by dongxc on 2018/8/24 -->
<template>
<!-- 歌手详情页面 -->
    <!-- 过度动画 -->
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>

<script type='text/ecmascript-6'>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
export default {
  data () {
    return {
    };
  },

  components: {},

  computed: {
      // 通过vuex获得歌手数据singer
      ...mapGetters([
          'singer'
      ])
  },

  mounted() {},

  created() {
      this._getDetail()
      console.log(this.singer)
  },

  methods: {
      _getDetail() {
          // 如果刷新页面没有传入singerid 则跳转得到上一页
          if(!this.singer.id) {
              this.$router.push('/singer')
              return
          }
          getSingerDetail(this.singer.id).then((res) => {
              if(res.code === 0){
                  console.log(res.data.list)
              }
          })
      }
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.singer-detail
    position fixed
    z-index 100
    top 0
    bottom 0    
    left 0
    right 0
    background $color-background
.slide-enter-active,.slide-leave-ative
    transition all 0.3s
.slide-enter,.slide-leave-to
    // 元素从左向右偏移100%的初始位置
    transform translate3d(100%,0,0)
</style>