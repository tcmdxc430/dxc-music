<!--  created by dongxc on 2019/2/18 -->

<template>
<!-- 排行榜 -->
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <!-- // 最外层榜单说明 -->
        <li @click="selectItem(item)" class="item" v-for="item in topList">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <!-- 内层歌曲榜单前三名展示 -->
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins:[playListMixin],// 组件可以引入多个mixin
  data () {
    return {
      topList:[]
    };
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then((res)=>{
        if(res.code == ERR_OK){
          this.topList = res.data.topList
        }
      })
    },
    handlePlayList(playlist) {
      // 当播放列表中有音乐加入时 将底部高度设置为60px 预留出mini播放器的高度
      const bottom = playlist.length>0?'60px':''
     
      this.$refs.rank.style.bottom = bottom
      // 让bscroll重新计算高度
      this.$refs.toplist.refresh()
    },
    // 跳转二级路由
    selectItem(item) {
      this.$router.push({
        path:`/rank/${item.id}`
      })
      // 传入mutation中更新toplist对象数据
      this.setTopList(item)
    },
    // 注册mapMutations来发送，对应mutation.js中的type.SET_DISC
    ...mapMutations({
      setTopList:'SET_TOP_LIST'
    })
  },
  components:{
    Scroll,
    Loading
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .toplist
    height: 100%
    overflow: hidden
    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px
      &:last-child
        padding-bottom: 20px
      .icon
        flex: 0 0 100px
        width: 100px
        height: 100px
      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        .song
          no-wrap()
          line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>