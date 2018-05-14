import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend' // 推荐
import Singer from 'components/singer/singer' // 歌手
import Rank from 'components/rank/rank' // 排行
import Search from 'components/search/search' // 搜索


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend' // 首页路由
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
    
  ]
})
