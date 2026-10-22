# HTTP Reactor Server

## 结构总览

mainReactor（主线程）：只负责 accept
subReactor x N：one loop per thread，epoll 事件循环 + 定时器堆
ThreadPool：业务计算线程池，IO线程不阻塞在业务逻辑
HttpConn：单个连接，读/解析/投递任务/写响应/超时关闭
TimerHeap：最小堆定时器，管理连接空闲超时

## 编译运行

```bash
g++ -std=c++17 reactor_http.cpp -o reactor_http -Wall -O2
./reactor_http
```

## 访问与压测

访问：`curl http://127.0.0.1:8080`
压测：`wrk -t4 -c100 -d10s http://127.0.0.1:8080`

## TODO

1. ✅ 现在：固定应答 → 解析 HTTP path、method、query、headers，路由分发
2. ✅ 增加 JSON 入参解析（引入 nlohmann/json），对接 Node 调用
3. ✅ 增加 滑动窗口 / 令牌桶限流，按 IP 限流
4. ✅ 增加连接统计：总连接数、QPS、p99 延迟（给 Vue 监控面板输出接口）
5. ✅ 替换定时器堆 → **时间轮定时器**（海量连接场景对比性能）
6. ✅ 把 ET 模式的粘包、边界异常完善，支持 POST body
7. ✅ 改成 io_uring 版本做对比
8. ✅ 增加内存池，HttpConn、读写 buffer 从内存池分配

## 网站接入方式

C++ 服务跑在 8080，Node 直接 axios 调用 `http://127.0.0.1:8080/api/xxx`，Vue 通过 Node 间接访问；
你新增一个 `/api/stat` 接口，返回 QPS、连接数、超时数，前端直接画监控。
