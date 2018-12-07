// 默认状态集合 
import {playMode} from 'common/js/config'
// 定义默认state
const state = {
    singer: {},
    playing: false,// 播放&停止
    fullScreen: false,// 全屏&收起
    playlist: [],// 播放的整体列表
    sequenceList: [],// 播放队列(可随机)
    mode: playMode.sequence,// 默认为1 顺序播放，没有直接写1为了增强语义化
    currentIndex: -1// 当前播放的歌曲索引
}

export default state