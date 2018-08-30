<!--  created by dongxc on 2018/8/24 -->
<template>
<!-- 歌手详情页面 -->
    <!-- 过度动画 -->
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>

<script type='text/ecmascript-6'>
export default {
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  mounted() {},

  created() {},

  methods: {}
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