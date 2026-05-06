import scrapy
from scrapy import Request,Spider

class ScrapeSpider(scrapy.Spider):
    name = "scrape"
    allowed_domains = ["ssr1.scrape.center"]
    base_url='https://ssr1.scrape.center'
    max_page = 10

    def start_requests(self):
        for i in range(1,self.max_page+1):
            url = f'{self.base_url}/page/{i}'
            yield Request(url,callback=self.parse_index)
    
    def parse_index(self, response):
        for item in response.css('.item'):
            href = item.css('.name::attr(href)').extract_first()
            url = response.urljoin(href)
            yield Request(url,callback=self.parse_detail)

    def parse_detail(self,response):
        print(response)
