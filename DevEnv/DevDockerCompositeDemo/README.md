# 🐳 DevDockerCompositeDemo

**DevContainer + Docker Compose 联合使用演示** — 前后端分离架构，前端和后端各自独立 DevContainer。

## 核心概念

| 模式 | 适用场景 | 容器管理 |
|------|----------|----------|
| **普通 DevContainer** | 单容器开发，无外部依赖 | VSCode 管理单个容器 |
| **DevContainer + dockerComposeFile** | 需要数据库、缓存等多服务 | VSCode 调用 docker-compose 管理全部服务 |

本项目演示**两个独立的 DevContainer**：
- **Server DevContainer**：打开 `server/` 目录 → `Reopen in Container` → 进入 Node.js 后端开发环境
- **Client DevContainer**：打开 `client/` 目录 → `Reopen in Container` → 进入 Vue 3 + Vite 前端开发环境

两个 DevContainer 加入同一个 Docker 网络（`devcompose_net`），前端通过 `server:3000` 访问后端 API，后端连接 `redis:6379` 和 `mysql:3306`。

## 架构

```
┌──────────────────────────────────────────────────────────────┐
│                       宿主机浏览器                              │
│            http://localhost:5173（前端开发）                    │
│            http://localhost:3000（后端 API）                    │
└──────────────┬───────────────────────┬────────────────────────┘
               │                       │
┌──────────────▼──────────────┐ ┌──────▼───────────────────────────┐
│  Client DevContainer        │ │  Server DevContainer              │
│  打开 client/ 目录           │ │  打开 server/ 目录                │
│                              │ │                                  │
│  ┌────────────────────────┐ │ │  ┌────────────────────────────┐  │
│  │  client (Vite :5173)   │ │ │  │  server (Express :3000)    │  │
│  │  Vue 3 + Vite + HMR    │─┼─┼─▶│  POST /api/login           │  │
│  │  /api → proxy to       │ │ │  │  GET  /api/health          │  │
│  │         server:3000    │ │ │  │  GET  /api/login-records   │  │
│  └────────────────────────┘ │ │  └──────┬──────────┬──────────┘  │
│                              │ │         │          │             │
└──────────────────────────────┘ │  ┌──────▼────┐ ┌───▼─────────┐  │
                                 │  │  Redis    │ │  MySQL       │  │
                                 │  │  :6379    │ │  :3306       │  │
                                 │  │  缓存      │ │  持久化      │  │
                                 │  └───────────┘ └──────────────┘  │
                                 │                                  │
                                 │  Docker 网络: devcompose_net      │
                                 └──────────────────────────────────┘
```

```
Client DevContainer          Server DevContainer
   (Vite :5173) ────API────▶  (Express :3000)
                                   │
                              ┌────┴────┐
                              ▼         ▼
                          ┌──────┐  ┌──────┐
                          │Redis │  │MySQL │  ← 共享基础设施
                          └──────┘  └──────┘
```

## 登录流程与 Redis 缓存策略

```
用户输入用户名+密码
        │
        ▼
  前端 POST /api/login ──▶ Express 后端处理
                                │
                                ▼
                    检查 Redis: login:{username} 是否存在？
                                │
                           ┌────┴────┐
                           │ 存在     │ 不存在/已过期
                           ▼         ▼
                      从缓存返回    写入 MySQL login_records 表
                      欢迎回来       写入 Redis (TTL=900秒, 15分钟)
                                    返回 欢迎登录
```

**关键点**：同一用户在 15 分钟内再次登录，后端直接从 Redis 返回缓存结果，**不更新 MySQL 数据库**。

## 项目结构

```
DevDockerCompositeDemo/
├── docker-compose.yml              # 全量启动（不使用 DevContainer 时用）
├── dev.env                         # 共享环境变量
├── init.sql                        # MySQL 初始化
│
├── server/                         # 后端 Node.js/Express
│   ├── .devcontainer/
│   │   └── devcontainer.json       # ← Server DevContainer 配置
│   ├── docker-compose.yml          # ← Server 专用 compose（含 redis + mysql）
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js                # Express 服务
│
├── client/                         # 前端 Vue 3 + Vite
│   ├── .devcontainer/
│   │   └── devcontainer.json       # ← Client DevContainer 配置
│   ├── docker-compose.yml          # ← Client 专用 compose（含 redis + mysql）
│   ├── Dockerfile                  # 生产模式（多阶段构建 → Nginx）
│   ├── Dockerfile.dev              # 开发模式（Vite dev server + HMR）
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       └── components/
│           ├── LoginPage.vue
│           └── WelcomePage.vue
│
└── README.md
```

## 快速开始

### 前置条件

