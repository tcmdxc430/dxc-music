// mixin.js中为公共js代码片段，用于合并到其他组件代码中，同名方法将优先执行组件中的

import {mapGetters} from 'vuex'

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