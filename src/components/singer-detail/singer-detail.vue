<!--  created by dongxc on 2018/8/24 -->
<template>
<!-- 歌手详情页面 -->
    <!-- 过度动画 -->
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script type='text/ecmascript-6'>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {getMusic} from 'api/song'
import {createSong} from  'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data () {
    return {
        songs: []
    };
  },

  components: {},

  computed: {
      // 详情页的歌手名称数据
      title() {
          return this.singer.name
      },
      // 详情页的歌手大图数据
      bgImage() {
          return this.singer.avatar
      },
      // 通过vuex获得歌手数据singer
      ...mapGetters([
          'singer'
      ])
  },

  mounted() {},

  created() {
      this._getDetail()
      console.log(this.singer)
  },

  methods: {
      _getDetail() {
          // 如果刷新页面没有传入singerid 则跳转得到上一页
          if(!this.singer.id) {
              this.$router.push('/singer')
              return
          }
          getSingerDetail(this.singer.id).then((res) => {
              if(res.code === 0){
                  // 获得歌手名下每一首歌曲以及对应歌曲信息
                  this.songs = this._normalizeSongs(res.data.list)
                  console.log(this.songs)
              }
          })
      },
      // 对歌手数据处理
      _normalizeSongs(list) {
          let ret = []
          list.forEach((item) => {
              // 取出每个musicData对象
              let {musicData} = item
              // 必传参数  
              if(musicData.songid && musicData.albummid) {
                //   ret.push(createSong(musicData))
                
                getMusic(musicData.songmid).then((res) => {
                    if(res.code === 0) {
                        // console.log(res)
                        const svkey = res.data.items
                        const songVkey = svkey[0].vkey
                        const newSong = createSong(musicData,songVkey)
                        ret.push(newSong)
                    }7
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

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.slide-enter-active,.slide-leave-ative
    transition all 0.3s
.slide-enter,.slide-leave-to
    // 元素从左向右偏移100%的初始位置
    transform translate3d(100%,0,0)
</style>