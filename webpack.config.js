var HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const path = require('path');
const webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ROOT_PATH = path.resolve(__dirname) // eslint-disable-line
var NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

var entry = {};
var output = {};
var cache = true;
var plugins = [];
var devtool = false;
var devServer = {};

/* 获取启动命令中的当前环境设置 */
var envIndex = process.argv.indexOf('--env');
var env = envIndex !== -1 ? process.argv[envIndex + 1] : undefined;
process.env.NODE_ENV = env === 'pro' ? 'production' : 'development';

if (process.env.NODE_ENV === 'production') {
  entry = {
    app: [
      // 'babel-polyfill',
      path.resolve(__dirname, 'src/views/a/app.js'),
    ],
  };

  output = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js',
    /* 图片等文件的引用路径 */
    // publicPath: '/React-demo/build/',
  };

  cache = false;

  devtool = 'source-map';

  devServer = {};

  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      /* 最紧凑的输出 */
      beautify: false,
      /* 删除所有的注释 */
      comments: false,
      /* 已经压缩过的文件不再次进行压缩 */
      exclude: /\.min\.js$/,

      sourceMap: true,

      compress: {
        /* 消除产生警告的代码，此类代码多来自于引用的模块内部 */
        warnings: false,
        // 删除所有的 `console` 语句，还可以兼容ie浏览器
        drop_console: true,
        /* 内嵌定义了但是只用到一次的变量 */
        collapse_vars: true,
        /* 提取出出现多次但是没有定义成变量去引用的静态值 */
        reduce_vars: true,
      },
      /* 去除注释 */
      output: {
        comments: false
      },
    }),
    //提取第三方库
    // new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),

    /* 尽量合并代码 */
    new webpack.optimize.AggressiveMergingPlugin(),
    /* 允许错误不打断程序的执行，这在生产环境中很重要 */
    new webpack.NoEmitOnErrorsPlugin(),

    /* 将 CSS 代码单独抽离出来 */
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles.[hash].css',
    }),

    /* 与 extract-text-webpack-plugin 协同工作，压缩 CSS 代码 */
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
    }),

    /* 打包时不再将整个 lodash 完全打包生成的文件中，而是仅将 lodash 中使用到的函数文件打包到生成文件中 */
    /* 相当于该插件代替开发人员手动筛选要引用的 lodash 中的文件 */
    new LodashModuleReplacementPlugin({
      paths: true,
      flattening: true,
    }),

    new HappyPack({
      id: 'js',
      threads: 2,
      loaders: ['babel-loader'],
    }),

    /* 每次编译生产环境代码时先将之前的文件删除掉 */
    new CleanWebpackPlugin(
      [
        'dist/app.*.js',
        'dist/*.chunk.js',
        'dist/styles.*.css',
        'dist/styles.*.css.map',
      ], {
        verbose: true,
        dry: false,
      }
    ),
    /* 开启作用域提升功能 */
    new webpack.optimize.ModuleConcatenationPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      title: 'This is app',
      chunks: ['app'],
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
  ]
} else {

  entry = {
    app: [
      // 'babel-polyfill',
      path.resolve(__dirname, 'src/views/a/app.js'),
    ],
  };

  output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js',
    /* 图片等文件的引用路径 */
    // publicPath: '/React-demo/build/',
  };

  cache = true;

  devtool = 'inline-source-map';

  devServer = {
    /* 暂时使用不到这个设置 */
    // headers: { 'X-Custom-Header': 'yes' },
    /* 设置为 true 后所有的跳转都将指向 index.html */
    // historyApiFallback: true,
    host: 'localhost',
    hot: true,
    inline: true,
    port: 9000,
    /* 请求代理 */
    proxy: {
      '/api/*': {
        target: 'http://localhost:7000',
        secure: false,
      },
    },
    publicPath: '/',
  };

  plugins = [
    /* 可以在编译时期创建全局变量 */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    // new webpack.optimize.UglifyJsPlugin({
    /* 最紧凑的输出 */
    //   beautify: false,
    //   /* 删除所有的注释 */
    //   comments: false,
    //   /* 已经压缩过的文件不再次进行压缩 */
    //   exclude: /\.min\.js$/,
    //   sourceMap: true,
    //   compress: {
    //      // 消除产生警告的代码，此类代码多来自于引用的模块内部 
    //      warnings: false,
    //      // 删除所有的 `console` 语句，还可以兼容ie浏览器
    //      drop_console: true,
    //      /* 内嵌定义了但是只用到一次的变量 */
    //      collapse_vars: true,
    //      /* 提取出出现多次但是没有定义成变量去引用的静态值 */
    //      // reduce_vars: true,
    //    },
    //   /* 去除注释 */
    //   output: { comments: false },
    // }),

    /* 在组件热加载的时候显示更新的组件名而不是原本的组件 ID */
    new webpack.NamedModulesPlugin(),
    /* 以可视化的方式查看当前项目中引用的各个模块的大小 */
    // new BundleAnalyzerPlugin(),

    /* 通过多线程的方式快速编译代码 */
    new HappyPack({
      id: 'js',
      threads: 2,
      loaders: ['babel-loader?cacheDirectory'],
    }),
    /* 开启作用域提升功能 */
    new webpack.optimize.ModuleConcatenationPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      title: 'This is index',
      chunks: ['app'],
      inject: 'body'
    })
  ]
}

