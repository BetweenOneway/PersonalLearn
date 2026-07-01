# CloudNoteServer

## 项目简介

该项目为CloudNote配套的服务端程序。
主要实现云笔记、便签相关功能

## 主要技术

服务器主程序以Node.js为主。数据库使用MySQL。程序通过Sequelize来访问数据库。同时使用Redis作为存储的中间件。

## Docker 开发环境（推荐）

无需手动安装 MySQL、Redis，一键启动全部依赖服务。

### 前置条件
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（含 Docker Compose）
- [Visual Studio Code](https://code.visualstudio.com/) + [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 扩展

### 方式一：VSCode DevContainer（推荐）

1. 用 VSCode 打开 `webServer/` 目录
2. 点击左下角绿色按钮 → **Reopen in Container**（或在命令面板选择 `Dev Containers: Reopen in Container`）
3. 容器启动后会自动安装依赖，并启动 MySQL、Redis 服务
4. 在容器终端执行：
   ```bash
   npm run dev:linux
   ```
5. API 服务运行在 `http://localhost:18081`

### 方式二：Docker Compose 命令行

```bash
# 启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 进入 server 容器终端
docker exec -it between_network_server bash

# 在容器内启动应用
npm run dev:linux

# 停止所有服务
docker compose down
```

### 服务端口

| 服务     | 端口  | 说明                 |
| -------- | ----- | -------------------- |
| API 服务 | 18081 | Node.js Express 后端 |
| MySQL    | 3306  | 数据库服务           |
| Redis    | 6379  | 缓存服务             |

### 数据库

- 数据库名：`cloudnote`
- 用户名：`root`
- 密码：`root123`（可在 `dev.env` 中修改）
- 容器首次启动时会自动执行 `init.sql` 初始化建表

---

## 本地开发环境（传统方式）

1. 建立数据库，并启动数据库服务
2. 执行建表SQL文件，建立数据库表
3. 下载并安装Redis服务端，[下载地址](https://github.com/tporadowski/redis/releases)
4. 启动Redis服务
    + 方法1：运行 `redis-server.exe redis.windows.conf`
    + 方法2：运行 `redis-cli`
5. 安装Node客户端，运行 `node -v` 确认安装成功
6. 运行 `npm install` 安装依赖库
7. 在当前目录下运行 `node app.js` 或者执行 `npm run dev:windows`
