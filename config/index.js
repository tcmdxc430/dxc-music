'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 代理
    proxyTable: {
      '/api/getDiscList':{
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getDiscList':''
        }
      },
      '/api/getMusic':{
        target: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getMusic':''
        }
      },
      '/api/lyric':{
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/lyric':''
        }
      },
      '/api/getSongList':{
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getSongList':''
        }
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    port: 9000,

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',//可配置线上公共cdn域名

    // Paths
    // assetsSubDirectory: 'static',
    // 代理
    proxyTable: {
      '/api/getDiscList':{
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getDiscList':''
        }
      },
      '/api/getMusic':{
        target: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getMusic':''
        }
      },
      '/api/lyric':{
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/lyric':''
        }
      },
      '/api/getSongList':{
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        bypass: function(req,res,proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com/';
          req.headers.host = 'c.y.qq.com';
        },
        pathRewrite: {
          '/api/getSongList':''
        }
      }
    },

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
