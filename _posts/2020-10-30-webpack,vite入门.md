---
layout: post
title: webpack,vite入门
date: 2020-10-30
categories: 前端
tags: [前端开发, webpack, vite]
---

## webpack

webpack 启动构建初始化参数,加载插件,识别所有入口文件,然后根据入口文件递归处理模块并构建依赖图谱,打包成chunk

多进程构建,代码压缩,缓存,exclude,include缩小搜索/构建范围
<img src="/img/webpack.png">

### 初始化

```
1. 安装webpack(先进入项目目录)
    全局安装
    npm install -g  webpack
    项目中安装
    npm install --save-dev webpack

2. 快捷执行打包任务
    通过 npm init 初始化一个package.json文件
    在 package.json 文件中的 scripts 配置项中,添加一个脚本命令

3. 构建
   npm start
   npm run {script name}
```

### webpack优化

#### 构建时间优化
```
多进程打包 thread-loader:将thread-loader放在费资源loader前面

缓存cache-loader二次构建速度提升: 放在其他loaders前面,将缓存后面的loaders

快速定位位错误位置source-map: devtool中配置

热更新插件HotModuleReplacementPlugin

构建体积分析webpack-bundle-analyzer插件:可视化分析模块打包后的大小,gzip压缩后的大小,模块依赖关系
```

#### 打包体积优化
```
css压缩插件css-minimizer-webpack-plugin
js压缩插件terser-webpack-plugin
html压缩html-webpack-plugin
图片压缩image-webpack-loader
无用代码删除tree-sharking: webpack5生产模式默认开启,babel不能转译成es6一下的代码,要支持es6 module才有效
```

#### 用户体验优化
```
模块懒加载splitChunksPlugin:首屏请求所有资源,单页应用首屏加载慢,分块按需加载,提升首屏性能
gzip压缩插件 CompressionWebpackPlugin :后端还得设置,运输过程压缩,减少传输时间,客户端解析时间开销增加,Accept-Encoding:gzip来标识对压缩的支持
```

### 常见配置

```
module.exports = {
  // 配置source-map
  devtool: dev: 'eval-source-map', "eval"
           pro:"source-map"
  // 入口
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'lodash'
    },
    a: {
      import: './src/a.js',
      dependOn: 'lodash'
    },
    lodash: 'lodash'
  }
  // 输出
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  mode:"produciton development"
// 本地服务器
  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    hot: true, // 热更新
    port:"8080 "//监听端口
  }
// 模块切分
optimization:{
splitChunks:{
    chunks: initial 表示入口文件中非动态引入的模块,动态和静态导入打包到不同chunk
            all 表示所有模块,动态导入和静态不超出包大小打包到同一个chunk
            async 表示异步引入的模块
    minSize:'', // 拆分包的大小, 至少为minSize
    maxSize:'', // 将大于maxSize的包，拆分为不小于minSize的包
    minChunks：n, // 静态被引入的次数超过n打包
}
}
}
```

### loaders

webpack只能处理js,json文件,loaders处理特定类型文件,转换成相应模块,在bundle前打包相应模块

```
Loaders需要单独安装并且需要在webpack.config.js中的modules关键字下进行配置,Loaders的配置包括以下几方面:
加载时,数组从尾部开始执行
test:一个用以匹配loaders所处理文件的拓展名的正则表达式(必须)
use:[ loader:loader的名称(必须)]
include/exclude:手动添加必须处理的文件(文件夹)或屏蔽不需要处理的文件(文件夹)(可选)
query:为loaders提供额外的设置选项
```

#### babel

// npm 一次性安装多个依赖模块,模块之间用空格隔开
`npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react`

```
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env", "react"
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
```

#### css 模块

`npm install --save-dev style-loader css-loader`

```
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                        options: {
                            modules: true, // 指定启用css modules类名,动画名默认都只作用于当前模块
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }
                ]
            }
        ]
    }
```

#### css 预处理器

CSS 的处理平台-PostCSS 和 babel 一样也是独立于 webpack 的平台,能够一起工作
`npm install --save-dev postcss-loader autoprefixer`

```
    module: {
        rules: [
         {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            }
        ]
}
```

`npm install less-loader less --save-dev`

`npm install sass-loader node-sass --save-dev`

### 插件(Plugins)

插件(Plugins)是用来拓展 Webpack 功能,在整个构建过程中生效,类似于谷歌插件

```
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
    plugins: [
        new webpack.HotModuleReplacementPlugin(),// 热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(), // 分析和优先考虑使用最多的模块,并为它们分配最小的ID
    ],
```

`npm install --save-dev extract-text-webpack-plugin`

- - -

## vite

预构建依赖,等待 HTTP 请求,构建代码,vite 充分利用缓存加快重载

打包基于rollup,构建基于esbuild
<img src="/img/vite.png">

### 初始化

安装

`$ npm init vite@latest`

`$ yarn create vite`


### 官方提供插件

```
// vue
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()]
}


//vue jsx
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ]
}

// react
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})


//babel
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```
