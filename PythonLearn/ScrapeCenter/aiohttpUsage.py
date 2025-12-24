import asyncio
import aiohttp
import time

start = time.time()

# 这里加async是为了创建协程对象
async def get(url):
    # 创建session这个是非阻塞的
    session = aiohttp.ClientSession()
    # 这是会被挂起的操作
    response = await session.get(url)
    # 对于一些返回协程对象的操作，前面需要加 await 来修饰
    await response.text()
    await session.close()
    return response

# 创建协程对象/task的函数
# 标记async的函数就是用来创建协程对象的
async def request():
    url = 'https://www.httpbin.org/delay/5'
    print('waiting for',url)
    # await后面只能是如下几种之一：
    # 原生协程对象
    # 一个由types.coroutine修饰的生成器
    # 一个包含_await_方法的对象返回的一个迭代器
    response = await get(url)
    print("Get response from ",url,'response',response)

tasks = [asyncio.ensure_future(request()) for _ in range(10)]
# 创建事件循环
loop = asyncio.get_event_loop()
# 将task列表给wait
# 注册到事件循环中
loop.run_until_complete(asyncio.wait(tasks))

end = time.time()
print('Cost time:',end - start)