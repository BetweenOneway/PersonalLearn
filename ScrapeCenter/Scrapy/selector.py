from scrapy import Selector

# 单独使用Scrapy 的selector
body = 'html><head><title>Hello World</title></head><body></body><lhtml>'
selector = Selector(text=body)
title = selector.xpath('//title/text()').extract_first()
print(title)