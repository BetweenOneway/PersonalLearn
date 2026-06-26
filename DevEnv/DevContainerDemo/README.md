# 🐳 DevContainer Demo

一个最简的 VSCode DevContainer 演示项目。

## 什么是 DevContainer？

DevContainer 让你在 Docker 容器中开发项目，所有人拥有一致的开发环境，告别"我机器上能跑"的问题。

## 项目结构

```
DevContainerDemo/
├── .devcontainer/
│   ├── devcontainer.json    # 核心配置：镜像、扩展、端口、生命周期
│   └── Dockerfile           # 自定义容器镜像
├── app/
│   ├── main.py              # Flask Web 应用
│   └── utils.py             # 工具函数
├── tests/
│   └── test_utils.py        # 单元测试
├── requirements.txt
└── README.md
```

## 快速开始

### 前置条件

- **Docker 运行时**（任选其一）：
  - Windows/macOS：[Docker Desktop](https://www.docker.com/products/docker-desktop/)（推荐，开箱即用）
  - Linux：[Docker Engine](https://docs.docker.com/engine/install/) 即可，无需 Desktop
  - 替代方案：[Podman](https://podman.io/)、[Rancher Desktop](https://rancherdesktop.io/) 等兼容 Docker 的运行时
- 安装 [VSCode](https://code.visualstudio.com/)
- 安装 [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

> **提示**：DevContainer 只需要 Docker 守护进程，不强制要求 Docker Desktop。Linux 用户直接装 `docker-ce` 即可。

### 启动

1. VSCode 打开本项目
2. 按 `Ctrl+Shift+P` → `Dev Containers: Reopen in Container`
3. 首次构建约 2-5 分钟，之后秒启

### 运行

```bash
python app/main.py        # 启动 Flask，访问 http://localhost:8000
pytest -v                 # 运行测试
```

## devcontainer.json 核心配置说明

| 配置项 | 作用 |
|--------|------|
| `name` | 容器名称，显示在 VSCode 标题栏 |
| `build.dockerfile` | 指定构建镜像的 Dockerfile |
| `customizations.vscode.extensions` | 进入容器后自动安装的 VSCode 扩展 |
| `customizations.vscode.settings` | 容器内自动应用的编辑器设置 |
| `forwardPorts` | 将容器端口转发到本机 |
| `postCreateCommand` | 容器创建后自动执行（安装依赖的理想位置） |
| `postStartCommand` | 每次启动容器后执行 |
| `remoteUser` | 容器内使用的用户 |
| `containerEnv` | 注入容器的环境变量 |

## 两种定义容器的方式

**方式一：预构建镜像**（最简单，无需 Dockerfile）
```json
{ "image": "mcr.microsoft.com/devcontainers/python:3.11" }
```

**方式二：自定义 Dockerfile**（本项目采用，更灵活）
```json
{ "build": { "dockerfile": "Dockerfile" } }
```

## 生命周期钩子执行顺序

```
initializeCommand  → 宿主机执行（容器创建前）
onCreateCommand    → 容器创建后（仅一次）
postCreateCommand  → 源码挂载后（安装依赖）
postStartCommand   → 每次容器启动后
```

## 参考

- [DevContainers 官方文档](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer 规范](https://containers.dev/)
