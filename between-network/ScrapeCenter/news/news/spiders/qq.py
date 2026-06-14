import scrapy


class QqSpider(scrapy.Spider):
    name = "qq"
    allowed_domains = ["news.qq.com"]
    start_urls = ["https://news.qq.com"]

    def parse(self, response):
        pass
