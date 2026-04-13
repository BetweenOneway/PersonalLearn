import scrapy


class HttpbinSpider(scrapy.Spider):
    name = "httpbin"
    allowed_domains = ["www.httpbin.org"]
    start_urls = ["https://www.httpbin.org"]

    def parse(self, response):
        print('url',response.url)
        print('request',response.request)
        print('status',response.status)
        print('headers',response.headers)
        print('text',response.text)
        print('meta',response.meta)
