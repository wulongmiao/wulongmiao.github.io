---
layout: post
title: webpack,gulp使用
date:  2020-10-30
categories: 前端
tags: [前端开发,webpack,gulp]
---
## 前言

Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。
Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。

## webpack

### 初始化

```
1. 安装webpack(先进入项目目录)
    全局安装
    npm install -g  webpack
    项目中安装
    npm install --save-dev webpack

2. 快捷执行打包任务
    通过 npm init 初始化一个package.json文件
    在 package.json 文件中的 scripts 配置项中，添加一个脚本命令

3. 构建
   npm start
   npm run {script name}  
```

### 生成Source Maps

```
Source Maps找到错误代码的位置
开发环境eval-source-map  cheap-module-eval-source-map 
生产环境cheap-module-source-map 
congfig中配置  devtool: 'source-map' |'cheap-module-source-map' |  'eval-source-map' | 'cheap-module-eval-source-map'
``` 

### 本地服务器

监听代码需要安装组件，基于node.js
`npm install --save-dev webpack-dev-server`

```
config文件中：
module.exports = {
  devtool: 'eval-source-map',

  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
    port:"8080 "//监听端口    
  } 
}

package.json中的scripts对象中添加如下命令，用以开启本地服务器：
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server": "webpack-dev-server --open"
  },

npm run server
```

### loaders

```
Loaders需要单独安装并且需要在webpack.config.js中的modules关键字下进行配置，Loaders的配置包括以下几方面：
加载时，数组从尾部开始执行
test：一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
use:[ loader：loader的名称（必须）]
include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
query：为loaders提供额外的设置选项
```

#### babel

// npm一次性安装多个依赖模块，模块之间用空格隔开
`npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react`

```
module.exports = {
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
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
};
```

##### css模块

`npm install --save-dev style-loader css-loader`

```
//使用
module.exports = {

   ...
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
                            modules: true, // 指定启用css modules类名，动画名默认都只作用于当前模块
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }
                ]
            }
        ]
    }
};
```

##### css预处理器

CSS的处理平台-PostCSS 和babel一样也是独立于webpack的平台，能够一起工作
`npm install --save-dev postcss-loader autoprefixer`

```
//webpack.config.js
module.exports = {
    ...
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
}
```

`npm install less-loader less --save-dev`

`npm install sass-loader node-sass --save-dev`

### 插件(Plugins)

插件（Plugins）是用来拓展Webpack功能,在整个构建过程中生效,类似于谷歌插件

```
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
...
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
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }, {
                        loader: "postcss-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css")
    
    ],
};
```

```
优化插件
    内置插件
        OccurenceOrder webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        UglifyJS plugins压缩JS代码
ExtractTextPlugin 分离CSS和JS文件
```
`npm install --save-dev extract-text-webpack-plugin`

## 缓存

使用缓存的最好方法是保证你的文件名和文件内容是匹配的（内容改变，名称相应改变）
```
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
 
module.exports = {

    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
     plugins: [
    ...// 这里是之前配置的其它各种插件
    new CleanWebpackPlugin('build/*.*', {
      root: __dirname,
      verbose: true,
      dry: false
  })
  ]
};
```

改变文件内容后重新打包时，文件名不同而内容越来越多

`cnpm install clean-webpack-plugin --save-dev`

## gulp

### 安装

```
全局安装
npm install -g gulp
项目目录中安装
npm install --save-dev gulp
```

### 使用

1.建立gulpfile.js文件
```
var gulp = require('gulp');
gulp.task('default',function(){
    console.log('hello world');
});
```
2.运行gulp任务
在控制台切换到存放gulpfile.js文件的目录，然后在命令行中执行 `gulp + 任务名`

### 常用API

gulp.src()

```
gulp.src(globs[, options])
globs参数是文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
options为可选参数
```

gulp.task()

```
gulp.task(name[, deps], fn)
name 为任务名
deps 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数
fn 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。
```

gulp.dest() 

```
gulp.dest(path[,options])
path为写入文件的路径
options为一个可选的参数对象

var gulp = require('gulp');
gulp.src('script/jquery.js')
    .pipe(gulp.dest('dist/foo.js'));
//最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
```

gulp.watch()

```
gulp.watch(glob[, opts], tasks)
glob 为要监视的文件匹配模式，规则和用法与gulp.src()方法中的glob相同。
opts 为一个可选的配置对象，通常不需要用到
tasks 为文件变化后要执行的任务，为一个数组
```

### 常用插件

自动加载

`npm install --save-dev gulp-load-plugins`

```
var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
```

js文件压缩

`npm install --save-dev gulp-uglify`
```
var gulp = require('gulp'),
    uglify = require("gulp-uglify");
 
gulp.task('minify-js', function () {
    gulp.src('js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(gulp.dest('dist/js')); //压缩后的路径
});
```

css压缩

`npm install --save-dev gulp-minify-css`

```
var gulp = require('gulp'),
    minifyCss = require("gulp-minify-css");
 
gulp.task('minify-css', function () {
    gulp.src('css/*.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(gulp.dest('dist/css'));
});
```

html压缩

`npm install --save-dev gulp-minify-html`

```
var gulp = require('gulp'),
    minifyHtml = require("gulp-minify-html");
 
gulp.task('minify-html', function () {
    gulp.src('html/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('dist/html'));
});
```

文件合并

`npm install --save-dev gulp-concat`

```
var gulp = require('gulp'),
    concat = require("gulp-concat");
 
gulp.task('concat', function () {
    gulp.src('js/*.js')  //要合并的文件
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/js'));
});
```

less和sass的编译

`npm install --save-dev gulp-less`

```
var gulp = require('gulp'),
    less = require("gulp-less");
 
gulp.task('compile-less', function () {
    gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'));
});
```

`npm install --save-dev gulp-sass`

```
var gulp = require('gulp'),
    sass = require("gulp-sass");
 
gulp.task('compile-sass', function () {
    gulp.src('sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});
```

图片压缩

`npm install --save-dev gulp-imagemin`

```
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

gulp.task('default', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist'));
});
```