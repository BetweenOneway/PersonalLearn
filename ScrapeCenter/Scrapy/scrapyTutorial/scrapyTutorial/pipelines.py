# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

from scrapy.exceptions import DropItem
import pymongo

class TextPipeline(object):
    def __init__(self):
        self.limit = 50

    def process_item(self,item,spider):
        if item['text']:
            if len(item['text']) > self.limit:
                item['text'] = item['text'][0:self.limit].rstrip()+'...'
            return item
        else:
            return DropItem('Missing Text')
        
class MongoDBPipeline(object):
    def __init__(self,connection_string,database):
        self.connection_string = connection_string
        self.database = database

    #获取配置
    @classmethod
    def from_crawler(cls,crawler):
        return cls(
            connection_string=crawler.settings.get('MONGODB_CONNECTION_STRING'),
            database=crawler.settings.get('MONGODB_DATABASE')
        )
    
    # 当spider开启时调用，初始化操作
    def open_spider(self,spider):
        self.client = pymongo.MongoClient(self.connection_string)
        self.db = self.client[self.database]

    #数据处理
    def process_item(self,item,spider):
        name = item.__class__.__name__
        self.db[name].insert_one(dict(item))
        return item
    
    #当spider关闭时调用，关闭数据库连接
    def close_spider(self,spider):
        self.client.close()