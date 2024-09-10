const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV == 'production' ? './' : '/',
  devServer:{  
    port:8081    //要修改的端口号
  }
})
