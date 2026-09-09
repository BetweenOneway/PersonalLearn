import time
import socket
import atexit
import grpc
from concurrent import futures
from pythonconsul import Consul
import calc_pb2
import calc_pb2_grpc

SERVICE_NAME = "calc-grpc-service"
SERVICE_PORT = 50051
SERVICE_ADDR = socket.gethostbyname(socket.gethostname())
consul = Consul(host="consul", port=8500)

class CalcServicer(calc_pb2_grpc.CalcServiceServicer):
    def Add(self, request, context):
        return calc_pb2.CalcResponse(result=request.a + request.b, server_addr=SERVICE_ADDR)

    def Sub(self, request, context):
        return calc_pb2.CalcResponse(result=request.a - request.b, server_addr=SERVICE_ADDR)

def register():
    consul.agent.service.register(
        name=SERVICE_NAME,
        service_id=f"{SERVICE_NAME}-{SERVICE_ADDR}-{SERVICE_PORT}",
        address=SERVICE_ADDR,
        port=SERVICE_PORT,
        check={
            "grpc": f"{SERVICE_ADDR}:{SERVICE_PORT}",
            "grpc_use_tls": False,
            "interval": "5s"
        }
    )
    print(f"✅ gRPC Calc service registered: {SERVICE_ADDR}:{SERVICE_PORT}")

def deregister():
    sid = f"{SERVICE_NAME}-{SERVICE_ADDR}-{SERVICE_PORT}"
    consul.agent.service.deregister(sid)
    print(f"❌ gRPC service deregister {sid}")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calc_pb2_grpc.add_CalcServiceServicer_to_server(CalcServicer(), server)
    server.add_insecure_port(f"0.0.0.0:{SERVICE_PORT}")
    server.start()
    register()
    atexit.register(deregister)
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == "__main__":
    serve()
