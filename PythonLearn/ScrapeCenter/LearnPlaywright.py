import asyncio
from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright

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

if __name__=="__main__":
    TestAsyncPlayRight()