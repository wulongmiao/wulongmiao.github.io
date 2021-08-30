---
layout: post
title: TypeScript入门
date: 2021-8-20
categories: 前端开发
tags: [JS超集,TypeScript]
---

## 安装

国内镜像
`npm config set registry https://registry.npm.taobao.org`

npm
`npm install -g typescript`

## 基础类型

any
```
let x: any = 1;    // 数字类型
x = 'I am who I am';    // 字符串类型
x = false;    // 布尔类型
```

number
```
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o744;    // 八进制
let decLiteral: number = 6;    // 十进制
```

string
```
let name: string = "Runoob";
let years: number = 5;
let words: string = `您好，今年是 ${ name } 发布 ${ years + 1} 周年`;
```

boolean
```
let flag: boolean = true;
```

[]
```
// 在元素类型后面加上[]
let arr: number[] = [1, 2];

// 或者使用数组泛型
let arr: Array<number> = [1, 2];
```

元组:数组内元素类型可以自定义
```
let x: [string, number];
x = ['Runoob', 1];    // 运行正常
x = [1, 'Runoob'];    // 报错
console.log(x[0]);    // 输出 Runoob
```

枚举enum
```
enum Color {Red, Green, Blue};
let c: Color = Color.Blue;
console.log(c);    // 输出 2
```

void
```
function hello(): void {
    alert("Hello Runoob");
}
```

## 联合类型
通过管道(|)将变量设置多种类型，赋值时可以根据设置的类型来赋值
```
var val:string|number 
val = 12 
console.log("数字为 "+ val) 
val = "Runoob" 
console.log("字符串为 " + val)
```

## 接口
接口中我们可以将数组的索引值和元素设置为不同类型，索引值可以是数字或字符串
```
interface interface_name { 
}

interface IPerson { 
    firstName:string, 
    lastName:string, 
    sayHi: ()=>string 
} 
 
var customer:IPerson = { 
    firstName:"Tom",
    lastName:"Hanks", 
    sayHi: ():string =>{return "Hi there"} 
} 
```

## 命名空间
```
namespace SomeNameSpaceName { 
   export interface ISomeInterfaceName {      }  
   export class SomeClassName {      }  
}
```

## 声明文件
```
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any;

jQuery('#foo');


declare module Module_Name {
}

declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明全局对象（含有子属性）
interface 和 type 声明全局类型
```







