# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class NewsItem(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    publish_time = scrapy.Field()
    author = scrapy.Field()
    content = scrapy.Field()
    category = scrapy.Field()
