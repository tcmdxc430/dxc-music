<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- 进度条中间拖动按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 可拖动按钮宽度
  const progressBtnWidth = 16
  export default {
    props: {
      percent:{
        type:Number,
        default:0
      }
    },
    created() {
      // 将触摸事件的通用数据放在该集合
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        // touch开始状态标识
        this.touch.initiated = true
        //touch点击位置
        this.touch.startX = e.touches[0].pageX
        // 已播放的宽度
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        // 当没有点击
        if(!this.touch.initiated) {
          return
        }
        // 滑动的距离
        const deltaX = e.touches[0].pageX - this.touch.startX
        // 偏移量 最多不能超过整个进度条宽度，最少不能小于0
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      // 拖动停止后重新计算按钮停留的位置
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 按钮停留位置的百分比
        const percent = this.$refs.progress.clientWidth/barWidth
        this.$emit('percentChange',percent)
      },
      // 设置歌曲进度
      _offset(offsetWidth) {
        // 进度条位置
        this.$refs.progress.style.width = `${offsetWidth}px`
        // 进度按钮位置
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      },
      progressClick(e) {
        this._offset(e.offsetX)
        this._triggerPercent()
      }
    },
    watch:{
      // 监测百分比数字变化
      percent(newPercent){
        if(newPercent>=0 && !this.touch.initiated){
          // 整体进度条宽度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          // 已播放的进度
          const offsetWidth = newPercent*barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>