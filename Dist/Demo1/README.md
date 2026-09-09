# Python Level1 Distributed Demo

> 分布式最小练手项目：多实例计算服务 + Consul服务注册发现 + 网关轮询负载均衡
> 技术栈：Python + FastAPI + Consul + Docker Compose

## ✨ 项目目标

理解分布式基础概念：

- 服务注册 & 服务发现
- 健康检查，故障节点自动剔除
- 客户端负载均衡（轮询）
- 单机Docker容器模拟多机器集群
  > 业务：分布式计算器，多个calc节点提供加减运算；gateway网关接收请求，转发到后端calc服务。

## 🧱 架构图

```mermaid
flowchart LR
    Client[客户端 curl / browser] --> Gateway[Gateway 网关:9000]
    Gateway -->|服务发现| Consul[Consul 注册中心:8500]
    Gateway -->|轮询LB| Calc1[calc-service 实例1]
    Gateway -->|轮询LB| Calc2[calc-service 实例2]

## 📁 目录结构

dist-demo/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── service_calc.py   # 计算服务
├── gateway.py        # 网关+服务发现+轮询LB
└── README.md

## 🚀 快速启动

```bash
docker compose up --build
```

### 测试接口

```bash
curl "http://127.0.0.1:9000/add?a=10&b=20"
curl "http://127.0.0.1:9000/sub?a=100&b=30"
```

## ⚠️ 故障模拟（分布式最重要的实验）

1. 停止 calc2 实例

```bash
docker compose stop calc2
```

继续 curl 网关，流量只会打到 calc1；Consul 健康检查标记 calc2 不健康，网关不再获取该节点。
2. 恢复 calc2

```bash
docker compose start calc2
```

等待 Consul 健康检查通过，网关重新发现节点，恢复轮询。

## 📚 覆盖知识点

1. 服务注册：服务启动主动上报地址、端口、健康检查规则到 Consul
2. 服务发现：网关每次请求从 Consul 拉取**健康实例**
3. 健康检查：Consul 定时调用`/health`接口，异常节点自动摘除
4. 客户端负载均衡：网关本地轮询，不依赖反向代理
5. 优雅注销：服务退出时主动注销服务（atexit）

## 📌 扩展方向

增加请求重试、超时控制
增加简单熔断，失败次数多临时摘除节点
替换 HTTP 为 gRPC 版本
