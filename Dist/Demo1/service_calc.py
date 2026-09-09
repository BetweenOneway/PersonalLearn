import time
import socket
import uvicorn
from fastapi import FastAPI
from pythonconsul import Consul
import atexit

app = FastAPI(title="Calc Service")
consul = Consul(host="consul", port=8500)

SERVICE_NAME = "calc-service"
SERVICE_PORT = 8000
# 获取本机容器IP
def get_host_ip():
    return socket.gethostbyname(socket.gethostname())
SERVICE_ADDR = get_host_ip()

# 注册服务
def register():
    consul.agent.service.register(
        name=SERVICE_NAME,
        service_id=f"{SERVICE_NAME}-{SERVICE_ADDR}-{SERVICE_PORT}",
        address=SERVICE_ADDR,
        port=SERVICE_PORT,
        check={
            "http": f"http://{SERVICE_ADDR}:{SERVICE_PORT}/health",
            "interval": "5s",
            "timeout": "3s"
        }
    )
    print(f"✅ Service registered: {SERVICE_NAME} @ {SERVICE_ADDR}:{SERVICE_PORT}")

# 注销服务
def deregister():
    service_id = f"{SERVICE_NAME}-{SERVICE_ADDR}-{SERVICE_PORT}"
    consul.agent.service.deregister(service_id)
    print(f"❌ Service deregistered {service_id}")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/add")
def add(a: float, b: float):
    return {"result": a + b, "server": SERVICE_ADDR}

@app.get("/sub")
def sub(a: float, b: float):
    return {"result": a - b, "server": SERVICE_ADDR}

if __name__ == "__main__":
    register()
    atexit.register(deregister)
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)
