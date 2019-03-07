<template>
    <!-- 监听到scroll组件派发的scrollToEnd时调用searchMore -->
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore">
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
    <div class="no-result-wrapper">
     
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
  import {mapMutations,mapActions} from 'vuex';
  
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
            hasMore:true
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
                    this.result = this._genResult(res.data)
                    console.log(this.result)
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
            search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                if(res.code === ERR_OK){
                    
                    this.result = this.result.concat(this._genResult(res.data))
                    
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
            console.log(item)
            if(item.type === TYPE_SINGER){
                return item.singerName
            }else{
                return `${item.name}-${item.singer}`
            }
                
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
            let ret = []
            //如果可以搜索歌手
            if(data.zhida&&data.zhida.zhida_singer.singerID){
                // 将data.zhida拷贝到...标识的空对象里
                ret.push({...data.zhida.zhida_singer,...{type:TYPE_SINGER}})
            }
            if(data.song){
                ret = ret.concat(this._normalizeSongs(data.song.list))
            //     let rr = []
            //     data.song.list.forEach((musicData) => {
            //     if(musicData.songid && musicData.albumid){
            //         getMusic(musicData.songmid).then((res) => {
            //         if(res.code === 0) {
            //             // console.log(res)
            //             const svkey = res.data.items
            //             const songVkey = svkey[0].vkey
            //              this.$nextTick(()=>{
            //                 rr.push(createSong(musicData,songVkey))
            //                 })
                        
            //             // ret = ret.concat(rr)
            //         }
            //     })
            //     // ret.push(createSong(musicData))
            //     }
                
            // })
            //    console.log(rr) 
            
            // setTimeout(() => {
                
            //     console.log(rr)
            //     ret = ret.concat(rr)
            //     console.log(ret)
            // }, 1000);
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
                if(musicData.songid && musicData.albumid){
                //     getMusic(musicData.songmid).then((res) => {
                //     if(res.code === 0) {
                //         // console.log(res)
                //         const svkey = res.data.items
                //         const songVkey = svkey[0].vkey
                //         ret.push(createSong(musicData,songVkey))
                //     }
                // })
                ret.push(createSong(musicData))
                }
                
            })
               return ret
            
            
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
        Loading
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