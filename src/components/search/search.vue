<!--  created by dongxc on 2019/2/27 -->
<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <!-- 通过onQueryChange方法接收到子组件广播的query -->
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 没有搜索文时展示 热门列表 -->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <!-- 历史列表 -->
          <search-list :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <!-- 搜索出的结果 -->
    <div class="search-result" v-show="query">
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {mapActions,mapGetters} from 'vuex'
import SearchList from 'base/search-list/search-list'
export default {
  data () {
    return {
      hotKey:[],
      query:''
    };
  },
  created() {
    // 获取接口数据
    this._getHotKey()
  },
  computed: {
    // 从vuex获取数据
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code === ERR_OK){
          // 截取数组前十条
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },
    addQuery(query){
      // 父组件传入子组件的第二种方法，调用子组件方法 传入父组件参数
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query){
      this.query = query
    },
    // 在产生滚动时 让input失去焦点
    blurInput(){
      this.$refs.searchBox.blur()
    },
    // 接到子组件suggest的广播事件，保存历史记录
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList
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