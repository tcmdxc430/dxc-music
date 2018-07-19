<!--  created by dongxc on 2018// -->
<template>
<!-- 歌手tabs -->
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
//   components: {},

//   computed: {},

  // mounted() {
    
  // }, 

  methods: {
    // 歌手数据 
    _getSingerList() {
      getSingerList().then((res) => {
        if(res.code === 0) {
          // 传入已改造数据
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 数据结构改造为热门+字母排序
    _normalizeSinger(list) {
      // 热门数据
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // forEach大写
      list.forEach((item,index) => {
        if(index<HOT_SINGER_LEN) {
          // 头像地址统一放在singer类中
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 按字母排序数据
        const key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 头像地址统一放在singer类中
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
      })
      // 得到列表不符合设计
      console.log(map)
      // 处理map得到符合设计（热门+字母列表）有序列表
      let hot = []
      let ret = []
      for(let key in map) {
        // 遍历出集合
        let val = map[key]
        // 如果校验到有字母
        if(val.title.match(/[a-zA-Z]/)){
          // 即字母排序数组
          ret.push(val)
        }else if(val.title === HOT_NAME) {
          // 即热门数组
          hot.push(val)
        }
      }
      ret.sort((a,b) => {
        // charCodeAt(0)返回第一个字符的Unicode
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  }
}

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  // 固定父容器高度，方便bs滚动
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>