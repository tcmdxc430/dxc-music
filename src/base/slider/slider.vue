<!--  created by dongxc on 2018// -->
<template>
<!-- 轮播 -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex:0 //表示当前是第几条数据
    };
  },
props: {
  // 是否可以循环
  loop: {
    type: Boolean,
    default: true
  },
  // 是否可以自动轮播
  autoPlay: {
    type: Boolean,
    default: true
  },
  // 轮播间隔时间
  interval: {
    type: Number,
    default: 3000
  }
},
//   components: {},

//   computed: {},

  mounted() {
    // 浏览器平均17ms刷新一次
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if(this.autoPlay) {
        this._play()
      }
    }, 20)
  },

  methods: {
    // 计算slider的宽度
    _setSliderWidth() {
      // 确定列表有多少个元素
      this.children = this.$refs.sliderGroup.children

      let width = 0
      // 父容器宽度
      let sliderWidth = this.$refs.slider.clientWidth
      for(let i=0;i<this.children.length;i++) {
        let child = this.children[i]
        addClass(child,'slider-item')
        child.style.width = sliderWidth + 'px'
        // 图片总宽度
        width += sliderWidth
      }
      if(this.loop) {
        //预留左右轮播宽度
        width += 2*sliderWidth

      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化slider
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider,{
        scrollX:true,
        scrollY:false,
        momentum:false,// 是否有惯性
        snap:true,// 主要用于轮播
        snapLoop:this.loop,
        snapThreshold:0.3,
        snapSpeed:400,
        click:true
      })
      // 监测轮播后bs发出的scrollEnd标识
      this.slider.on('scrollEnd',()=>{
        let pageIndex = this.slider.getCurrentPage().pageX
        if(this.loop) {
          // 由于无限循环会在开头和结尾增加一条拷贝数据
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if(this.autoPlay) {
          // 如不清除定时器则不能手动选择
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 初始化dot
    _initDots() {
      //dots是一个长度this.children.length的空数组
      this.dots = new Array(this.children.length)
    },
    // 自动播放轮播方法
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if(this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(()=>{
        // goToPage(x方向，y方向，时间)
        this.slider.goToPage(pageIndex,0,400)
      },this.interval)
    }
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable"
.slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>