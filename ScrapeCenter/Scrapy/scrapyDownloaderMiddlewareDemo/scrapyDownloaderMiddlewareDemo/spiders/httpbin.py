import scrapy


class HttpbinSpider(scrapy.Spider):
    name = "httpbin"
    allowed_domains = ["www.httpbin.org"]
    start_urls = ["https://www.httpbin.org"]

    def parse(self, response):
        request = response.request
        print("\n===== 请求信息 =====")
        print(f"URL: {request.url}")
        print(f"方法: {request.method}")
        print(f"请求头: {dict(request.headers)}")
        print(f"请求体: {request.body}")
        print("====================\n")

        print("\n===== 响应信息 =====")
        print("response.text=>",response.text)
