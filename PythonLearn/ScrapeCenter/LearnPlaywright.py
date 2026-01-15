import asyncio
from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright
from datetime import datetime
import re
import time

# 同步模式
def launchPlaywright():
    with sync_playwright() as p:
        for browser_type in[p.chromium,p.firefox,p.webkit]:
            # 会弹出浏览器页面
            browser = browser_type.launch(headless=False)
            page = browser.new_page()
            page.goto('https://www.baidu.com')
            # 会在当前目录下创建屏幕截图
            page.screenshot(path=f'screenshot-{browser_type.name}.png')
            print(page.title())
            browser.close()

async def asyncPlayright():
    async with async_playwright()as p:
        for browser_type in [p.chromium,p.firefox,p.webkit]:
            # 不会弹出浏览器页面
            browser = await browser_type.launch()
            page = await browser.new_page()
            await page.goto('https://www.baidu.com')
            await page.screenshot(path=f'screenshot-{browser_type.name}.png')
            print(await page.title())
            await browser.close()

def TestAsyncPlayRight():
    asyncio.run(asyncPlayright())

def TestPalyrightEdge():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge",headless=False)
        # 使用 with 语句管理 Page 对象，自动释放资源
        with browser.new_page() as page:
            page.goto('https://www.baidu.com')
            # 会在当前目录下创建屏幕截图
            # 获取当前日期和时间
            current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
            page.screenshot(path=f'screenshot-{current_time}.png')
            print(page.title())
        # 浏览器会在 with 块结束后自动关闭，也可手动调用 browser.close() 确保关闭
        browser.close()

# 演示路由劫持，不下载图片
def RouteHijack():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        def cancel_request(route,request):
            route.abort()
        
        # 所有有.png .jpg的链接请求会调用cancel_request函数
        page.route(re.compile(r"(\.png)|(\.jpg)"),cancel_request)
        page.goto("https://spa6.scrape.center/")
        page.wait_for_load_state('networkidle')
        page.screenshot(path='no_picture.png')
        browser.close()

# 演示路由劫持，并替换为自定义页面
def RouteHijack2():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        def modify_response(route,request):
            print('请求URL：', request.url)  # 打印实际请求的URL
            print('请求方法：', request.method)  # 打印请求方法（GET/POST等）
            print('请求类型：', request.resource_type)  # 打印请求资源类型
            print('Hijack response --- 路由劫持成功')
            # 向页面返回自定义的响应
            # 以本地文件的方式相应
            #route.fulfill(path='./custom_response.html')
            # 自定义构造响应内容
            route.fulfill(
                status=200,
                headers={"Content-Type": "text/html"},
                body='<html><head><meta charset="UTF-8"></head><body><h1>全新构造的响应内容</h1></body></html>'
            )

        # 该写法仅匹配了 / 根路径精确请求， 而实际请求的是具体的URL，会导致拦截失败
        #page.route('/',modify_response)
        # 匹配该域名下所有请求（兜底，确保拦截生效，* 是通配符）
        page.route('https://spa6.scrape.center/**', modify_response)
    
        page.goto('https://spa6.scrape.center')
        time.sleep(5)
        browser.close()


def on_response(response):
    print(f'Status {response.status}:{response.url}')

# 事件监听
def EventListener():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.on('response',on_response)
        page.goto('https://spa6.scrape.center')
        page.wait_for_load_state('networkidle')
        browser.close()

if __name__=="__main__":
    EventListener()