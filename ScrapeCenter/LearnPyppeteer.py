import asyncio
from pyppeteer import launch
from pyquery import PyQuery as pq

async def asyncPyppeteerUsage1():
    browser = await launch()
    page = await browser.newPage()
    await page.goto('https://spa1.scrape.center')
    await page.waitForSelector('.item .name',
                               {'timeout': 1000*60})
    doc = pq(await page.content())
    names = [item.text() for item in doc('.item .name').items()]
    print('Names:',names)
    await browser.close()

async def PyppeteerHeadless():
    await launch(headless=False)
    await asyncio.sleep(100)

async def PyppeteerWebDriver():
    # 原来的args=['--disable-infobars']失效了 用下面这个方法替代
    browser = await launch(
        {
            'headless':False,
            'ignoreDefaultArgs': ['--enable-automation']
        })
    page = await browser.newPage()
    # 设置窗口大小
    width,height = 1366,768
    await page.setViewport({
        'width':width,
        'height':height
    })
    # 绕过webdriver检测
    await page.evaluateOnNewDocument('Object.defineProperty(navigator,"webdriver",{get:()=>undefined})')
    await page.goto('https://antispider1.scrape.center')
    await asyncio.sleep(100)

def PyppeteerUsage():
    # asyncio.get_event_loop().run_until_complete(asyncPyppeteerUsage1())
    # asyncio.get_event_loop().run_until_complete(PyppeteerHeadless())
    asyncio.get_event_loop().run_until_complete(PyppeteerWebDriver())

if __name__=="__main__":
    PyppeteerUsage()
