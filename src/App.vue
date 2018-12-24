<template>
  <div id="app">
   <m-header></m-header>
   <Tab></Tab>
   <!-- 将跳转数据缓存 -->
   <keep-alive>
   <router-view></router-view>
   </keep-alive>
   <!-- 全局组件，切换路由将不影响播放 -->
   <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from "components/m-header/m-header"
import Tab from "components/tab/tab"
import Player from 'components/player/player';
  export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
