
<template>
<!-- 歌手列表组件 -->
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧字母列表dom -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!-- 获得每一个数据的索引，赋值给data-index -->
        <li v-for="(item,index) in shortcutList" class="item" :class="{'current': currentIndex===index}" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 顶部名称固定 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
     <!-- loading -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  // 计算每一个字母的高度
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    created() {
      // 如果在props中声明则会监测touch的变化 没有必要
      this.touch = {}
      // 通过scroll组件的dom传入scroll.vue中
      this.listenScroll = true
      this.listHeight = []
      // bscroll中probeType=1是非实时派发scroll事件，23都是实时
      this.probeType = 3
    },
    // 需要监测变化的数据
    data() {
      return {
        scrollY: -1,
        currentIndex: 0 ,
        // 判断2个fixedtitle是否重合
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 获取右侧快速字母入口
      shortcutList() {
        // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值,map() 不会改变原始数组
        return this.data.map((group) => {
          // 截取第一个字符
          return group.title.substr(0,1)
        })
      },
      // 获取所在区间字母名称
      fixedTitle() {
        if(this.scrollY>0) {
          return ''
        }
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        // 点击到的字母的索引
        // 获得到的是字符串
        let anchorIndex = getData(e.target,'index')
        let firstTouch = e.touches[0]
        //得到开始的y坐标
        this.touch.y1 = firstTouch.pageY
        // 获得是从第几个字母开始点击的
        this.touch.anchorIndex = anchorIndex
        console.log(e)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        //得到结束的y坐标
        this.touch.y2 = firstTouch.pageY
        // 得到手指滑动过程中y轴的偏移,得到偏移了几个字母,并向下取整 === math.floor
        let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT | 0
        // 手指离开时的字母
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        console.log(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        
        this.scrollY = pos.y
      },
      // 到达滚动到的位置
      _scrollTo(index) {
        // 滚动边界处理
        if(!index && index != 0) {
          return
        }
        if(index<0) {
          index = 0
        }else if(index>this.listHeight.length -2) {
          index = this.listHeight.length -2
        }
        // 设置scrollY，实现点击时也能有高亮样式
        this.scrollY = -this.listHeight[index]
        
        // 第二个参数代表缓动时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++) {
          // 得到每一个group元素
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        // 延迟确保dom已经渲染完毕
        setTimeout(() => {
          // 计算高度
          this._calculateHeight()
        }, 20);
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部 newY>0
        if(newY > 0) {
          this.currentIndex = 0
          return
        }
        // 中间各个部位
        for(let i=0;i<listHeight.length-1;i++) {
          // 得到一个字母的高度区间
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          // 如果滑到底了 或者没有超出本字母区间
          if(-newY>=height1 && -newY<height2) {
            // 输出字母区间内的全部index
            this.currentIndex = i
            // 两个fiexedtitle之间的距离
            this.diff = height2+newY
            return
          }
        }
        // 当滚到底部，且-newY大于最后一个元素上限 
        this.currentIndex = listHeight.length -2
      },
      diff(newVal) {
        // 计算2个fixedtitle如果完全重叠，就返回完全重叠位置
        let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      // width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
