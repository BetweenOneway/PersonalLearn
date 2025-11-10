import socket
import selectors
import signal
import sys
from typing import Tuple, Optional

# 全局选择器，用于监听I/O事件
sel = selectors.DefaultSelector()
# 标记服务是否运行
is_running = True


def handle_signal(signum, frame):
    """信号处理器：捕获Ctrl+C，标记服务停止"""
    global is_running
    print("\n收到中断信号，准备关闭服务...")
    is_running = False


def accept_wrapper(server_sock: socket.socket):
    """处理新的客户端连接"""
    try:
        # 非阻塞模式下，accept()可能抛出BlockingIOError（无新连接时）
        conn, addr = server_sock.accept()
        print(f"新连接: {addr}")
        # 将客户端socket设为非阻塞
        conn.setblocking(False)
        # 注册客户端socket的可读事件，关联数据为客户端地址
        sel.register(conn, selectors.EVENT_READ, data=addr)
    except BlockingIOError:
        # 无新连接，忽略
        pass


def service_client(conn: socket.socket, addr: Tuple[str, int]):
    """处理客户端数据"""
    try:
        # 尝试接收数据（非阻塞，无数据时抛BlockingIOError）
        data = conn.recv(1024)
        if data:
            print(f"从 {addr} 收到: {data.decode('utf-8')}")
            # 简单回显数据（示例：原样返回）
            conn.sendall(data)
        else:
            # 客户端关闭连接
            print(f"连接关闭: {addr}")
            sel.unregister(conn)  # 从选择器中移除
            conn.close()
    except BlockingIOError:
        # 无数据可读，忽略
        pass
    except ConnectionResetError:
        # 客户端强制关闭连接
        print(f"连接被重置: {addr}")
        sel.unregister(conn)
        conn.close()


def main(host: str = "127.0.0.1", port: int = 9999):
    # 注册信号处理器，捕获Ctrl+C（SIGINT）
    signal.signal(signal.SIGINT, handle_signal)

    # 创建服务端socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_sock:
        # 设置地址复用（避免端口占用问题）
        server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_sock.bind((host, port))
        server_sock.listen()
        print(f"服务启动，监听 {host}:{port} (按Ctrl+C关闭)")

        # 将服务端socket设为非阻塞
        server_sock.setblocking(False)
        # 注册服务端socket的可读事件（有新连接时触发）
        sel.register(server_sock, selectors.EVENT_READ, data=None)

        # 主循环：处理I/O事件和信号
        while is_running:
            # 超时1秒，避免select()无限阻塞，确保能响应信号
            events = sel.select(timeout=1)
            for key, mask in events:
                if key.data is None:
                    # 服务端socket事件：处理新连接
                    accept_wrapper(key.fileobj)
                else:
                    # 客户端socket事件：处理数据
                    conn = key.fileobj
                    addr = key.data
                    service_client(conn, addr)

        # 服务停止：清理资源
        print("关闭所有连接...")
        # 注销所有注册的socket并关闭
        for key in sel.get_map().values():
            sock = key.fileobj
            try:
                sock.close()
            except OSError as e:
                print(f"关闭socket失败: {e}")
        sel.close()
        print("服务已关闭")

if __name__ == "__main__":
    main()