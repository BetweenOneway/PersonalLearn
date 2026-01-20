# CSS位置偏移反扒案例
from selenium import webdriver
from pyquery import PyQuery as pq
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from playwright.sync_api import sync_playwright
import re

def parse_name(name_html):
    # 输入类似 <h3 class="name"><span class="char"></h3>
    # 或者<h3 class="whole"></h3>
    #print("input name_html=>",name_html)
    has_whole = name_html('.whole')
    if has_whole:
        return name_html.text()
    else:
        chars = name_html('.char')
        #print("type(chars)=>",type(chars))
        #print("chars=>",chars)
        items = []
        for char in chars.items():
            items.append(
                {
                    'text':char.text().strip(),
                    'left':int(re.search(r'(\d+)px',char.attr('style')).group(1))
                }
            )
        # 根据偏移量排序
        items = sorted(items,key=lambda x:x['left'],reverse=False)
        # 拼接排序后的名称
        return ''.join([item.get('text') for item in items])

def SeleniumVersion():
    browser = webdriver.Chrome()
    browser.get('https://antispider3.scrape.center')
    WebDriverWait(browser,10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR,'.item')))
    html = browser.page_source
    doc = pq(html)
    names = doc('.item .name')
    for name_html in names.items():
        name = parse_name(name_html)
        print(name)
    browser.close()

def PlaywrightVersion():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        with browser.new_page() as page:
            page.goto('https://antispider3.scrape.center')
            page.wait_for_selector('.item',timeout=10000)
            html = page.content()
            doc = pq(html)
            names = doc('.item .name')
            for name_html in names.items():
                name = parse_name(name_html)
                print(name)

if __name__=='__main__':
    #SeleniumVersion()
    PlaywrightVersion()