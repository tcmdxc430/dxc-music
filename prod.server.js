//模拟线上的node服务
var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()
//定义路由
var apiRoutes = express.Router()
//代理请求，先请求本地服务 再去请求线上服务
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      // 用相同的域名绕过qq的拒绝
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // 将qq返回数据透传到本地接口
    res.json(response.data)
  }).catch((e) => {
    // 打印错误信息
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
// 设置接口地址为/api
app.use('/api', apiRoutes)

// module.exports = {
//     proxyTable: {
//         '/api/getDiscList':{
//           target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
//           bypass: function(req,res,proxyOptions) {
//             req.headers.referer = 'https://c.y.qq.com/';
//             req.headers.host = 'c.y.qq.com';
//           },
//           pathRewrite: {
//             '/api/getDiscList':''
//           }
//         },
//         '/api/getMusic':{
//           target: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
//           bypass: function(req,res,proxyOptions) {
//             req.headers.referer = 'https://c.y.qq.com/';
//             req.headers.host = 'c.y.qq.com';
//           },
//           pathRewrite: {
//             '/api/getMusic':''
//           }
//         },
//         '/api/lyric':{
//           target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',
//           bypass: function(req,res,proxyOptions) {
//             req.headers.referer = 'https://c.y.qq.com/';
//             req.headers.host = 'c.y.qq.com';
//           },
//           pathRewrite: {
//             '/api/lyric':''
//           }
//         },
//         '/api/getSongList':{
//           target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
//           bypass: function(req,res,proxyOptions) {
//             req.headers.referer = 'https://c.y.qq.com/';
//             req.headers.host = 'c.y.qq.com';
//           },
//           pathRewrite: {
//             '/api/getSongList':''
//           }
//         }
//       },
// }

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port,function(err) {
    if(err) {
        console.log(err)
        return
    }
    console.log('listening at http://localhost:'+port+'\n')
})