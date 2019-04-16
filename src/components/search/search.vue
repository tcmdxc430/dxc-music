<!--  created by dongxc on 2019/2/27 -->
<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <!-- 通过onQueryChange方法接收到子组件广播的query -->
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 没有搜索文时展示 热门列表 -->
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <!-- 由于scroll组件只能对其中一个元素快生效 所以需要在最外层包一个div -->
        <div>
          <div class="hot-key">
            <h1 class="title">热门</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!-- 历史列表 -->
            <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索出的结果 -->
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <confirm ref="confirm" text="are you ok?" confirmBtnText="清空" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playListMixin,searchMixin} from 'common/js/mixin'
import {mapActions} from 'vuex'
export default {
  mixins:[playListMixin,searchMixin],
  data () {
    return {
      hotKey:[]
    };
  },
  created() {
    // 获取接口数据
    this._getHotKey()
  },
  computed: {
    // 为了使scroll中两组数据只要改变就重新计算 把数据合成一个
    shortcut(){
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    handlePlayList(playlist){
      const bottom = playlist.length>0?'60px':''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code === ERR_OK){
          // 截取数组前十条
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },
    // 删除指定搜索记录
    deleteOne(item){
      this.deleteSearchHistory(item)
    },
    // 删除全部搜索记录
    deleteAll(){
      this.clearSearchHistory()
    },
    showConfirm(){
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch:{
    query(newQuery){
      if(!newQuery){
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>