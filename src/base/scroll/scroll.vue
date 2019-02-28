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
      },
      // 是否需要监听滚动列表
      listenScroll: {
          type: Boolean,
          defalut: false
      },
      // 是否需要上拉加载
      pullup:{
          type: Boolean,
          defalut: false
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

          if(this.listenScroll) {
              // 由于this.$emit会指向scroll而不指向vue实例，所以用me保存vue的this
              let me = this
              this.scroll.on('scroll',(pos) => {
                  me.$emit('scroll',pos)
              })
          }

          if(this.pullup){
            //   监听滚动停止
              this.scroll.on('scrollEnd',()=>{
                  console.log(this.scroll.y)
                  console.log(this.scroll.maxScrollY)
                  // 上拉所以是负数比较，表示距离超出底部50px时
                  if(this.scroll.y<=(this.scroll.maxScrollY+50)){
                    //   滚动到底部
                      this.$emit('scrollToEnd')
                  }
              })
          }
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
      },
      scrollTo() {
          // scrollTo方法接收到的参数（arguements）传入this.scroll
          this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      scrollToElement() {
          this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
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