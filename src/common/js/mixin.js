// mixin.js中为公共js代码片段，用于合并到其他组件代码中，同名方法将优先执行组件中的

import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    // dom结构完成时
    mounted() {
        this.handlePlayList(this.playlist)
    },
    // keep-alive组件切换时
    activated() {
        this.handlePlayList(this.playlist)
    },
    watch: {
        playlist(newVal){
            this.handlePlayList(newVal)
        }
    },
    methods: {
        // 当组件中定义了handlePlayList函数时，会优先执行组件中的handlePlayList()
        handlePlayList(){
            throw new Error('组件中需要单独定义该函数')
        }
    },
}
// 播放模式切换通用代码
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode == playMode.sequence?'icon-sequence':this.mode == playMode.loop?'icon-loop':'icon-random'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playlist',
            'mode'
        ])
    },
    methods: {
        // 每点击一次 更换一次循环模式
      changeMode() {
        const mode = (this.mode+1)%3
        this.setPlayMode(mode)
        let list = null
        if(mode == playMode.random){
          list = shuffle(this.sequenceList)
        } else{
          list = this.sequenceList
        }
        this.resetCurrnetIndex(list)
        this.setPlayList(list)
      },
      // 播放模式改变时 当前歌曲不变
      resetCurrnetIndex(list) {
        // findIndex是es6语法，类似foreach index为歌曲索引
        let index = list.findIndex((item)=>{
          return item.id == this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      ...mapMutations({
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList:'SET_PLAYLIST'
      })
    },
}
// 搜索历史通用代码
export const searchMixin = {
  data() {
    return {
      query: '',
    }
  },
  computed: {
    // 从vuex获取数据
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    // 在产生滚动时 让input失去焦点
    blurInput(){
      this.$refs.searchBox.blur()
    },
    // 接到子组件suggest的广播事件，保存历史记录
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query){
      this.query = query
    },
    addQuery(query){
      // 父组件传入子组件的第二种方法，调用子组件方法 传入父组件参数
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  },
}