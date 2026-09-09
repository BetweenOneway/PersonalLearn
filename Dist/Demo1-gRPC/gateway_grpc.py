from fastapi import FastAPI, HTTPException
import grpc
from pythonconsul import Consul
import calc_pb2
import calc_pb2_grpc

app = FastAPI(title="gRPC Gateway")
consul = Consul(host="consul", port=8500)
SERVICE_NAME = "calc-grpc-service"
round_idx = 0

def get_healthy_nodes():
    services = consul.health.service(SERVICE_NAME, passing=True)[1]
    nodes = []
    for s in services:
        addr = s["Service"]["Address"]
        port = s["Service"]["Port"]
        nodes.append(f"{addr}:{port}")
    return nodes

@app.get("/{op}")
def proxy(op: str, a: float, b: float):
    global round_idx
    nodes = get_healthy_nodes()
    if not nodes:
        raise HTTPException(status_code=503, detail="no grpc calc service available")

    target = nodes[round_idx % len(nodes)]
    round_idx +=1

    try:
        with grpc.insecure_channel(target) as channel:
            stub = calc_pb2_grpc.CalcServiceStub(channel)
            req = calc_pb2.CalcRequest(a=a, b=b)
            if op == "add":
                resp = stub.Add(req, timeout=3)
            elif op == "sub":
                resp = stub.Sub(req, timeout=3)
            else:
                raise HTTPException(status_code=400, detail="op only support add/sub")
        return {
            "gateway_msg": f"forward to grpc {target}",
            "remote_resp": {"result": resp.result, "server_addr": resp.server_addr}
        }
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"gRPC call error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
