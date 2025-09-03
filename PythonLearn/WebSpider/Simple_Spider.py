# file: simple_spider.py

import requests
from bs4 import BeautifulSoup

def fetch_title(url):
    try:
        # 1. 发送 GET 请求
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # 如果状态码不是 200，引发 HTTPError

        # 2. 设置正确的编码
        response.encoding = response.apparent_encoding

        # 3. 解析 HTML
        soup = BeautifulSoup(response.text, 'lxml')

        # 4. 提取 <title> 标签内容
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text().strip()
        else:
            return '未找到 title 标签'
    except Exception as e:
        return f'抓取失败：{e}'

if __name__ == '__main__':
    url = 'https://news.qq.com/rain/a/20250903A02BJ400'
    title = fetch_title(url)
    print(f'网页标题：{title}')