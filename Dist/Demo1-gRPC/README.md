# # Python Level1 Distributed Demo gRPC版本

## 生成 protobuf 代码命令

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. calc.proto
```

## gRPC 版本启动 & 测试

```bash
docker compose -f docker-compose-grpc.yml up --build
```

测试命令和 HTTP 版本一模一样：

```bash
curl "http://127.0.0.1:9000/add?a=10&b=20"
```
