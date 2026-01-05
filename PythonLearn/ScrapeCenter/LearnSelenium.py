from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from time import sleep

def testSelenium():
    browser = webdriver.Edge()
    browser.get('https://www.baidu.com')
    sleep(2)
    browser.close()

def SeleniumUsage():
    try:
        browser = webdriver.Edge()
        browser.get('https://www.baidu.com')
        #这里要实时分析网站的具体元素
        input = browser.find_element(By.ID,'chat-textarea')
        # 输入要查找的内容
        input.send_keys('Python')
        # 回车
        input.send_keys(Keys.ENTER)
        # 显示等待 针对单个条件 / 元素
        wait = WebDriverWait(browser,10)
        #等待 ID 为 content_left 的元素出现在 DOM 中
        # presence_of_element_located判断一个元素是否存在于页面DOM树中
        wait.until(EC.presence_of_element_located((By.ID,'content_left')))
        print(browser.current_url)
        print(browser.get_cookies())
        print(browser.page_source)
    finally:
        browser.close()

if __name__=='__main__':
    SeleniumUsage()
