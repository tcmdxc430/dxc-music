<template>
    <!-- 监听到scroll组件派发的scrollToEnd时调用searchMore -->
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <!-- 无数据时展示 -->
    <div class="no-result-wrapper">
        <!-- 写死数据不加冒号 -->
     <no-result v-show="!hasMore&& !result.length" title="没有索索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {ERR_OK} from 'api/config'
  import {search} from 'api/search'
//   import {filterSinger} from 'common/js/song'
  import {getMusic} from 'api/song'
  import {createSong} from 'common/js/song'
  import Singer from 'common/js/singer'
  import {mapMutations,mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'
  
  const TYPE_SINGER = 'singer'
  // 每页请求数据量
  const perpage = 20
  export default {
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            page:1,
            result:[],
            pullup:true,
            hasMore:true,
            ret:[],
            ret2:[],
            beforeScroll:true
        }
    },
    methods: {
        // 调接口
        search(){
            // 初始化页码
            this.page = 1
            this.hasMore = true
            this.$refs.suggest.scrollTo(0,0)
            search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                if(res.code === ERR_OK){
                    this._genResult(res.data)
                    setTimeout(() => {
                       this.result = this.ret2
                    }, 1800);
                    
                    this._checkMore(res.data)
                }
            })
        },
        _checkMore(data) {
            const song = data.song
            // 判断到最后一页
            if(!song.list.length || (song.curnum+song.curpage*perpage)>=song.totalnum){
                this.hasMore = false
            }
        },
        // 分页加载
        searchMore(){
            if(!this.hasMore){
                return
            }
            this.page++
            // this.showSinger = false
            search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                if(res.code === ERR_OK){
                    this._genResult(res.data)
                    setTimeout(() => {
                        this.result = this.result.concat(this.ret2)
                    }, 1800);
                    
                    
                    this._checkMore(res.data)
                }
            })
        },
        // 根据歌曲或者歌手变换图标
        getIconCls(item){
            if(item.type === TYPE_SINGER){
                return 'icon-mine'
            }else{
                return 'icon-music'
            }
        },
        getDisplayName(item){
            if(item.type === TYPE_SINGER){
                return item.singerName
            }else{
                return `${item.name}-${item.singer}`
            }
                
        },
        listScroll(){
            this.$emit('listScroll')
        },
        selectItem(item){
            if(item.type === TYPE_SINGER){
                const singer = new Singer({
                    id: item.singerMID,
                    name: item.singerName
                })
                this.$router.push({
                    path:`/search/${singer.id}`
                })
                this.setSinger(singer)
            //当点击的是歌曲
            }else{
                this.insertSong(item)
            }
        },
        _genResult(data){
            // let ret = []
            this.ret2 = []
            //如果可以搜索歌手
            if(data.zhida&&data.zhida.zhida_singer&&data.semantic.curpage === 1){
                // 将data.zhida拷贝到...标识的空对象里
                this.ret2.push({...data.zhida.zhida_singer,...{type:TYPE_SINGER}})
            }
            if(data.song){
                this._normalizeSongs(data.song.list)
                setTimeout(() => {
                    this.ret2 = this.ret2.concat(this.ret)
                    console.log(this.ret2) 
                }, 1800);
                
            }
            
        },
        _normalizeSongs(list) {
            // let ret = []
            this.ret = []
            list.forEach((musicData) => {
                if(musicData.songid && musicData.albumid){
                    getMusic(musicData.songmid).then((res) => {
                    if(res.code === 0) {
                        const svkey = res.data.items
                        const songVkey = svkey[0].vkey
                        this.ret.push(createSong(musicData,songVkey))
                    }
                })
                // ret.push(createSong(musicData))
                } 
            })
            //    return this.ret 
            
        },
        
        // 注册mapMutations setSinger来发送，对应mutation.js中的type.SET_SINGER
        ...mapMutations({
            setSinger:'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch: {
        // query发生变化时请求数据
        query(){
            this.search()
        }
    },
    components:{
        Scroll,
        Loading,
        NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>