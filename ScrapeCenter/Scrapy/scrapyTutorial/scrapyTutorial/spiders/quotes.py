import scrapy
from scrapyTutorial.items import QuoteItem

class QuotesSpider(scrapy.Spider):
    # 爬虫名
    name = "quotes"
    # 允许爬取的域名
    allowed_domains = ["quotes.toscrape.com"]
    # 启动时爬取的URL列表
    start_urls = ["https://quotes.toscrape.com"]

    # start_urls中的链接请求完成下载后，会调用parse方法
    def parse(self, response):
        quotes = response.css('.quote')
        for quote in quotes:
            item = QuoteItem()
            # 这里不是标准CSS写法，伪元素是Scrapy的扩展用法
            item['text'] = quote.css('.text::text').extract_first()
            item['author'] = quote.css('.author::text').extract_first()
            item['tags'] = quote.css('.tags .tag::text').extract()
            yield item
        
        #下一页爬取
        next = response.css('.pager .next a::attr("href")').extract_first()
        url = response.urljoin(next)
        yield scrapy.Request(url=url,callback=self.parse)
