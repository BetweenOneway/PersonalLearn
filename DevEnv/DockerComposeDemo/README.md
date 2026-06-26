# DockerComposeDemo

最简化的 Docker Compose 演示项目，展示多容器协作。

## 架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Flask Web  │────▶│   Redis     │     │   MySQL     │
│  (web)      │     │  (redis)    │     │  (mysql)    │
│  :5000      │     │  :6379      │     │  :3306      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                     redis_data           mysql_data
                     (命名卷)         (命名卷 + init.sql)
```

## 服务说明

| 服务 | 镜像 | 端口 | 用途 |
|------|------|------|------|
| `web` | Dockerfile 构建 | 5000→8000 | Flask 应用 |
| `redis` | redis:7-alpine | 6379 | 访问计数 |
| `mysql` | mysql:8.0 | 3306 | 用户数据，启动时自动建表+插数据 |

## 快速开始

```bash
# 1. 启动所有服务（后台运行，首次启动会拉取镜像并执行 init.sql）
docker-compose up -d

# 2. 查看运行状态
docker-compose ps

# 3. 测试接口
curl http://localhost:8000/          # 访问计数（Redis）
curl http://localhost:8000/users     # 查询用户列表（MySQL）
curl http://localhost:8000/health    # 健康检查（Redis + MySQL）

# 4. 查看日志
docker-compose logs -f web

# 5. 停止并清理（-v 同时删除数据卷，下次启动会重新初始化）
docker-compose down -v
```

## 初始化数据

`init.sql` 在 MySQL 容器首次启动时自动执行，创建 `users` 表并插入 3 条测试数据：

| id | name | email |
|----|------|-------|
| 1 | Alice | alice@example.com |
| 2 | Bob | bob@example.com |
| 3 | Charlie | charlie@example.com |

## 常用命令

| 命令 | 说明 |
|------|------|
| `docker-compose up -d` | 后台启动 |
| `docker-compose down` | 停止并删除容器 |
| `docker-compose down -v` | 停止并删除容器+数据卷 |
| `docker-compose ps` | 查看服务状态 |
| `docker-compose logs -f` | 查看实时日志 |
| `docker-compose restart web` | 重启单个服务 |
| `docker-compose build` | 重新构建镜像 |
| `docker-compose exec mysql mysql -uroot -proot123 demo` | 进入 MySQL 命令行 |
