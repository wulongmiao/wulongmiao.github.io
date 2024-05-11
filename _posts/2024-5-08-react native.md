---
layout: post
title: react native
date: 2024-5-08
categories: 前端开发
tags: [react native]
---

## 环境准备

脚手架安装`pnpm install -g react-native`

参考 [官方文档](https://www.reactnative.cn/docs/environment-setup)

## 真机调试

参考 [文档](https://www.reactnative.cn/docs/running-on-device)

## 常用命令

```
react-native help 命令提示
react-native run-android 编译运行
```

## 依赖库

```
gradle仓库
https://mirrors.aliyun.com/gradle
https://mirrors.tencent.com/gradle

maven仓库
https://maven.aliyun.com/repository/public
https://mirrors.cloud.tencent.com/maven/
https://mirrors.huaweicloud.com/repository/maven
```

## gradle

常用命令
```
gradle -h   命令提示
gradle build    编译并构建项目，包括编译源代码、运行测试、打包等
gradle assemble   仅执行构建过程，不运行测试
gradle clean    清除构建过程中产生的输出文件
gradle test   运行项目的测试
gradle [taskName]   运行指定的任务，例如 gradle build 或 gradle  jar
gradle init   根据模板初始化一个新的Gradle项目
gradle init --type pom    将Maven项目转换为Gradle项
gradle tasks    列出所有可用的任务
gradle dependencies   展示项目的依赖树
```

文件配置
```
systemProp.http.proxyHost=mirrors.aliyun.com
systemProp.http.proxyPort=80
systemProp.https.proxyHost=maven.aliyun.com/repository/public
systemProp.https.proxyPort=443
```

## maven

常用命令
```
mvn -h   命令提示
mvn clean   清理构建目录
mvn compile   编译源代码
mvn package   打包项目
mvn install   编译、测试、打包并将包安装到本地仓库
mvn deploy    完成构建后，将最终的包复制到远程仓库
mvn test    编译并运行测试
mvn dependency:tree   显示项目依赖树
mvn dependency:analyze    分析项目依赖，找出未使用的和过时的依赖
mvn help:effective-pom    显示实际使用的POM模型，考虑了继承和插件的影响
mvn site    生成项目站点文档
mvn versions:use-latest-releases    更新所有依赖到最新版本
mvn versions:display-dependency-updates   列出所有可更新的依赖
```

文件配置
```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <pluginGroups>
  </pluginGroups>
  <proxies>
  </proxies>
  <servers>
  </servers>
  <mirrors>
    <mirror>
      <id>maven-default-http-blocker</id>
      <mirrorOf>external:http:*</mirrorOf>
      <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
      <url>http://0.0.0.0/</url>
      <blocked>true</blocked>
    </mirror>
    <mirror>
    <id>huaweicloud</id>
    <mirrorOf>*</mirrorOf>
    <url>https://mirrors.huaweicloud.com/repository/maven/</url>
    </mirror>
  </mirrors>
  <profiles>
  </profiles>
</settings>
```
