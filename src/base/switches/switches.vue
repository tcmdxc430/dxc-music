<template>
<!-- tabs组件 -->
  <ul class="switches">
    <li class="switch-item" @click="switchItem(index)" v-for="(item,index) in switches"
     :class="{'active':currentIndex === index}">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    // 作为子组件接收父级的传值
    props:{
      // tabs条目数据
      switches: {
        type: Array,
        default: []
      },
      // 当前active的tabs
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        // 派发一个switch事件携带index
        this.$emit('switch',index)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>