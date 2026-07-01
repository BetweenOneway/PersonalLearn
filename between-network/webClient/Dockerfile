# =============================================================================
# webClient Dockerfile — Vue 3 + Vite 前端开发环境
# =============================================================================

FROM node:20-slim

WORKDIR /app

# 预装依赖（加速首次启动，volume 挂载后可覆盖）
COPY package.json .
RUN npm install && npm cache clean --force

# 由 docker-compose 的 command: sleep infinity 覆盖
# 开发时在 VSCode 终端执行 npm run dev 启动前端
