---
layout: post
title: webAssembly
date: 2024-1-15
categories: 后端开发
tags: [消息队列, webAssembly]
---

## wasm介绍

2015年浏览器三大巨头Chrome、Mozilla、Microsoft共同发起WebAssembly项目，初衷是解决浏览器中的javascript性能瓶颈问题，以便更好地在浏览器端支持高性能应用。实际上早在2010年 Alon Zakai 便提出了Emscription，直到2019年W3C组织将WebAssemlby定为正式标准，此后各大浏览器厂商相继支持了WebAssembly。随着WebAssembly的发展，许多互联网公司也开始尝试在网页端实现复杂应用，并使用WebAssembly解决性能问题。

WebAssembly通过引入一种更高效的字节码格式，可以在Web浏览器中运行原生代码，从而提供比JavaScript更好的性能。

## 环境搭建

### 其他语言编译成wasm

Emscripten是一个开源的编译器工具集，支持将C/C++、Python、Haskell、Rust、Lua等语言的代码编译成WebAssembly或JavaScript文件

```bash
git clone https://github.com/juj/emsdk.git

# Linux Mac macOS
./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
./emsdk activate --global --build=Release sdk-incoming-64bit binaryen-master-64bit

# Windows
git pull
emsdk install latest
emsdk activate latest

# 验证安装成功
emcc --version
```

#### 编译命令

`emcc main.cpp -s WASM=1 -o hello.html`

> hello.wasm // 二进制的 wasm 模块代码
> hello.js // 胶水代码，包含了其他语言和 JavaScript/wasm 之间转换的 JS 文件
>hello.html // 用来加载、编译和实例化 wasm 代码并且将其输出在浏览器显示上的 HTML 文件

```
-O<level> 设置优化级别，级别0表示不进行优化，级别1-3表示进行逐步增加的优化
-s WASM=1 编译为WebAssembly模块
-s MODULARIZE=1 生成模块化的JavaScript代码
-s EXPORTED_RUNTIME_METHODS 指定模块导出的运行时方法,使用底层功能
-s EXPORTED_FUNCTIONS 指定模块导出的函数s
-o <target> 设置输出的文件格式，可以为.js、.mjs、.html、.wasm
-I <include_path> 当emcc编译源文件时，会查找所包含的头文件，该参数可指定头文件的查找路径
-L 链接到特定库
--preload-file <file> 预加载资源文件
-g 编译时添加DWARF调试信息到WebAssembly文件
```

### wat,wasm转换

> 需要安装wabt工具

```
git clone https://github.com/WebAssembly/wabt.git
cd wabt
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=DEBUG -DCMAKE_INSTALL_PREFIX=..\bin  -G "MinGW Makefiles"
cd CMakeFiles
cmake --build .. --config DEBUG --target install
```

#### wabt命令

```
wat2wasm simple.wat -o simple.wasm  wat -> wasm
wasm2wat simple.wasm -o simple.wat  wasm -> wat
wasm-validate module.wasm 验证WebAssembly模块的有效性
wasm-ld input1.wasm input2.wasm -o output.wasm 链接WebAssembly模块，并生成可执行文件或动态链接库
wasm-opt -O3 input.wasm -o output.wasm 优化WebAssembly模块，包括减少代码大小和提高性能
wasm-strip input.wasm -o output.wasm 从WebAssembly模块中删除调试信息和符号表，以减小文件大小
```

## 基本概念

> 内存最小单位页——64KB,

### wat文本格式

```
基本类型
i32:32 位整数
i64:64 位整数
f32:32 位浮点数
f64:64 位浮点数

函数定义
(func $add() (param i32) (param i32) (result f64) ... )

获取和设置局部变量和参数
local.get 0
local.set #name

导出函数
(export "add" (func $add))
(func (export "getAnswerPlus1") (result i32))

导入函数
(import "console" "log" (func $log (param i32)))

声明类型
(type $void_to_i32 (func (result i32)))

内存读写
声明内存每页64KB
(import "js" "mem" (memory 1))
(data (i32.const 0) "Hi") 定义字符串偏移位置
(func (export "writeHi")
  i32.const 0  ;; 读内存偏移位置0
  i32.const 2  ;; 读内存偏移位置2
  call $log)

wasm表格
(module 每个模块只能有一个表格
  (table 2 anyfunc) 初始大小2,存储两个任意类型引用
  (elem (i32.const 0) $f1 $f2) 初始化引用值
  (func $f1 (result i32)
    i32.const 42)
  (func $f2 (result i32)
    i32.const 13)

call_indirect $return_i32 (local.get $i)) 调用表格
```

### js接口

```javascript
var memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });
new Uint32Array(memory.buffer)[0] = 42;
new Uint32Array(memory.buffer)[0];
memory.grow(1);


// 对整数数组进行求和
var i32 = new Uint32Array(results.instance.exports.mem.buffer);
for (var i = 0; i < 10; i++) {
  i32[i] = i;
}

var sum = results.instance.exports.accumulate(0, 10);
console.log(sum);


// 表格
var tbl = results.instance.exports.tbl;
console.log(tbl.get(0)()); // 13
console.log(tbl.get(1)()); // 42

function() {
  // table section
  var tbl = new WebAssembly.Table({initial:2, element:"anyfunc"});

  // function sections:
  var f1 = function() { … }
  var f2 = function() { … }

  // elem section
  tbl.set(0, f1);
  tbl.set(1, f2);
};

```




## 示例代码(改变表格和动态链接)

shared0.wasm

```wat
(module
  (import "js" "memory" (memory 1))
  (import "js" "table" (table 1 anyfunc))
  (elem (i32.const 0) $shared0func)
  (func $shared0func (result i32)
    i32.const 0
    i32.load)
)
```
shared1.wasm

```wat
(module
  (import "js" "memory" (memory 1))
  (import "js" "table" (table 1 anyfunc))
  (type $void_to_i32 (func (result i32)))
  (func (export "doIt") (result i32)
    i32.const 0
    i32.const 42
    i32.store  ;; store 42 at address 0
    i32.const 0
    call_indirect $void_to_i32)
)
```

```javascript
fetchAndInstantiate("add.wasm").then(function (instance) {
  console.log(instance.exports.add(1, 2)); // "3"
});

// fetchAndInstantiate() found in wasm-utils.js
function fetchAndInstantiate(url, importObject) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, importObject))
    .then((results) => results.instance);
}

var importObj = {
  js: {
    memory: new WebAssembly.Memory({ initial: 1 }),
    table: new WebAssembly.Table({ initial: 1, element: "anyfunc" }),
  },
};

Promise.all([
  fetchAndInstantiate("shared0.wasm", importObj),
  fetchAndInstantiate("shared1.wasm", importObj),
]).then(function (results) {
  console.log(results[1].exports.doIt()); // prints 42
});
```
