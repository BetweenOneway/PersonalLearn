# coding:utf-8
import time
from multiprocessing import Queue  # 使用 multiprocessing 的 Queue，而非 queue.Queue
from multiprocessing.managers import BaseManager

# 定义全局队列（使用 multiprocessing.Queue，支持跨进程序列化）
task_queue = Queue()
result_queue = Queue()

# 封装队列的获取函数（避免直接引用全局对象导致序列化问题）
def get_task_queue():
    return task_queue

def get_result_queue():
    return result_queue

# 自定义管理器
class QueueManager(BaseManager):
    pass

# 注册队列（必须通过函数引用，不能直接传队列对象）
QueueManager.register('get_task_queue', callable=get_task_queue)
QueueManager.register('get_result_queue', callable=get_result_queue)

if __name__ == '__main__':  # Windows 必须加这句，避免子进程无限递归
    # 初始化管理器，绑定端口和认证密钥
    manager = QueueManager(address=('127.0.0.1', 8001), authkey=b'auth')
    manager.start()
    print('Manager started...')

    # 获取网络可访问的队列对象
    task = manager.get_task_queue()
    result = manager.get_result_queue()

    # 添加任务
    for i in range(10):
        url = f'ImageUrl_{i}'
        print(f'Put task: {url}')
        task.put(url)

    # 获取结果（等待 worker 处理）
    print('Waiting for results...')
    try:
        for i in range(10):
            # 超时时间可根据实际情况调整 单位秒
            res = result.get(timeout=30)
            print(f'Result {i+1}: {res}')
    except Exception as e:
        print(f'Get result error: {e}')

    # 关闭管理器
    manager.shutdown()
    print('Manager shutdown.')