module.exports = {
  /* 入口文件 */
  entry,
  /* 出口文件 */
  output,
  /* 设置缓存是否开启，当前设置是在开发环境下缓存开启 */
  cache,
  /* 源代码与编译后代码的匹配模式 */
  devtool,
  /* 开发工具 */
  devServer,
  /* 插件 */
  plugins,

  resolve: {
    alias: {
      jquery: path.resolve(__dirname, 'src/js/jquery.js')
    }
  },
  /* 针对不同的文件类型配置不同的 loader，并设置对应的配置项 */
  module: {
    loaders: [
      /* 暂时先把 Eslint 关掉，这玩意太蛋疼了 */
      // {
      //   enforce: 'pre',
      //   test: /\.(js|jsx)$/i,
      //   loaders: ['eslint-loader'],
      //   exclude: NODE_MODULES_PATH,
      // },
      {
        test: /\.js$/i,
        loaders: (process.env.NODE_ENV === 'production' ? ['happypack/loader?id=js'] : ['babel-loader?cacheDirectory']), // eslint-disable-line
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.css$/i,
        loaders: (process.env.NODE_ENV === 'production' ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader?camelCase&modules&sourceMap&importLoaders=1&localIdentName=[hash:5]',
              'postcss-loader',
            ],
          }) : [ // eslint-disable-line
            'style-loader', // eslint-disable-line
            'css-loader?camelCase&modules&sourceMap&importLoaders=1&localIdentName=[path][local]-[hash:5]', // eslint-disable-line
            'postcss-loader', // eslint-disable-line
          ] // eslint-disable-line
        ),
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        exclude: NODE_MODULES_PATH,
        use: 'html-loader'
      },
      {
        test: /\.scss$/i,
        loaders: (process.env.NODE_ENV === 'production' ?
          (
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader?camelCase&modules&sourceMap&importLoaders=2&localIdentName=[hash:5]',
                'postcss-loader',
                'sass-loader',
              ],
            })
          ) : (
            [ // eslint-disable-line
              'style-loader', // eslint-disable-line
              'css-loader?camelCase&modules&sourceMap&importLoaders=2&localIdentName=[path][local]-[hash:5]', // eslint-disable-line
              'postcss-loader', // eslint-disable-line
              'sass-loader', // eslint-disable-line
            ] // eslint-disable-line
          )
        ),
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.less$/i,
        loaders: (process.env.NODE_ENV === 'production' ?
          (
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader',
                // 'postcss-loader',
                'less-loader',
              ],
            })
          ) : (
            [ // eslint-disable-line
              'style-loader', // eslint-disable-line
              'css-loader', // eslint-disable-line
              // 'postcss-loader',  // eslint-disable-line
              'less-loader', // eslint-disable-line
            ]
          )
        ),
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        // loaders: 'url-loader?limit=4096&name=assets/[hash].[ext]',
        use: [{
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ],
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        loader: 'url-loader?limit=1000&name=fonts/[name]-[hash].[ext]',
        exclude: NODE_MODULES_PATH,
      },
      {
        test: /\.(mp4|ogg|mp3)$/i,
        loader: 'file-loader?name=videos/[name]-[hash].[ext]',
        exclude: NODE_MODULES_PATH,
      },
    ],
  },
  resolve: {
    /* 可能用到的文件扩展名 */
    extensions: ['.js', '.scss', '.jsx', '.css', '.less'],
    /* 文件路径别名，方便在写代码时对模块的引用 */
    /* 直接写明 node_modules 的全路径 */
    modules: [NODE_MODULES_PATH],
    alias: {
      logo: path.resolve(__dirname, 'src/views/a/image')
    }
  },
}




