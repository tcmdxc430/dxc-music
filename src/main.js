import "babel-polyfill" // 对es6api转义
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from "fastclick" // 移动端300ms点击延迟
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'
// Vue.config.productionTip = false
// 全局设置fastclick
fastclick.attach(document.body)
// 初始化lazyload
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) //相当于components: { App }
})
