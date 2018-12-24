// 异步修改state  封装mutation调用一个action修改多个mutation
import * as types from './mutation-types'
export const selectPlay = function({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAYLIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}