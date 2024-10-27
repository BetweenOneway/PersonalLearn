# CloudNoteServer

## 项目简介

该项目为CloudNote配套的服务端程序。
主要实现云笔记、便签相关功能

## 主要技术

服务器主程序以Node.js为主。数据库使用mysql。程序通过Sequelize来访问数据库。同时使用Redis作为存储的中间件。

## 运行前准备

1. 建立数据库，并启动数据库服务
2. 执行建表SQL文件，建立数据库表
3. 下载并安装Redis服务端，[下载地址](https://github.com/tporadowski/redis/releases)
4. 启动Redis服务
    + 方法1
    运行`redis-server.exe redis.windows.conf`
    + 方法2
    运行`redis-cli`
5. 安装Node客户端 运行`node -v`确认安装成功
6. 运行`npm install`安装依赖库
7. 在当前目录下运行 `node app.js`
