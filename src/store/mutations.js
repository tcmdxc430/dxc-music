// 准备修改state中数据
// mutation-types中所有常量放到types集合中 初始化vuex状态的step3
import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state,singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state,flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state,flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state,list) {
        // Object.assign([], list)使list不在vuex以外的地方改变
        state.playlist = Object.assign([], list)
    },
    [types.SET_SEQUENCE_LIST](state,list) {
        state.sequenceList = Object.assign([], list)
    },
    [types.SET_PLAY_MODE](state,mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state,index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state,disc) {
        state.disc = disc
    },
    [types.SET_TOP_LIST](state,topList) {
        state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state,history) {
        state.searchHistory = history
    },
}

export default mutations