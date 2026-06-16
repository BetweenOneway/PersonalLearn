import scrapy
from news.items import NewsItem

class QqSpider(scrapy.Spider):
    name = "qq"
    allowed_domains = ["news.qq.com"]
    start_urls = ["https://news.qq.com"]

    def parse(self, response):
        articles = response.css('article, .article-item, .news-item, .list-item')
        
        for article in articles:
            item = NewsItem()
            
            item['title'] = article.css('h2::text, h3::text, .title::text, a::text').get()
            item['url'] = article.css('a::attr(href)').get()
            
            if item['url']:
                if not item['url'].startswith('http'):
                    item['url'] = response.urljoin(item['url'])
                
                yield response.follow(item['url'], self.parse_article, meta={'item': item})
        
        next_page = response.css('a.next-page::attr(href), .pagination a.next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_article(self, response):
        item = response.meta['item']
        
        item['publish_time'] = response.css('.publish-time::text, .time::text, span.time::text').get()
        item['author'] = response.css('.author::text, .article-author::text').get()
        item['content'] = response.css('.article-content::text, .content::text, article p::text').getall()
        item['category'] = response.css('.category::text, .breadcrumb a::text').get()
        
        yield item
