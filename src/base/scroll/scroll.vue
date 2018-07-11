<!--  created by dongxc on 2018/7/11 -->
<template>
<!-- bscroll初始化通用 -->
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
export default {
  data () {
    return {
    };
  },
  props: {
      // 缓慢或者快速滚动时触发 
      probeType: {
          type: Number,
          default: 1
      },
      click: {
          type: Boolean,
          default: true
      },
      // 数据量变化时更新scroll
      data: {
          type: Array,
          default: null
      }
  },  
  components: {},

  computed: {},

  mounted() {
      setTimeout(() => {
          this._initScroll()
      }, 20)
  },
  methods: {
      _initScroll() {
          // 初始化undefined时
          if(!this.$refs.wrapper) {
              return
          }
          this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType, 
              click: this.click
          })
      },
      // 代理scroll组件方法
      enable() {
          // 如果scroll存在调用enable
          this.scroll && this.scroll.enable()
      },
      disable() {
          // 如果scroll存在调用disable
          this.scroll && this.scroll.disable()
      },
      refresh() {
          // 重新计算高度
          this.scroll && this.scroll.refresh()
      }
  },
  watch: {
      data() {
          setTimeout(() => {
            this.refresh()
        }, 20)
      }
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>