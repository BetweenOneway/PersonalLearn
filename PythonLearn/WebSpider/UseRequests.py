import requests
import chardet

# 使用requests读取网站内容
def request1():
    r = requests.get('http://www.baidu.com')
    print('content--->')
    # 字节形式返回
    print(r.content)
    # 文本形式
    print('text--->'+r.text)
    # 根据HTTP头猜测的网页编码格式
    print('encoding-->'+r.encoding)
    r.encoding='utf-8'
    print('new text-->'+r.text)

# 使用chardet自动检测编码
def request2():
    r=requests.get("http://www.baidu.com")
    print(chardet.detect(r.content))
    r.encoding = chardet.detect(r.content)['encoding']
    print(r.text)

# 以流的形式读取相应
def request3():
    r = requests.get("http://www.baidu.com",stream=True)
    # 输出是不可读的二进制字符 b'\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff'
    print(r.raw.read(10))

# 带有自定义请求头的requests
def request4():
    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
    headers={'User-Agent':user_agent}
    r = requests.get('http://www.baidu.com',headers=headers)
    print(r.content)

# 获取响应码和相应头
def request5():
    r = requests.get('http://www.baidu.com')
    if r.status_code == requests.codes.ok:
        # 响应码
        print(r.status_code)
        # 相应头
        print(r.headers)
        # 推荐使用该方式 获取其中的某个字段
        print(r.headers.get('content-type'))
        # 不推荐使用
        print(r.headers['content-type'])
    else:
        # 当响应码是4或者5开头，会抛出异常；200时返回None
        r.raise_for_status()

# 遍历cookie
def request6():
    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
    headers={'User-Agent':user_agent}
    r = requests.get('http://www.baidu.com',headers=headers)
    for cookie in r.cookies.keys():
        print(cookie+":"+r.cookies.get(cookie))

# 请求带cookie
def request7():
    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
    headers={'User-Agent':user_agent}
    cookies = dict(name='qiye',age='10')
    r = requests.get('http://www.baidu.com',headers=headers,cookies=cookies)
    print(r.text)

# 演示需要登录的页面请求
def request8():
    loginUrl=""
    s=requests.Session()
    #首先访问登录界面
    r=s.get(loginUrl,allow_redirects=True)
    datas={'name':'qiye','passwd':'qiye'}
    #向登录连接发送post请求 验证成功
    r = s.post(loginUrl,data=datas,allow_redirects=True)
    print(r.text)

# 重定向
def request9():
    r = requests.get('http://github.com')
    print(r.url)
    print(r.status_code)
    print(r.history)

# 超时设置

if __name__=="__main__":
    request7()