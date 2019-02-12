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
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current':currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 操作控制区 -->
          <div class="operators">
             <!-- 播放模式 -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <!-- 后退按钮 -->
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <!-- 暂停/播放按钮 -->
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <!-- 前进按钮 -->
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
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
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <!-- 歌手歌曲名称 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 播放按钮 -->
        <div class="control">
          <!-- mini进度条 -->
          <progress-circle :radius="radius" :percent="percent">
            <i slot="miniIcon" @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <!-- 歌曲列表展开按钮 -->
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- canplay为歌曲加载完成播放前派发事件 timeupdate为歌曲播放后触发 -->
    <!-- audio标签在播放完成后触发ended -->
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from 'vuex';
import animations from 'create-keyframe-animation' // 用于将js代码编译为css animate
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')

export default {
    data() {
      return{
        songReady:false,
        currentTime:0,
        radius:32,
        currentLyric:null,
        currentLineNum:0
      }
    },
    computed: {
        playIcon() {
          return this.playing?'icon-pause':'icon-play'
        },
        miniIcon() {
          return this.playing?'icon-pause-mini':'icon-play-mini'
        },
        cdCls() {
          return this.playing?'play':'play pause'
        },
        disableCls() {
          return this.songReady?'':'disable'
        },
        percent() {
          return this.currentTime/this.currentSong.duration
        },
        iconMode() {
           return this.mode == playMode.sequence?'icon-sequence':this.mode == playMode.loop?'icon-loop':'icon-random'
        },
        ...mapGetters([
            'fullScreen',
            'playlist',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
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
            duration:400,
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
      // 播放完成触发
      end() {
        // 当模式为单曲循环 不跳转到下一首index
        if(this.mode == playMode.loop){
          this.loop()
        }else(
          this.next()
        )
        
      },
      // 单曲循环方法 时间重置为0 再播放
      loop() {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
      },
      // 下一首
      next() {
        if(!this.songReady){
          return
        }
        let index = this.currentIndex+1
        if(index == this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        // 如果此时为暂停状态，重新获取一下按钮状态
        if(!this.playing){
          this.togglePlaying()
        }
        this.songReady = false
      },
      // 上一首
      prev() {
        if(!this.songReady){
          return
        }
        let index = this.currentIndex-1
        if(index == -1) {
          index = this.playlist.length-1
        }
        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlaying()
        }
        this.songReady = false
      },
      // 歌曲加载完成时
      ready() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      // 获取当前播放时间
      updateTime(e) {
        console.log(e)
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        console.log(this.currentSong)
        // 向下取整 相当于math.floor
        interval = interval|0
        const minute = interval/60|0
        let second = interval%60
        if(second<10) {
          second = '0'+second
        }
        return `${minute}:${second}`
      },
      // 修改拖动后歌曲的实际进度
      onProgressBarChange(percent) {
        this.$refs.audio.currentTime = this.currentSong.duration*percent // audio.currentTime为可读写的audio标签属性
        if(!this.playing) {
          this.togglePlaying()
        }
      },
      // 每点击一次 更换一次循环模式
      changeMode() {
        const mode = (this.mode+1)%3
        this.setPlayMode(mode)
        let list = null
        if(mode == playMode.random){
          list = shuffle(this.sequenceList)
        } else{
          list = this.sequenceList
        }
        this.resetCurrnetIndex(list)
        this.setPlayList(list)
      },
      // 播放模式改变时 当前歌曲不变
      resetCurrnetIndex(list) {
        // findIndex是es6语法，类似foreach index为歌曲索引
        let index = list.findIndex((item)=>{
          return item.id == this.currentSong.id
        })
        console.log(index)
        this.setCurrentIndex(index)
      },
      getLyric() {  
        this.currentSong.getLyric().then((lyric)=>{
          // 歌词行变更时 回调handleLyric
          this.currentLyric = new Lyric(lyric,this.handleLyric)
          if(this.playing) {
            // lyric-parser方法
            this.currentLyric.play()
          }
          console.log(this.currentLyric)
        })
      },
      handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum
        if(lineNum>5) {
          // 发生滚动时 保持高亮再5行的中间位置
          let lineEl = this.$refs.lyricLine[lineNum-5]
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        }else{
          this.$refs.lyricList.scrollTo(0,0,1000)
        }
      },
      // mutation-types.js文件的映射 制造一个方法名来映射
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList:'SET_PLAYLIST'
      })
    },
    watch:{
      // 当currentSong发生变化时播放
      currentSong(newSong,oldSong) {
        if(newSong.id == oldSong.id){
          return
        }
        this.$nextTick(()=>{
          this.$refs.audio.play()
          // 加载歌词
          this.getLyric()
        })
        
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying?audio.play():audio.pause()
        })
      }
    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll
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