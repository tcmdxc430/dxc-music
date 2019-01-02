<template>
  <div class="player" v-show="playlist.length>0">
    <!-- 通用播放器 -->
    <!-- transition中添加了4个动画钩子 -->
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <!-- 返回键 -->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!-- 歌曲名称 -->
          <h1 class="title" v-html="currentSong.name"></h1>
          <!-- 歌手名称 -->
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中部 -->
        <div class="middle">
          <div class="middle-l" >
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- 中部唱片背景图 -->
              <div class="cd" >
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 操作控制区 -->
          <div class="operators">
            <div class="icon i-left" >
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" >
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <!-- 暂停按钮 -->
              <i @click="togglePlaying" class="icon-play"></i>
            </div>
            <div class="icon i-right" >
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
      <!-- 迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 唱片缩略图 -->
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <!-- 歌手歌曲名称 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 播放按钮 -->
        <div class="control">
        </div>
        <!-- 歌曲列表展开按钮 -->
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from 'vuex';
import animations from 'create-keyframe-animation' // 用于将js代码编译为css animate
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')

export default {
    computed: {
        ...mapGetters([
            'fullScreen',
            'playlist',
            'currentSong',
            'playing'
        ])
    },
    methods: {
      back() {
        // 直接用this.fullScreen = false不可用 因为vuex mapGetters取得的数据只能在vuex中修改
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      // el是添加动画的dom，done是enter的回调函数，调用done表示将继续执行下一个afterEnter钩子函数 
      enter(el,done) {
        const {x,y,scale} = this.getPosAndScale()
        // 定义动画
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        // 初始化animations
        animations.registerAnimation({
          name:'move',
          animation,
          presets: {
            durantion:400,
            easing:'linear'
          }
        })
        // 运行animations
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      // 动画完成清除样式 
      afterEnter() {
        animations.registerAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el,done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x,y,scale} = this.getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style[transform] = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      // 暂停/播放
      togglePlaying() {
        this.setPlayingState(!this.playing)
      },
      // 做位移动画时，获取大小图标xy偏移量以及缩放变化
      getPosAndScale() {
        const targetWidth = 40 // 初始小图标的宽度
        const paddingLeft = 40 // 初始小图标的x偏移
        const paddingButtom = 30 // 初始小图标的y偏移
        const paddingTop = 80 // 大图标的top值
        const width = window.innerWidth*0.8 // 大图标宽度
        const scale = targetWidth/width // 小图标的缩放比例
        const x = -(window.innerWidth/2-paddingLeft) // 整个过程的x偏移 向右运动为负值
        const y = window.innerHeight-paddingTop-width/2-paddingButtom // 整个过程y的偏移
        return{
          x,y,scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING_STATE'
      })
    },
    watch:{
      // 当currentSong发生变化时播放
      currentSong() {
        this.$nextTick(()=>{
          this.$refs.audio.play()
        })
        
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying?audio.play():audio.pause()
        })
      }
    }
}
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)//贝塞尔曲线
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>