const path = require('path')
const webpackConfig = require('./webpack.config.js')

/** 合并 */
const WebpackMerge = require('webpack-merge')

/** 拷贝静态资源 */
const CopyWebpackPlugin = require('copy-webpack-plugin')

/** 压缩css */
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/** 压缩js */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge(webpackConfig,{
  mode:'production',
  devtool:'cheap-module-source-map',
  plugins:[
    new CopyWebpackPlugin([{
      from:path.resolve(__dirname,'../public'),
      to:path.resolve(__dirname,'../dist')
    }]),
  ],
  optimization:{
    minimizer:[
      new UglifyJsPlugin({//压缩js
        cache:true,
        parallel:true,
        sourceMap:true
    }),
    new OptimizeCssAssetsPlugin({})
    ],
    splitChunks:{
      chunks:'all',
      cacheGroups:{
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        }
      }
    }
  }
})