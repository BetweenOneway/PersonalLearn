import scrapy
from scrapy import Spider,Request
from scrapySpiderMiddlewareDemo.items import DemoItem

class HttpbinSpider(scrapy.Spider):
    name = "httpbin"
    allowed_domains = ["www.httpbin.org"]
    start_url = "https://www.httpbin.org/get"

    def parse(self, response):
        print('Status:',response.status)
        item = DemoItem(**response.json())
        yield item

    def start_requests(self):
        for i in range(5):
            url = f'{self.start_url}?query={i}'
            yield Request(url,callback=self.parse)
