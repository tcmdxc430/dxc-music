import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend' // 推荐
// import Singer from 'components/singer/singer' // 歌手
// import Rank from 'components/rank/rank' // 排行
// import Search from 'components/search/search' // 搜索
// import SingerDetail from 'components/singer-detail/singer-detail' // 歌手详情
// import Disc from 'components/disc/disc'// 推荐页二级路由
// import TopList from 'components/top-list/top-list'//排行详情二级路由
// import UserCenter from 'components/user-center/user-center'// 个人中心



Vue.use(Router)
// 按需加载组件
const Recommend = (resolve)=>{
  import('components/recommend/recommend').then((module)=>{
    resolve(module)
  })
}
const Singer = (resolve)=>{
  import('components/singer/singer').then((module)=>{
    resolve(module)
  })
}
const Rank = (resolve)=>{
  import('components/rank/rank').then((module)=>{
    resolve(module)
  })
}
const Search = (resolve)=>{
  import('components/search/search').then((module)=>{
    resolve(module)
  })
}
const SingerDetail = (resolve)=>{
  import('components/singer-detail/singer-detail').then((module)=>{
    resolve(module)
  })
}
const Disc = (resolve)=>{
  import('components/disc/disc').then((module)=>{
    resolve(module)
  })
}
const TopList = (resolve)=>{
  import('components/top-list/top-list').then((module)=>{
    resolve(module)
  })
}
const UserCenter = (resolve)=>{
  import('components/user-center/user-center').then((module)=>{
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend' // 首页路由
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:':id', // 路径为/recommend/:id
          component:Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      // 子路由
      children: [
        {
          // 主路由加id参数跳转不同页面
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      // 子路由
      children: [
        {
          // 主路由加id参数跳转不同页面
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path:'/user',
      component:UserCenter
    }
    
  ]
})
