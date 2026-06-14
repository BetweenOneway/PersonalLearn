import scrapy

class NesSpiderItem(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    publish_time = scrapy.Field()
    author = scrapy.Field()
    content = scrapy.Field()
    category = scrapy.Field()
