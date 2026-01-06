from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver import ActionChains
from selenium.webdriver.edge.options import Options as EdgeOptions
from time import sleep
import time

edgeBrowser = webdriver.Edge()

def testSelenium():
    edgeBrowser.get('https://www.baidu.com')
    sleep(2)
    edgeBrowser.close()

def SeleniumUsage():
    try:
        # get方法请求网页
        edgeBrowser.get('https://www.baidu.com')
        #这里要实时分析网站的具体元素
        input = edgeBrowser.find_element(By.ID,'chat-textarea')
        # 输入要查找的内容
        input.send_keys('Python')
        # 回车
        input.send_keys(Keys.ENTER)
        # 显示等待 针对单个条件 / 元素
        wait = WebDriverWait(edgeBrowser,10)
        #等待 ID 为 content_left 的元素出现在 DOM 中
        # presence_of_element_located判断一个元素是否存在于页面DOM树中
        wait.until(EC.presence_of_element_located((By.ID,'content_left')))
        print(edgeBrowser.current_url)
        print(edgeBrowser.get_cookies())
        # 控制台输出页面源码
        print(edgeBrowser.page_source)
    finally:
        edgeBrowser.close()

def SeleniumDragDrop():
    url = 'http://www.runoob.com/try/try.php?filename=jqueryui-api-droppable'
    edgeBrowser.get(url)
    # 切换frame
    edgeBrowser.switch_to.frame('iframeResult')
    source = edgeBrowser.find_element(By.CSS_SELECTOR,'#draggable')
    target = edgeBrowser.find_element(By.CSS_SELECTOR,'#droppable')
    actions = ActionChains(edgeBrowser)
    actions.drag_and_drop(source,target)
    actions.perform()

def SeleniumExecutScript():
    edgeBrowser.get('https://www.zhihu.com/explore')
    edgeBrowser.execute_script('window.scrollTo(0,document.body.scrollHeight)')
    edgeBrowser.execute_script('alert("To Bottom")')

# 在不同的选项卡之间切换
def SeleniumTabs():
    edgeBrowser.get('https://www.baidu.com')
    # 打开新的标签页
    edgeBrowser.execute_script('window.open()')
    print(edgeBrowser.window_handles)
    # 在新标签页中打开知乎
    edgeBrowser.switch_to.window(edgeBrowser.window_handles[1])
    edgeBrowser.get('https://www.zhihu.com/explore')
    time.sleep(1)
    # 切换到第一个标签页
    edgeBrowser.switch_to.window(edgeBrowser.window_handles[0])
    # 在第一个标签页中打开新的网站
    edgeBrowser.get('https://python.org')

# 修改Selenium属性达到反反爬虫的效果
def SeleniumAntiAntiSpider():
    option = EdgeOptions()
    option.add_experimental_option('excludeSwitches',['enable-automation'])
    option.add_experimental_option('useAutomationExtension',False)
    browser = webdriver.Edge(options=option)
    browser.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument',{
        'source':'Object.defineProperty(navigator,"webdriver",{get:()=>undefined})'
    })
    browser.get('https://antispider1.scrape.center')
    time.sleep(5)

if __name__=='__main__':
    SeleniumAntiAntiSpider()
