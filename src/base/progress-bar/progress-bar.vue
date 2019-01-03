<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- 进度条中间拖动按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn">
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
    watch:{
      // 监测百分比数字变化
      percent(newPercent){
        if(newPercent>=0){
          // 整体进度条宽度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          // 已播放的进度
          const offsetWidth = newPercent*barWidth
          this.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
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