
<template>
    <!--  推荐详情页面 -->
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex' // 获取state中更新的disc数据
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
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
    created() {
        this._getSongList()
    },
    methods: {
        _getSongList() {
            // 请求api中代理接口
            getSongList(this.disc.dissid).then((res)=>{
                if(res.code === ERR_OK){
                    console.log(res.cdlist[0].songlist)
                }
            })
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

