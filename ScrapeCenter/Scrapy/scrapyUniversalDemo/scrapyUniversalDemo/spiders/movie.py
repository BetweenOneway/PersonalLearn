import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

from scrapyUniversalDemo.items import MovieItem

class MovieSpider(CrawlSpider):
    name = "movie"
    allowed_domains = ["ssr1.scrape.center"]
    start_urls = ["https://ssr1.scrape.center"]

    rules = (
        Rule(LinkExtractor(restrict_css='.item .name'), callback="parse_detail", follow=True),
        Rule(LinkExtractor(restrict_css='.next'),follow=True),)

    def parse_item(self, response):
        print('call parse_item')
        item = {}
        #item["domain_id"] = response.xpath('//input[@id="sid"]/@value').get()
        #item["name"] = response.xpath('//div[@id="name"]').get()
        #item["description"] = response.xpath('//div[@id="description"]').get()
        return item
    
    def parse_detail(self,response):
        print(response.url)
        item = MovieItem()
        item['name'] = response.css('.item h2::text').extract_first()
        item['categories'] = response.css('.categories button span::text').extract_first()
        item['cover'] = response.css('.cover::attr(src)').extract_first()
        item['published_at'] = response.css('.info span::text').re_first('(\d{4}-\d{2}-\d{2})\s?上映')
        item['score'] = response.xpath('//p[contains(@class,"score")]/text()').extract_first().strip()
        item['drama'] = response.xpath('//div[contains(@class,"drama")]/p/text()').extract_first().strip()
        yield item
