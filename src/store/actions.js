// 异步修改state  封装mutation集合,调用一个action修改多个mutation
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'
// 查找list列表中有没有传入歌曲song 如果有返回索引
function findIndex(list,song) {
    return list.findIndex((item)=>{
        return item.id === song.id
    })
}
// action.js中默认传入context{dispatch: local.dispatch,commit: local.commit,getters: local.getters,state: local.state,rootGetters: store.getters,rootState: store.state }
export const selectPlay = function({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list)
    if(state.mode == playMode.random){
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index = findIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
// 歌手详情页的随机播放
export const randomPlay = function({commit},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
export const insertSong = function({commit,state},song){
    // slice返回一个克隆对象
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前播放歌曲
    let currentSong = playlist[currentIndex]
    // find playlist查找插入的歌曲在列表中是否存在
    let fpIndex = findIndex(playlist,song)
    // 插入在当前歌曲索引的下一个
    currentIndex++
    // 插入歌曲 splice(位置,0添加正数删除数,如果有为添加目标)
    playlist.splice(currentIndex,0,song)
    // 已经存在 就要先删掉已存在的歌曲
    if(fpIndex>-1){
        // 如果当前插入序号在原有序号之后
        if(currentIndex>fpIndex){
            // 删除的原歌曲索引
            playlist.splice(fpIndex,1)
            currentIndex--
        // 如果当前插入序号在原有序号之前
        }else{
            // 依然删除原歌曲
            playlist.splice(fpIndex+1,1)
        }
    }
    // 播放队列中song要插入的位置
    let currentSIndex = findIndex(sequenceList,currentSong)+1
    // 判断原队列中是否有song
    let fsIndex = findIndex(sequenceList,song)
    sequenceList.splice(currentSIndex,0,song)
    // 如果原来队列中有song
    if(fsIndex>-1){
        // 如果当前插入序号在原有队列序号之后
        if(currentSIndex>fsIndex){
            sequenceList.splice(fsIndex,1)
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    }
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
// 存储搜索记录
export const saveSearchHistory = function({commit},query){
    // 把新列表提交到types.SET_SEARCH_HISTORY更新
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}
// 删除指定搜索记录
export const deleteSearchHistory = function({commit},query){
    // 把新列表提交到types.SET_SEARCH_HISTORY更新
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}
// 删除全部搜索记录
export const clearSearchHistory = function({commit}){
    // 把新列表提交到types.SET_SEARCH_HISTORY更新
    commit(types.SET_SEARCH_HISTORY,clearSearch())// 去cache中清除本地缓存
}
// 删除播放队列中1首
export const deleteSong = function({commit,state},song) {
    // slice返回一个克隆对象
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist,song)
    console.log('pIndex'+pIndex)
    playlist.splice(pIndex,1)
    let sIndex = findIndex(sequenceList,song)
    sequenceList.splice(sIndex,1)
    // 当前播放歌曲在删除歌曲之后，删除的是最后一个且正在播放
    if(currentIndex>pIndex || pIndex === playlist.length){
        currentIndex--
    }

    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    // 当队列中没有歌曲 停止播放
    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE,playingState)
    // if(!playlist.length){
    //     commit(types.SET_PLAYING_STATE,false)
    // }else{
    //     commit(types.SET_PLAYING_STATE,true)
    // }
}
// 删除整个播放队列
export const deleteSongList = function({commit}){
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)
}

export const savePlayHistory = function({commit},song){
    // 传入song当前播放歌曲后返回一个新的songs数组，传入SET_PLAY_HISTORY
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}
// 点击收藏icon时
export const saveFavoriteList = function({commit},song){
    // 传入song(当前收藏歌曲)后返回一个新的songs数组，传入SET_FAVORITE_LIST
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}
// 点击红心取消收藏时
export const deleteFavoriteList = function({commit},song){
    // 传入song当前播放歌曲后返回一个新的songs数组，传入SET_PLAY_HISTORY
    commit(types.SET_PLAY_HISTORY,deleteFavorite(song))
}