- **Docker 运行时**：[Docker Desktop](https://www.docker.com/products/docker-desktop/)（Windows/macOS）或 [Docker Engine](https://docs.docker.com/engine/install/)（Linux）
- 安装 [VSCode](https://code.visualstudio.com/)
- 安装 [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## 方式一：分别开发前后端（推荐，两个 DevContainer）

可以**同时打开两个 VSCode 窗口**，一个开发前端，一个开发后端。

### 启动后端 DevContainer

1. 用 VSCode 打开 `server/` 目录
2. 按 `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
3. VSCode 自动执行：
   - `docker-compose up` 启动 server、redis、mysql 三个容器
   - 连接到 `server` 容器
   - 安装 Node.js 依赖
4. 在终端中启动后端：

```bash
npm start
# 输出: 🚀 后端服务已启动: http://localhost:3000
```

### 启动前端 DevContainer

1. 用 VSCode **新开一个窗口**，打开 `client/` 目录
2. 按 `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
3. VSCode 自动执行：
   - `docker-compose up` 启动 client、redis、mysql 三个容器
   - 连接到 `client` 容器
   - 安装 Node.js 依赖
4. 在终端中启动 Vite 开发服务器：

```bash
npm run dev
# 输出: ➜  Local:   http://localhost:5173/
```

5. 打开浏览器访问 **http://localhost:5173**

> 💡 **提示**：因为两个 DevContainer 共享同一个 Docker 网络（`devcompose_net`），前端 Vite 的 `/api` 代理会自动转发到 `server:3000`。

---

## 方式二：一键全量启动（不使用 DevContainer）

```bash
# 在项目根目录执行
docker-compose up -d

# 进入 server 容器启动后端
docker exec -it devcompose_server bash
npm start

# 访问前端 http://localhost:8080（Nginx 托管生产构建产物）
```

---

## 前端两种运行模式

| | 开发模式（DevContainer） | 生产模式（docker-compose 全量） |
|---|---|---|
| **用什么** | `Dockerfile.dev` + Vite | `Dockerfile` 多阶段构建 + Nginx |
| **怎么跑** | 在 client DevContainer 中 `npm run dev` | `docker-compose up` 自动构建 |
| **端口** | `http://localhost:5173` | `http://localhost:8080` |
| **改代码** | HMR 热更新，浏览器自动刷新 | 需重新 `docker-compose build` |
| **API 代理** | Vite `server.proxy` | Nginx `proxy_pass` |

---

## 后端技术栈

| 技术 | 说明 |
|------|------|
| Node.js 20 | 运行时 |
| Express | Web 框架 |
| mysql2 | MySQL 驱动（连接池） |
| redis | Redis 客户端 |
| cors | 跨域支持 |

## 前端技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API（`<script setup>`） |
| Vue Router 4 | 路由：`/` 登录页 → `/welcome` 欢迎页 |
| Vite 5 | 构建工具，开发时 HMR 热更新 |
| Nginx | 生产部署托管静态资源 + API 反向代理 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/login` | 登录（自动缓存 15 分钟） |
| `GET` | `/api/health` | 健康检查（Redis + MySQL 连接状态） |
| `GET` | `/api/login-records` | 查询最近登录记录 |

### 登录请求示例

```bash
# 第一次登录 → 写入 MySQL + Redis
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Alice","password":"123456"}'

# 响应
{
  "success": true,
  "message": "欢迎登录，Alice！",
  "data": {
    "username": "Alice",
    "loginTime": "2026-06-17T06:00:00.000Z",
    "fromCache": false    // ← 首次登录，写入了数据库
  }
}

# 15 分钟内再次登录 → 从 Redis 缓存返回
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Alice","password":"123456"}'

# 响应
{
  "success": true,
  "message": "欢迎回来，Alice！",
  "data": {
    "username": "Alice",
    "loginTime": "2026-06-17T06:00:00.000Z",
    "fromCache": true     // ← 缓存命中，未更新数据库
  }
}
```

## 两个 DevContainer 配置对比

### Server DevContainer（`server/.devcontainer/devcontainer.json`）

```jsonc
{
  "dockerComposeFile": "docker-compose.yml",
  "service": "server",                     // 连接 server 容器
  "workspaceFolder": "/app",
  "forwardPorts": [3000],                  // API 端口
  "shutdownAction": "stopCompose"          // 关闭时停止全部服务
}
```

### Client DevContainer（`client/.devcontainer/devcontainer.json`）

```jsonc
{
  "dockerComposeFile": "docker-compose.yml",
  "service": "client",                     // 连接 client 容器
  "workspaceFolder": "/app",
  "forwardPorts": [5173],                  // Vite 开发服务器端口
  "shutdownAction": "stopCompose"          // 关闭时停止全部服务
}
```

## 共享网络原理

两个 DevContainer 使用 `docker-compose.yml` 中定义的同一个外部网络 `devcompose_net`：

```yaml
# server/docker-compose.yml 和 client/docker-compose.yml 中都有：
networks:
  devcompose_net:
    name: devcompose_net    # 使用同一个网络名
    external: true          # 不创建新网络，加入已有网络
```

这样 `client` 容器可以直接通过 `server:3000` 访问后端 API，`server` 容器可以通过 `redis:6379` 和 `mysql:3306` 访问基础设施。

## 常用操作

| 操作 | 命令/方式 |
|------|------|
| 进入后端 DevContainer | 用 VSCode 打开 `server/` → `Reopen in Container` |
| 进入前端 DevContainer | 用 VSCode 打开 `client/` → `Reopen in Container` |
| 启动后端 | `npm start`（在 Server DevContainer 终端） |
| 启动前端 | `npm run dev`（在 Client DevContainer 终端） |
| 重建容器 | `Ctrl+Shift+P` → `Dev Containers: Rebuild Container` |
| 查看 Redis 缓存 | `docker exec -it devcompose_redis redis-cli` → `KEYS *` |
| 查看 MySQL 记录 | `docker exec -it devcompose_mysql mysql -uroot -proot123 demo -e "SELECT * FROM login_records"` |
| 查看所有容器 | `docker ps` |
| 停止所有服务 | 关闭两个 VSCode 窗口或 `docker-compose down` |
| 全量一键启动 | 在根目录 `docker-compose up -d` |

## 参考

- [DevContainers 官方文档](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer dockerComposeFile 规范](https://containers.dev/implementors/json_reference/#dockerComposeFile)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
