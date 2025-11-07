import random,time,Queue 
from multiprocessing.managers import BaseManager

# 定义队列 用于存放任务和结果
task_queue=Queue.Queue()
result_queue=Queue.Queue()

class QueueManager(BaseManager):
    pass

# 把创建的两个队列注册在网络上 并暴露
QueueManager.register('get_task_queue',callable=lambda:task_queue)
QueueManager.register('get_result_queue',callable=lambda:result_queue)

# 对象初始化 绑定端口和口令
manager=QueueManager(address=('',8001),authkey='auth')

manager.start()

# 获取通过网络访问的Queue对象
task = manager.get_task_queue()
result = manager.get_result_queue()

# 添加任务
for url in ['ImageUrl_'+i for i in range(10)]:
    print('put task %s ...'%url)
    task.put(url)

# 获取结果
print('try get result...')
for i in range(10):
    print('result is %s'%(result.get(timeout=10)))

# 关闭管理
manager.shutdown()
