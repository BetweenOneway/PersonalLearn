import asyncio
from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright
from datetime import datetime


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
                                    
if __name__=="__main__":
    TestPalyrightEdge()