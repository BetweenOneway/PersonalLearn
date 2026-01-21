from selenium import webdriver
from pyquery import PyQuery as pq
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
import re
import requests

url = 'https://antispider4.scrape.center/css/app.654ba59e.css'
icon_map = {}
def ParseCSS():
    response = requests.get(url)
    pattern = re.compile(r'.icon-(.*?):before{content:"(.*?)"}')
    results = re.findall(pattern,response.text)
    global icon_map  # 声明使用全局变量，而非创建局部变量
    icon_map = {item[0]:item[1] for item in results}
    print("ParseCSS icon_map=>",len(icon_map))

def ParseScore(item):
    print("ParseScore =>",len(item))
    print("ParseScore =>",len(icon_map))
    elements = item('.icon')
    icon_values = []
    for element in elements.items():
        class_name = (element.attr('class'))
        icon_key= re.search(r'icon-(\d+)',class_name).group(1)
        icon_value = icon_map.get(icon_key)
        icon_values.append(icon_value)
    return ''.join(icon_values)

def SeleniumVersion():
    browser = webdriver.Chrome()
    # 源网址里 score字段是由字体文件生成的，无法直接获取
    browser.get('https://antispider4.scrape.center')
    WebDriverWait(browser,10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR,'.item')))
    html = browser.page_source
    doc = pq(html)
    items = doc('.item')
    ParseCSS()
    for item in items.items():
        name = item('.name').text()
        categories = [o.text() for o in item('.categories button').items()]
        score = ParseScore(item)
        print(f'name:{name} categories:{categories},score:{score}')
    browser.close()

if __name__=='__main__':
    SeleniumVersion()