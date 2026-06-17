# DockerComposeDemo

最简化的 Docker Compose 演示项目，展示多容器协作。

## 架构

```
┌─────────────┐     ┌─────────────┐
│  Flask Web  │────▶│   Redis     │
│  (web)      │     │  (redis)    │
│  :5000      │     │  :6379      │
└─────────────┘     └─────────────┘
```

## 快速开始

```bash
# 1. 启动所有服务（后台运行）
docker-compose up -d

# 2. 查看运行状态
docker-compose ps

# 3. 测试接口
curl http://localhost:8000/          # 访问计数
curl http://localhost:8000/health    # 健康检查

# 4. 查看日志
docker-compose logs -f web

# 5. 停止并清理
docker-compose down -v
```

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
