# =============================================================================
# Client Dockerfile — Vue 3 + Vite 前端
#
# 多阶段构建：
#   阶段 1: 构建阶段 — 安装依赖 + vite build
#   阶段 2: 运行阶段 — Nginx 托管 dist 产物
# =============================================================================

# ==================== 阶段 1：构建 ====================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件并安装
COPY package.json .
RUN npm install

# 复制源码并构建
COPY . .
RUN npm run build

# ==================== 阶段 2：运行 ====================
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
