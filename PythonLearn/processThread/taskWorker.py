import time
from multiprocessing.managers import BaseManager

class QueueManager(BaseManager):
    pass

# 注册用于获取Queue的方法名称
QueueManager.register('get_task_queue')
QueueManager.register('get_result_queue')

server_addr='127.0.0.1'
# 端口和验证口令需要保持和服务进程完全一致
m = QueueManager(address=(server_addr,8001),authkey='auth')

# 网络连接
m.connect()

# 获取Queue对象
task = m.get_task_queue()
result = m.get_result_queue()

# 从task队列获取任务，并把结果写入result队列
while(not task.empty()):
    image_url = task.get(True,timeout=5)
    print('run task download %s ...'%image_url)
    time.sleep(1)
    result.put('%s--->success'%image_url)

print('worker exit.')