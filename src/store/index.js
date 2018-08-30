// 入口
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'Vuex/dist/logger' // 每次通过mutations修改state数据自动打印日志

Vue.use(Vuex)
// 在开发环境下检测数据是否在mutation环节修改
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug?[createLogger()]:[]
})