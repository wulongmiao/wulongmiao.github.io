---
layout: post
title: TypeScript入门
date: 2021-8-20
categories: 前端开发
tags: [JS超集, TypeScript, 类型检查]
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
let words: string = `您好,今年是 ${ name } 发布 ${ years + 1} 周年`;
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

枚举 enum

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

object

unknown

null undefined

never
```

## 联合类型

通过管道(|)将变量设置多种类型,赋值时可以根据设置的类型来赋值

```
var val:string|number
val = 12
console.log("数字为 "+ val)
val = "Runoob"
console.log("字符串为 " + val)

可选属性 ?
interface SquareConfig {
  color?: string;
  width?: number;
}

```

## 高级类型(type)

和interface功能类型,但是不能实现,接口不能声明联合类型
```
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
let method: Methods
method = 'PUT' // OK
method = 'aaa' // error


type a = {
  aa?:string | number
  cc:string
}
type b = {
  readonly bb?: string | number
  dd?: string
}

// 交叉类型
type x = a & b

// 选中部分组成新类型
type v = Pick<x, 'aa'>

// 排除部分组成新类型
type z = Omit<x, 'aa'>
const aa: v = { aa: 22 }
const bb: z = { cc: '22' }
const cc: x = { cc: '22' }
```

## 泛型

```
类似于any,但是不会丢失信息

function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}

泛型接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;

泛型类
class GenericNumber<T> {
   readonly zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

泛型约束
需要传入符合约束类型的值,必须包含必须的属性
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

## 类的扩展

```
private  只能在定义类内使用
protected 在派生类内可以使用(可继承)
public  默认值

extends
readonly
get
set
static
抽象类 abstract不同于接口,抽象类可以包含成员的实现细节

接口能用的地方类都能使用
```

## 接口

接口中我们可以将数组的索引值和元素设置为不同类型,索引值可以是数字或字符串

```
属性严格检查
只读属性 readonly
可选属性 ?
索引签名 [index:number || string]
实现 implements接口继承拥有私有或受保护的成员的类时,这个接口类型只能被这个类或其子类实现
继承 extends

```

## 命名空间

```
别名内部模块
namespace SomeNameSpaceName {
   export interface ISomeInterfaceName {      }
   export class SomeClassName {      }
}

起别名 import q = x.y.z
写声明文件 .d.ts
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

## 使用技巧

#### 提取数组每一项类型

```
type ArrayType1 = Array<{
    a: number
    b: number
}>
type ArrayType2 = ({
    a: number
    b: number
} | {
    c: string
    d: string
})[]
// 通过索引访问来获取,我们都知道数组的索引是 number 类型的
type GetArrayOrTupleItemType1 = ArrayType1[number]
// 得到
type GetArrayOrTupleItemType1 = {
    a: number
    b: number
}
// 通过 infer 进行推导
type GetArrayOrTupleItemType2 = ArrayType2 extends Array<infer U> ? U : never
// 得到
type GetArrayOrTupleItemType2 = {
    a: number
    b: number
} | {
    c: string
    d: string
}
```

#### 提取接口中的类型

```
interface A {
    b: string
    c: number
    d: Array<{
        e: symbol
    }>
}
type B = A['b']
type C = A['c']
// 与上一小节的技巧配置使用
type E = A['d'][number]['e']
```

#### const let类型推断

```
const a = 1 // 则 a 的类型就为 1
const d = '2' // 则 a 的类型就是 '2'

// b 的类型为 number,c 的类型为 string,这是由于右侧得到的类型即为 (number | string)[]
const [b, c] = [1, '2']

// d.e 的 类型 为 number,d.f 的类型 为 string,因为常量对象的属性是可以进行操作的,类型推导也会发生在初始化成员（对象属性）的过程中
const d = {
    e: 1,
    f: '2'
}

let a = 1 // a 为 number 类型
let b = '2' // b 为 string 类型
```

#### 断言as
```
尽量避免使用as any 推荐as unknown

const a = {
    b: 1
}
const c = (params: { b: 1 }) => {}

c(a) // 报错:不能将类型“number”分配给类型“1”,在 b: 1 那一行最后加上 as const 即可解决
```
