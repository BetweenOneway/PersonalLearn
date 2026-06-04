import scrapy
from scrapy import Request,Spider

class BookSpider(scrapy.Spider):
    name = "book"
    allowed_domains = ["antispider7.scrape.center"]
    base_url = "https://antispider7.scrape.center"
    max_page = 2

    async def start(self):
        for page in range(1,self.max_page+1):
            url = f'{self.base_url}/api/book/?limit=18&offset={(page-1)*18}'
            yield Request(url,callback=self.parse_index)

    def parse_index(self, response):
        print("parse_index",response)
