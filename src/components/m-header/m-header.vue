<!--  -->
<template>
<!-- 标题 -->
  <div class="m-header">
      <div class="icon"></div>
      <h1 class="text">DXC MUC</h1>
      <!-- 个人中心 -->
      <router-link to="/user" class="mine" tag="div">
        <i class="icon-mine"></i>
      </router-link>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  data () {
    return {
    };
  },

//   components: {},

//   computed: {},

//   mounted: {},

//   methods: {}
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 8vw
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 8vw 8.5vw
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>