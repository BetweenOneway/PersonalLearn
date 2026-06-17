"""
DevContainer Demo - Flask 应用
演示在 DevContainer 中开发 Python Web 应用
"""

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/")
def index():
    """首页"""
    return jsonify(
        {
            "message": "欢迎来到 DevContainer Demo! 🐳",
            "project": "DevContainerDemo",
            "endpoints": [
                "GET  /api/hello          - 问候接口",
                "GET  /api/hello/<name>   - 带名字的问候",
                "GET  /api/info           - 环境信息",
                "POST /api/echo           - 回显 POST 数据",
            ],
        }
    )


@app.route("/api/hello")
@app.route("/api/hello/<name>")
def hello(name: str = "World"):
    """问候接口"""
    return jsonify({"message": f"Hello, {name}!", "from": "DevContainer"})


@app.route("/api/info")
def info():
    """返回运行环境信息"""
    import sys
    import platform

    return jsonify(
        {
            "python_version": sys.version,
            "platform": platform.platform(),
            "container": "DevContainer",
            "app_name": app.name,
        }
    )


@app.route("/api/echo", methods=["POST"])
def echo():
    """回显接收到的 JSON 数据"""
    data = request.get_json(silent=True) or {}
    return jsonify({"received": data, "status": "ok"})


if __name__ == "__main__":
    print("🚀 启动 Flask 开发服务器...")
    print("📝 访问 http://localhost:8000 查看 API")
    # host="0.0.0.0" 确保容器外部可访问
    app.run(host="0.0.0.0", port=8000, debug=True)
