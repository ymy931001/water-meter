'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': { //测试
      //   target: "http://119.23.209.195:9097", 
			// 	changeOrigin: true, 
			// 	pathRewrite: { 
			// 		'^/api': "http://119.23.209.195:9097" 
      //     }
      //   },
      '/api': { //服务器
        target: "http://wxback.everqin.com:8040", 
        changeOrigin: true, 
        pathRewrite: { 
          '^/api': "http://wxback.everqin.com:8040" 
          }
        },
      // '/api': { //本地 不走网关
      //   target: "http://192.168.31.181:9097", 
			// 	changeOrigin: true, 
			// 	pathRewrite: { 
			// 		'^/api': "http://192.168.31.181:9097" 
      //     }
      //   },
      '/login': { //本地 不走网关
        target: "http://47.99.206.94:9097", 
				changeOrigin: true, 
				pathRewrite: { 
					'^/login': "http://47.99.206.94:9097" 
          }
        },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
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
    index: path.resolve(__dirname, '../build/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../build'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',

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
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
