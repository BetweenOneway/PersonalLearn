import asyncio
import requests
import time

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

async def get(url):
    # 也就是这里的get不支持异步操作
    return requests.get(url)

async def request():
    url = "https://www.httpbin.org/delay/5"
    print("waiting for ",url)
    # 这里虽然用了await但是不会起作用 。只有使用支持异步操作的请求方式才可以实现真正的异步
    response = await get(url)
    print('get response from',url,'response',response)

start = time.time()

def Impl5():
    tasks = [asyncio.ensure_future(request()) for _ in range(10)]
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.wait(tasks))

    end = time.time()
    print('Cost time:',end - start)

if __name__=="__main__":
    Impl5()