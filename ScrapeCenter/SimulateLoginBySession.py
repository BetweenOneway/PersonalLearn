import requests
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

BASE_URL ='https://login2.scrape.center/'
LOGIN_URL = urljoin(BASE_URL,'/login')
INDEX_URL = urljoin(BASE_URL,'/page/1')
USERNAME = 'admin'
PASSWORD = 'admin'

# 手动解析和赋值Cookie
def Way1():
    response_login = requests.post(LOGIN_URL,data={
        'username':USERNAME,
        'password':PASSWORD
    },allow_redirects=False)
    # 获取Cookie
    cookies = response_login.cookies
    print('Cookies=>',cookies)

    # 请求带上Cookie
    response_index = requests.get(INDEX_URL,cookies=cookies)
    print("Response Status=>",response_index.status_code)
    print('Response URL=>',response_index.url)

# 借助requests的Session对象自动处理Cookie
def Way2():
    session = requests.Session()

    response_login = session.post(LOGIN_URL,data={
        'username':USERNAME,
        'password':PASSWORD
    })

    cookies = session.cookies
    print('Cookies',cookies)

    response_index = session.get(INDEX_URL)
    print('Response Status=>',response_index.status_code)
    print('Response URL=>',response_index.url)

def SeleniumLogin():
    browser = webdriver.Chrom()
    browser.get(BASE_URL)
    browser.find_element(By.CSS_SELECTOR,'input[name="username"]').send_keys(USERNAME)
    browser.find_element(By.CSS_SELECTOR,'input[name="password"]').send_keys(USERNAME)
    browser.find_element(By.CSS_SELECTOR,'input[type="submit"]').click()
    time.sleep(10)

    #
    cookies = browser.get_cookies()
    print("Cookies=>",cookies)
    browser.close()

    #
    session = requests.Session()
    for cookie in cookies:
        session.cookies.set(cookie['name'],cookie['value'])
    response_index = session.get(INDEX_URL)
    print('Response Status=>',response_index.status_code)
    print('Response URL=>',response_index.url)

if __name__=="__main__":
    Way2()