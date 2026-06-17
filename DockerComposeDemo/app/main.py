import os
from flask import Flask, jsonify
import redis
from datetime import datetime

app = Flask(__name__)

# 连接 Redis（通过 docker-compose 服务名访问）
redis_host = os.environ.get("REDIS_HOST", "localhost")
r = redis.Redis(host=redis_host, port=6379, decode_responses=True)


@app.route("/")
def index():
    """首页：显示访问计数"""
    count = r.incr("visits")
    return jsonify({
        "message": "Hello from Docker Compose!",
        "visits": count,
        "time": datetime.now().isoformat()
    })


@app.route("/health")
def health():
    """健康检查接口"""
    try:
        r.ping()
        redis_status = "connected"
    except Exception:
        redis_status = "disconnected"
    return jsonify({"status": "ok", "redis": redis_status})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
