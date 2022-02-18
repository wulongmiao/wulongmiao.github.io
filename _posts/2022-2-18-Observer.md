<!--
 * @Author: wulongmiao
 * @Date: 2022-02-18 14:24:49
 * @LastEditors: wulongmiao
 * @LastEditTime: 2022-02-18 14:57:58
 * @Description:test
-->
---
layout: post
title: node入门
date: 2021-9-5
categories: 前端
tags: [前端开发,observer]
---

## Observer
监听非用户直接触发的事件


#### IntersectionObserver
监听元素从可见到隐藏
```
可视比例达到某个阈值的时候触发回调
const intersectionObserverMY = new IntersectionObserver(
    function (entries) {
        entries.forEach(item => {
            console.log(item.target, item.intersectionRatio)
        })
    }, {// 当可视区域到达数组位置时，触发事件threshold: [0.5, 1]}
    );

intersectionObserverMY.observe( dom );
```

#### mutationObserver
监听对元素的属性的修改、对它的子节点的增删改
```
const mutationObserver = new MutationObserver((items) => {
    console.log(items)
});

mutationObserver.observe(dom, {
    attributes: true,   //监听属性
    childList: true //监听子节点变化
});
```

#### ResizeObserver
监听元素大小变化
```
const resizeObserver = new ResizeObserver(items => {
    console.log('当前大小', items)
});
resizeObserver.observe(dom);
```

#### PerformanceObserver
监听performance对象变化
```
    const performanceObserver = new PerformanceObserver(items => {
      items.getEntries().forEach(item => {
        console.log(item);// 上报
      })
    });
    performanceObserver.observe({entryTypes: ['resource', 'mark', 'measure']});
```

#### mutationObserver
监听元素大小变化
```
const reportingObserver = new ReportingObserver((reports, observer) => {
    for (const report of reports) {
        console.log(report.body);//上报
    }
}, {types: ['intervention', 'deprecation']});

reportingObserver.observe();
```