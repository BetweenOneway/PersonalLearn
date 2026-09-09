import requests
from fastapi import FastAPI, HTTPException
from pythonconsul import Consul

app = FastAPI(title="Gateway")
consul = Consul(host="consul", port=8500)
SERVICE_NAME = "calc-service"
# 轮询游标
round_idx = 0

def get_healthy_nodes():
    """从consul获取健康的calc服务节点列表"""
    services = consul.health.service(SERVICE_NAME, passing=True)[1]
    nodes = []
    for s in services:
        addr = s["Service"]["Address"]
        port = s["Service"]["Port"]
        nodes.append(f"http://{addr}:{port}")
    return nodes

@app.get("/{op}")
def proxy(op: str, a: float, b: float):
    global round_idx
    nodes = get_healthy_nodes()
    if not nodes:
        raise HTTPException(status_code=503, detail="no calc service available")

    # 轮询选择节点
    selected = nodes[round_idx % len(nodes)]
    round_idx += 1
    try:
        resp = requests.get(f"{selected}/{op}", params={"a": a, "b": b}, timeout=3)
        resp.raise_for_status()
        return {
            "gateway_msg": f"forward to {selected}",
            "remote_resp": resp.json()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"call calc service failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
