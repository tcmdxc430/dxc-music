// 获取state中数据 state中数据映射
// state() return state.singer
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex

export const currentSong = (stat)=>{
    return state.playlist[state.currentIndex] || {}
}