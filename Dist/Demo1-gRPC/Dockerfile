FROM python:3.10-slim
WORKDIR /app
COPY requirements-grpc.txt .
RUN pip install -r requirements-grpc.txt
COPY . .
# 编译proto
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. calc.proto
