# DevContainer 自定义 Dockerfile
# 基于 Python 3.11 轻量镜像

ARG PYTHON_VERSION=3.11
FROM python:${PYTHON_VERSION}-slim-bookworm

# 环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# 安装开发所需系统工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 将 requirements.txt 复制到镜像中并安装依赖
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt \
    && rm /tmp/requirements.txt

# 创建非 root 用户（DevContainer 推荐做法）
RUN useradd --create-home --shell /bin/bash vscode

# 切换到非 root 用户
USER vscode

WORKDIR /workspaces/DevContainerDemo

CMD ["/bin/bash"]
