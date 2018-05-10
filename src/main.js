import "babel-polyfill" // 对es6api转义
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from "fastclick" // 移动端300ms点击延迟

import 'common/stylus/index.styl'
// Vue.config.productionTip = false
// 全局设置fastclick
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App) //相当于components: { App }
})
