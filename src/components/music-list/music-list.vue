
<template>
<!-- 歌手详情页面 -->
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">都给我播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 列表向上滑动时的跟随背景 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
        <div class="song-list-wrapper">
            <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
        </div>
        <div class="loading-container" v-show="!songs.length">
          <loading></loading>
        </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
 import Scroll from 'base/scroll/scroll'
 import SongList from 'base/song-list/song-list'
 import {prefixStyle} from 'common/js/dom'
 import Loading from 'base/loading/loading'
 import {mapActions} from 'vuex'
 import {playListMixin} from 'common/js/mixin'
 // 顶部留白
 const RESERVED_HEIGHT = 40
 const transform = prefixStyle('transform')
 const backdrop = prefixStyle('backdrop-filter')
 export default {
     mixins:[playListMixin],// 组件可以引入多个mixin
     props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        // 接收父组件top-list传来的rank
        rank:{
          type:Boolean,
          default: false
        }
     },
     data(){
       return {
         scrollY: 0
       }
     },
     computed: {
         bgStyle() {
             return `background-image:url(${this.bgImage})`
         }
     },
     created() {
       this.probeType = 3
       this.listenScroll = true
     },
     mounted() {
      //  imageHeight加入缓存 
       this.imageHeight = this.$refs.bgImage.clientHeight
       this.minTranslateY = -this.imageHeight +RESERVED_HEIGHT
       // $el取得对应dom
       this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
     },
     methods: {
       scroll(pos) {
         this.scrollY = pos.y
       },
       back() {
         this.$router.back()
       },
       selectItem(item,index) {
         this.selectPlay({
           list: this.songs,
           index
         })
       },
       random() {
         this.randomPlay({
           list:this.songs
         })
       },
       handlePlayList(playlist) {
         // 当播放列表中有音乐加入时 将底部高度设置为60px 预留出mini播放器的高度
         const bottom = playlist.length>0?'60px':''
         // 由于引用的是vue组件中的dom  需要用$el
         this.$refs.list.$el.style.bottom = bottom
         // 让bscroll重新计算高度
         this.$refs.list.refresh()
       },
       // 引入vuex中action.js中的方法
       ...mapActions([
         'selectPlay',
         'randomPlay'
       ])
     },
     watch: {
       scrollY(newY) {
         let zIndex = 0
         let scale = 1
         let blur = 0
         // 背景在0到-minTranslateY之间滚动
         let translateY = Math.max(this.minTranslateY,newY)
         this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        //  下拉
        // 放大倍数
        const percent = Math.abs(newY/this.imageHeight)
        if(newY>0) {
          scale = 1+percent
          zIndex = 10
        }else {
          blur = Math.min(20*percent,20)
        }
        // ios渐进增强的blur效果
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        //  上划
        // 超出顶部留白时
         if(newY<this.minTranslateY) {
           zIndex = 10
           this.$refs.bgImage.style.paddingTop = 0
           this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
           this.$refs.playBtn.style.display = 'none'
         }else{
           this.$refs.bgImage.style.paddingTop = '70%'
           this.$refs.bgImage.style.height = 0
           this.$refs.playBtn.style.display = ''
         }
         this.$refs.bgImage.style.zIndex = zIndex

         this.$refs.bgImage.style[transform] = `scale(${scale})`
       }
     },
     components: {
         Scroll,
         SongList,
         Loading
     }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top //从顶部开始做transform操作，默认为中心
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow: hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>