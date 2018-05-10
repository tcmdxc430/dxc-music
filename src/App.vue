<template>
  <div id="app">
   <m-header></m-header>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from "components/m-header/m-header"
export default {
  name: 'App',
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
