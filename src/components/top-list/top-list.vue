<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getMusic} from 'api/song'

  export default {
      // 计算获得music-list组件需要的文字和图片信息
    computed: {
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            
            return this.topList.picUrl
        },
        // 获取mutation中topList数据
        ...mapGetters([
            'topList'
        ])
    },
    data() {
        return {
            songs:[]
        }
    },
    created() {
        this._getMusicList()
    },
    methods: {
        _getMusicList(){
            if(!this.topList.id){
                // this.$router.push('/rank')
                window.history.back()
                return
            }
            getMusicList(this.topList.id).then((res) => {
                if(res.code === ERR_OK){
                    this.songs = this._normalizeSongs(res.songlist)
                }
            })
        },
        // 处理数据方法
        _normalizeSongs(list){
            let ret = []
            list.forEach((item) => {
                const musicData = item.data
                if(musicData.songid && musicData.albumid){
                    getMusic(musicData.songmid).then((res) => {
                    if(res.code === 0) {
                        console.log(res)
                        const svkey = res.data.items
                        const songVkey = svkey[0].vkey
                        const newSong = createSong(musicData,songVkey)
                        ret.push(newSong)
                    }
                })
                }
            })
            return ret
        }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>