# =============================================================================
# Server Dockerfile — Node.js 后端开发环境
# =============================================================================

FROM node:20-slim

# 安装开发工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    vim \
    procps \
    net-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 预装依赖（加速首次启动，volume 挂载后可覆盖）
COPY package.json .
RUN npm install && npm cache clean --force

# 不需要 CMD，由 docker-compose 的 command: sleep infinity 覆盖