// const config = {
//   entry:  {
//     app: [
//       path.resolve(__dirname, './src/views/app.js')
//     ]
//   },
//   output: {
//   	path: path.resolve(__dirname, './dist'),
//   	filename: 'js/[name]-[hash].js',
//     // publicPath: 'http://bluespace/'
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         include: path.resolve(__dirname, 'src'),
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['env'],
//             plugins: ['transform-runtime']
//           }
//         }
//       },
//       {
//         test: /\.html$/,
//         include: path.resolve(__dirname, 'src'),
//         exclude: /(node_modules|bower_components)/,  
//         use: 'html-loader' 
//       },
//       {
//         test: /\.less$/,
//         exclude: /(node_modules|bower_components)/,
//         include: path.resolve(__dirname, 'src'),
//         use: [{
//             loader: "style-loader" // creates style nodes from JS strings
//         }, {
//             loader: "css-loader" // translates CSS into CommonJS
//         }, 
//         {
//             loader: "postcss-loader", // compiles Less to CSS
//             options: {
//               ident: 'postcss',
//               plugins: (loader) => [
//                 require('autoprefixer')()
//               ]
//           }
//         },
//         {
//             loader: "less-loader" // compiles Less to CSS
//         }]
//       },
//       {
//         test: /\.scss$/,
//         exclude: /(node_modules|bower_components)/,
//         use: [{
//             loader: "style-loader" // creates style nodes from JS strings
//         }, {
//             loader: "css-loader" // translates CSS into CommonJS
//         },
//         {
//           loader: "postcss-loader", // compiles Less to CSS
//             options: {
//               ident: 'postcss',
//               plugins: (loader) => [
//                 require('autoprefixer')()
//               ]
//           }
//         },
//         {
//             loader: "sass-loader" // compiles Sass to CSS
//         }]
//       },
//       { 
//         test: /\.css$/, 
//         use: 'css-loader' 
//       },
//       { 
//         test: /\.ts$/, 
//         exclude: /(node_modules|bower_components)/,
//         use: 'ts-loader'
//       },
//       {
//         test: /\.(png|jpg|gif|svg)$/,
//         use: [{
//           loader: 'url-loader',
//           options: {
//             limit: 20000,
//             name: 'assets/[name]-[hash].[ext]'
//           }
//         },
//         {
//           loader: 'image-webpack-loader'
//         }]
//       },
//       {
//         test: /\.(woff|eot|svg|ttf|woff|woff2)\??.*$/,
//         exclude: /(node_modules|bower_components)/,
//         use: 'file-loader',
//       }
//     ]
//   },
//   resolve: {
//       alias: {
//           jquery: path.resolve(__dirname, 'src/js/jquery')
//       }
//   },
//   plugins: [
//      new HtmlWebpackPlugin({
//       filename: 'index.html',
//      	template: 'index.html',
//       title: 'This is index',
//       chunks: ['main'],
//       inject: 'body'
//      }),
//     new webpack.ProvidePlugin({
//       $:"jquery",
//       jQuery:"jquery",
//       "window.jQuery":"jquery"
//     }),

//     new webpack.HotModuleReplacementPlugin()
//   ],
//   // devServer: {
//   //   colors: true,
//   //   historyApiFallback: true,
//   //   inline: true,
//   //   hot: true,
//   //   contentBase: './src'
//   // }
// }