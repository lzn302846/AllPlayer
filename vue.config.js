const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      'nc-server': { /// info/api/user/loginin
        target: 'http://116.62.131.181:7011', // 公司
        // target:"http://47.96.0.211:3000", // QDQF
        changeOrigin: true,
        pathRewrite: {
          '^/info': ''
        }
      }
    }
  },
  runtimeCompiler: true,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@mixins', resolve('src/mixins'))
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890F7',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  // devServer:{
  //   open:true
  // }
  publicPath: './'
}
