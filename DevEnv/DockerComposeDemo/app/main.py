import os
from flask import Flask, jsonify
import redis
import pymysql
from datetime import datetime

app = Flask(__name__)

# 连接 Redis（通过 docker-compose 服务名访问）
redis_host = os.environ.get("REDIS_HOST", "localhost")
r = redis.Redis(host=redis_host, port=6379, decode_responses=True)

# MySQL 连接配置（通过 docker-compose 服务名访问）
mysql_config = {
    "host": os.environ.get("MYSQL_HOST", "localhost"),
    "user": os.environ.get("MYSQL_USER", "root"),
    "password": os.environ.get("MYSQL_PASSWORD", "root123"),
    "database": os.environ.get("MYSQL_DATABASE", "demo"),
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


def get_mysql_conn():
    """获取 MySQL 连接"""
    return pymysql.connect(**mysql_config)


@app.route("/")
def index():
    """首页：显示访问计数"""
    count = r.incr("visits")
    return jsonify({
        "message": "Hello from Docker Compose!",
        "visits": count,
        "time": datetime.now().isoformat()
    })


@app.route("/users")
def list_users():
    """查询所有用户（MySQL）"""
    conn = get_mysql_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name, email, created_at FROM users")
            users = cursor.fetchall()
        # 格式化 datetime 为字符串
        for u in users:
            u["created_at"] = u["created_at"].isoformat()
        return jsonify({"users": users})
    finally:
        conn.close()


@app.route("/health")
def health():
    """健康检查接口"""
    # 检查 Redis
    try:
        r.ping()
        redis_status = "connected"
    except Exception:
        redis_status = "disconnected"

    # 检查 MySQL
    try:
        conn = get_mysql_conn()
        conn.ping()
        conn.close()
        mysql_status = "connected"
    except Exception:
        mysql_status = "disconnected"

    return jsonify({
        "status": "ok",
        "redis": redis_status,
        "mysql": mysql_status,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
