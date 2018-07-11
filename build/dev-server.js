require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
// +++++++++++++++++++
var axios = require('axios')


var port = process.env.PORT || config.dev.port

var autoOpenBrowser = !!config.dev.autoOpenBrowser

var proxyTable = config.dev.proxyTable

var app = express()
//定义路由
var apiRoutes = express.Router()
//代理请求，先请求本地服务 再去请求线上服务
// apiRoutes.get('/getDiscList', function (req, res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   axios.get(url, {
//     headers: {
//       // 用相同的域名绕过qq的拒绝
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     // 将qq返回数据透传到本地接口
//     res.json(response.data)
//   }).catch((e) => {
//     // 打印错误信息
//     console.log(e)
//   })
// })

// apiRoutes.get('/lyric', function (req, res) {
//   var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

//   axios.get(url, {
//     headers: {
//       referer: 'https://c.y.qq.com/',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     var ret = response.data
//     if (typeof ret === 'string') {
//       var reg = /^\w+\(({[^()]+})\)$/
//       var matches = ret.match(reg)
//       if (matches) {
//         ret = JSON.parse(matches[1])
//       }
//     }
//     res.json(ret)
//   }).catch((e) => {
//     console.log(e)
//   })
// })
// 设置接口地址为/api
app.use('/api', apiRoutes)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
