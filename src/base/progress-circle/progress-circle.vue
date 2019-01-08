<template>
  <div class="progress-circle">
      <!-- viewBox：相对于实际像素从左上角00到100,100之间的区域  width和height为实际像素数-->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!-- 内层圆 半径50 圆心坐标为(50,50) -->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <!-- 外层圆 stroke-dasharray描边距离 圆形约314,stroke-dashoffset描边从顺时针终点往回偏移量-->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashoffset"/>
    </svg>
    <!-- 将组件包含的dom标签填充在此处 -->
    <slot name="miniIcon"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
        radius:{
            type:Number,
            default: 32
        },
        percent:{
            type:Number,
            default: 0
        }
    },
    data() {
        return{
            dashArray:Math.PI * 50 * 2
        }
    },
    computed: {
        // 偏移量
        dashoffset() {
            return (1-this.percent)*this.dashArray
        }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px // mini进度条的宽度
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>