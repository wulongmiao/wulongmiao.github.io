---
layout: post
title: electron
date: 2023-8-18
categories: 前端开发
tags: [electron]
---

## 快速开始

`pnpm create @quick-start/electron`

参考 [官方文档](https://www.electronjs.org/zh/docs/latest/README)

## 进程间通信

```
渲染进程到主进程:
// 渲染进程中使用ipcRenderer模块发送消息
const { ipcRenderer } = require('electron');
ipcRenderer.send('testMessage', 'some data');
ipcRenderer.sendSync('testMessage', 'some data');

// 主进程中使用ipcMain监听这些消息
const { ipcMain } = require('electron');
ipcMain.on('testMessage', (event, arg) => {
  event.returnValue = 'response data'; // 返回数据给渲染进程
  console.log(arg); // 输出: some data
});


主进程到渲染进程:
// 主进程发送消息
ipcMain.on('send-message', (event, arg) => {
  event.reply('send-reply', 'reply data');
});

// 渲染进程监听回应
ipcRenderer.on('send-reply', (event, arg) => {
  console.log(arg); // 输出: reply data
});


webContents:
// 假设你已经有了一个BrowserWindow实例叫做win
win.webContents.send('channel-test', '发送消息');

const { ipcRenderer } = require('electron');
ipcRenderer.on('channel-test', (event, data) => {
  console.log(data);
});


remote方法跨进程通信:
import {remote} from 'electron'
JSON.stringify(remote.getGlobal('foo'))


隔离的上下文中创建一个安全的、双向的、同步的桥梁contextBridge:
// 预加载脚本 (preload.js)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),
  onReply: (callback) => ipcRenderer.on('reply', callback)
})

// 渲染进程
window.electronAPI.sendMessage('Hello from renderer')
window.electronAPI.onReply((event, arg) => {
  console.log(arg) // 打印 "Hello from main"
})

// 主进程
ipcMain.on('message', (event, arg) => {
  console.log(arg) // 打印 "Hello from renderer"
  event.sender.send('reply', 'Hello from main')
})


MessagePort API


自定义协议或WebSocket
```

## 性能优化

```
骨架屏
懒加载
压缩代码
tree-sharking
频繁开启/关闭的窗口使用窗口池
避免使用electron-builder
资源缓存
分离CPU密集型操作到单独进程或Worker, 避免主进程
尽量避免同步操作(同步的文件操作、进程间通信, 尽量避免使用remote)
```
