
// webpack.config.js

const path = require('path');

const Timestamp = new Date().getTime();

/** 在html中引入js的插件 */
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** 打包前清除上次打包文件 */
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

/** 提取css */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** css拆分为多个css */
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');

/** vue解析 */
const vueLoaderPlugin = require('vue-loader/lib/plugin')

/** 热更新配置 */
const Webpack = require('webpack')

/** 区分是正式还是本地环境 */
const devMode = process.argv.indexOf('--mode=production') === -1;

/** 提升打包速度，多进行进行loader */
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})


module.exports = {
    /** 开发模式 
     * production模式下会进行tree shaking(去除无用代码)和uglifyjs(代码压缩混淆)
    */
    mode: devMode ? 'development' : 'production',
    /** 入口文件
     * 值为对象： 多入口文件
     * 字符串、数组
     */
    entry: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')],
    output: {
        /** 打包后的文件名称 模块名+8位随机数+时间戳 */
        filename: `[name].[hash:8].${Timestamp}.js`,
        /** 打包后目录 */
        path: path.resolve(__dirname, '../dist'),
        /** 未被列在entry中，但有些场景需要被打包出来的文件命名配置 */
        chunkFilename:'js/[name].[hash:8].js'
    },
    /** 多入口文件  数组内多个new HtmlWebpackPlugin */
    plugins:[
        /** 清除上次打包文件 */
        new CleanWebpackPlugin(),
        /** 模板配置 */
        new HtmlWebpackPlugin({
            /** 本地模板文件位置 */
            template: path.resolve(__dirname, '../public/index.html'),
            /**
             * templateContent:
             * 可以指定模板的内容，不能与template共存。配置值为function时，可以直接返回html字符串，也可以异步调用返回html字符串
             */
            /** 输出文件的文件名称，默认为index.html,可以添加相对路径 */
            filename: 'index.html',
            /** 
             * 静态资源是否增加唯一hash值 
             * <script type="text/javascript" src="common.js?a3e1396b501cdd9041be"></script>
             * */
            hash: true,
            /** 向template或者templateContent中注入所有静态资源
             * 1、true或者body：所有JavaScript资源插入到body元素的底部
             * 2、head: 所有JavaScript资源插入到head元素中
             * 3、false： 所有静态资源css和JavaScript都不会注入到模板文件中
             */
            inject: true,
            compile: true,
            /**favicon 地址*/
            favicon: false,
            /** false表示不使用HTML压缩
             * https://github.com/kangax/html-minifier#options-quick-reference
             */
            minify: false,
            /** true表示在对应的模块文件修改后就会emit文件 */
            cache: true,
            /** 
             * 是否将错误信息渲染到html
            */
            showErrors: true,
            /** 引入的模块 */
            chunks: 'all',
            /** 排除加载指定模块 */
            excludeChunks: [],
            /**
             * 模块在插入到html文档前进行排序
             * function值可以指定具体排序规则；auto基于thunk的id进行排序； none就是不排序
             */
            chunksSortMode: 'auto',
            /** 生成的html文档的标题,不会替换模板文件中的title内容 */
            title: 'Webpack App',
            /** 是否渲染link为自闭合的标签 */
            xhtml: false,
            minify: { // 压缩HTML文件
              //是否对大小写敏感，默认false
              caseSensitive: true,
              
              //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false
              collapseBooleanAttributes: true,
              
              //是否去除空格，默认false
              collapseWhitespace: true,
              
              //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
              minifyCSS: true,
              
              //是否压缩html里的js（使用uglify-js进行的压缩）
              minifyJS: true,
              
              //Prevents the escaping of the values of attributes
              preventAttributesEscaping: true,
              
              //是否移除属性的引号 默认false
              removeAttributeQuotes: true,
              
              //是否移除注释 默认false
              removeComments: true,
              
              //从脚本和样式删除的注释 默认false
              removeCommentsFromCDATA: true,
              
              //是否删除空属性，默认false
              removeEmptyAttributes: true,
              
              //  若开启此项，生成的html中没有 body 和 head，html也未闭合
              removeOptionalTags: false, 
              
              //删除多余的属性
              removeRedundantAttributes: true, 
              
              //删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
              removeScriptTypeAttributes: true,

              //删除style的类型属性， type="text/css" 同上
              removeStyleLinkTypeAttributes: true,
              //使用短的文档类型，默认false
              useShortDoctype: true,
            },
        }),
        /** css配置 */
        new MiniCssExtractPlugin({
          filename: devMode ? '[name].css' : '[name].[hash].css',
          chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        indexLess,
        indexCss,
        new vueLoaderPlugin(),
        new Webpack.HotModuleReplacementPlugin(),

        /** 多进程解析js loader */
        new HappyPack({
          /** 用id来标识 happypack处理那里类文件 */ 
          id: 'happyBabel',
          /**如何处理  用法和loader 的配置一样 */
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env']
                ],
                cacheDirectory: true
              }
            }
          ],
          // 允许 HappyPack 输出日志
          // verbose:true,
          threadPool: happyThreadPool //共享进程池
        })
    ],
    /** loader配置
     * postcss-loader autoprefixer 第二种配置
     * 新建postcss.config.js文件
     * 内容： module.exports = {
                plugins: [require('autoprefixer')]  // 引用该插件即可了
            }
     */
    module: {
        rules: [
            {
              test:/\.css$/,
              // use: indexCss.extract({
              //   use: ['css-loader']
              // })
              use:[{
                loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                options:{
                  publicPath:"../dist/css/",
                  hmr:devMode
                }
              },'css-loader',{
                loader:'postcss-loader',
                options:{
                  plugins:[require('autoprefixer')]
                }
              }]
            },
            {
                test: /\.less$/,
                // use: indexLess.extract({
                //   use: ['css-loader','less-loader']
                // })
                use:[{
                  loader:devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                  options:{
                    publicPath:"../dist/css/",
                    hmr:devMode
                  }
                },'css-loader','less-loader',{
                  loader:'postcss-loader',
                  options:{
                    plugins:[require('autoprefixer')]
                  }
                }]
            },
            {
                test: /\.(jpe?g|png|gif)$/i, //图片文件
                use: [
                  {
                      /** 插件 */
                    loader: 'url-loader',
                    options: {
                        /** 文件大小 */
                      limit: 10240,
                      esModule: false,
                      name: 'img/[name].[hash:8].[ext]'
                      // fallback: {
                      //     /** 插件 */
                      //   loader: 'file-loader',
                        
                      //   options: {
                      //       name: 'img/[name].[hash:8].[ext]'
                      //   }
                      // }
                    }
                  }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                          name: 'media/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                          name: 'fonts/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
                ]
            },
            {
                test:/\.js$/,
                use:{
                  // loader: 'happypack/loader?id=happyBabel',
                  loader:'babel-loader',
                  options:{
                    presets:['@babel/preset-env']
                  }
                },
                exclude:/node_modules/
            },
            {
                test:/\.vue$/,
                use:['cache-loader','thread-loader',{
                    loader:'vue-loader',
                    options:{
                        compilerOptions:{
                            preserveWhitespace:false
                        }
                    }
                }]
            }
        ]
    },
    resolve:{
        /** 通过别名来把原导入路径映射成一个新的导入路径
         * vue$ 只会选中 import 'vue'  =》  替换 import 'url'
         */
        alias:{
          'vue$':'vue/dist/vue.runtime.esm.js',
          '@':path.resolve(__dirname,'../src')
        },
        /** 导入的文件没有后缀，webpack会尝试自动加入配置内的后缀访问文件 */
        extensions:['*','.js','.json','.vue'],
        /**
         * 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去  node_modules  目录下寻找
         * modules: ['./src/components','node_modules']
         * 
         * 描述第三方模块的文件名称，也就是  package.json  文件
         * descriptionFiles: ['package.json']
         * 
         * true:所有导入语句都必须要带文件后缀
         * enforceExtension: true or false
         * 
         * 只针对node_modules下的模块，导入语句是否必须要带文件后缀
         * enforceModuleExtension: true or false
         */
    },
    stats: { children: false },
    /** 热更新配置 */
    devServer:{
        /** 是否自动打开浏览器，默认true */
        open: false,
        port:3000,
        /** 模块热更新 */
        hot:true,
        contentBase:'../public',
        /** 一下两项配置需要修改 package.json 的scripts 配置*/
        /**
         * 用于配置自动打开指定URL的网页
         * openPage:
         * 
         * 配置项用于配置DevServer服务器监听的地址
         * host：
         */
    },
}