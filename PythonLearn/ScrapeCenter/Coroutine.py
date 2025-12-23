import asyncio
import requests

async def execute(x):
    print('Number:',x)

def Impl1():
    # 这里调用async方法并未执行 而是返回一个coroutine对象
    coroutine=execute(1)
    print('Coroutine:',coroutine)
    print('after calling execute')

    '''
    在 Python 3.10 及更高版本中，推荐使用 asyncio.run() 
    来替代 asyncio.get_event_loop() 和 loop.run_until_complete()
    '''

    loop = asyncio.get_event_loop()
    # 这里会隐式进行一个操作将coroutine对象封装成task对象
    loop.run_until_complete(coroutine)
    print('After calling loop')

def Impl2():
    # 生成协程对象
    coroutine = execute(1)
    print('Coroutine:',coroutine)
    print('after calling execute')

    loop = asyncio.get_event_loop()
    # 显式创建task对象 将coroutine对象转换成task对象
    task = loop.create_task(coroutine)
    print("Task:",task)
    
    loop.run_until_complete(task)
    print("Task:",task)
    print("After calling loop")

async def request():
    url="https://www.baidu.com"
    status = requests.get(url)
    return status

def callback(task):
    print("Status:",task.result())

# 测试绑定回调
def Impl3():
    coroutine = request()
    task = asyncio.ensure_future(coroutine)
    task.add_done_callback(callback)
    print("Task:",task)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(task)
    print("Task:",task)
    print("Task Result:",task.result())

#多任务协程
def Impl4():
    tasks = [asyncio.ensure_future(request()) for _ in range(5)]
    print("Tasks:",tasks)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.wait(tasks))

    for task in tasks:
        print("Task Result:",task.result())

if __name__=="__main__":
    Impl4()