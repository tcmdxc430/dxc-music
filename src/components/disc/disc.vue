
<template>
    <!--  推荐详情页面 -->
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex' // 获取state中更新的disc数据
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getMusic} from 'api/song'
export default {
    computed: {
        title(){
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        },
        //注册mapGetters来获取state中的数据对象并存在vue中
        ...mapGetters([
            'disc'
        ])
    },
    data() {
        return {
            // 存放最终的歌单歌曲列表数据
            songs:[]
        }
    },
    created() {
        this._getSongList()
    },
    methods: {
        _getSongList() {
            if(!this.disc.dissid){
                this.$router.push('/recommend')
                return
            }
            // 请求api中代理接口
            getSongList(this.disc.dissid).then((res)=>{
                if(res.code === ERR_OK){
                    this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                }
            })
        },
        // 对取到数据处理
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
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
    components:{
        MusicList
    }
}
</script>

<style scoped lang="stylus" rel="stylesheets/stylus">
.slide-enter-active, .slide-leave-active
    transition all 0.3s
.slide-enter,.slide-leave-to
    transform translate3d(100%,0,0)

</style>

