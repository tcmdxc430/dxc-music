// 准备修改state中数据
// mutation-types中所有常量放到types集合中
import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state,singer) {
        state.singer = singer
    }
}

export default mutations