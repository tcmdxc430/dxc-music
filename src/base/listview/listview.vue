
<template>
<!-- 歌手列表组件 -->
  <scroll class="listview" :data="data" ref="listview">
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
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  // 计算每一个字母的高度
  const ANCHOR_HEIGHT = 18
  export default {
    created() {
      // 如果在props中声明则会监测touch的变化 没有必要
      this.touch = {}
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
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        // 点击到的字母的索引
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
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      }
    },
    components: {
      Scroll
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
      width: 20px
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
      top: 0
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
