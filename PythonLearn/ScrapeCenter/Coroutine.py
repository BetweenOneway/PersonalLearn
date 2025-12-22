import asyncio

async def execute(x):
    print('Number:',x)

def Impl1():
    coroutine=execute(1)
    print('Coroutine:',coroutine)
    print('after calling execute')

    '''
    在 Python 3.10 及更高版本中，推荐使用 asyncio.run() 
    来替代 asyncio.get_event_loop() 和 loop.run_until_complete()
    '''

    loop = asyncio.get_event_loop()
    loop.run_until_complete(coroutine)
    print('After calling loop')

def Impl2():
    # 生成协程对象
    coroutine = execute(1)
    print('Coroutine:',coroutine)
    print('after calling execute')

    loop = asyncio.get_event_loop()
    task = loop.create_task(coroutine)
    print("Task:",task)
    
    loop.run_until_complete(task)
    print("Task:",task)
    print("After calling loop")

if __name__=="__main__":
    Impl2()