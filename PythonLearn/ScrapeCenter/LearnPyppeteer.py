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

def PyppeteerUsage1():
    asyncio.get_event_loop().run_until_complete(asyncPyppeteerUsage1())

if __name__=="__main__":
    PyppeteerUsage1()
