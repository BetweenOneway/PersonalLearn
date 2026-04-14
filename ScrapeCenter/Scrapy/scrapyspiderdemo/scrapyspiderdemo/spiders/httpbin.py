import scrapy
from scrapy import Request
from scrapy.http import JsonRequest,FormRequest

ORIGIN_1 = False
GET_1 = False
POST_1 = True

if ORIGIN_1:
    class HttpbinSpider(scrapy.Spider):
        name = "httpbin"
        allowed_domains = ["www.httpbin.org"]
        start_urls = ["https://www.httpbin.org"]

        def parse(self,response):
            print('url',response.url)
            print('request',response.request)
            print('status',response.status)
            print('headers',response.headers)
            print('text',response.text)
            print('meta',response.meta)

if GET_1:
    # 自定义请求 GET
    class HttpbinSpider(scrapy.Spider):
        name = "httpbin"
        allowed_domains = ["www.httpbin.org"]
        start_url = 'https://www.httpbin.org/get'
        headers = {
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0'
        }
        cookies = {'name':'germey','age':'26'}

        # 重写start_requests方法
        def start_requests(self):
            for offset in range(5):
                url = self.start_url+f'?offset={offset}'
                yield Request(url,headers=self.headers,
                cookies=self.cookies,
                # 自定义解析函数名
                callback=self.parse_response,
                meta={'offset':offset})

        # 不再使用默认解析函数名parse，自定义名称
        def parse_response(self, response):
            print('url',response.url)
            print('request',response.request)
            print('status',response.status)
            print('headers',response.headers)
            print('text',response.text)
            print('meta',response.meta)

if POST_1:
    # 自定义请求 POST
    class HttpbinSpider(scrapy.Spider):
        name = "httpbin"
        allowed_domains = ["www.httpbin.org"]
        start_url = "https://www.httpbin.org/post"
        data = {'name':'germey','age':'26'}

        def start_requests(self):
            # Form请求 发送Form表单给服务器 application/x-www-form-urlencoded
            yield FormRequest(self.start_url,
            callback=self.parse_response,
            formdata = self.data)
            # Json请求 发送Json数据给服务器 application/json
            yield JsonRequest(self.start_url,
            callback=self.parse_response,
            data=self.data)

        def parse_response(self,response):
            print('text',response.text)