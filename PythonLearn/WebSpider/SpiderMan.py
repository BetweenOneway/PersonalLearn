# coding:utf-8
from DataOutput import DataOutput
from HtmlDownloader import HtmlDownloader
from HtmlParser import HtmlParser
from URLManager import UrlManager

import traceback
class SpiderMain(object):
    def __init__(self):
        self.manager = UrlManager()
        self.downloader = HtmlDownloader()
        self.parser = HtmlParser()
        self.output = DataOutput()

    def crawl(self,root_url):
        self.manager.add_new_url(root_url)
        while(self.manager.has_new_url() and self.manager.old_url_size()<100):
            try:
                new_url = self.manager.get_new_url()
                html = self.downloader.download(new_url)
                
                print("download url=>",new_url)
                
                parseResult = self.parser.parser(new_url,html)
                if len(parseResult) > 0:
                    self.manager.add_new_urls(parseResult[0])
                    self.output.store_data(parseResult[1])
                print("已经抓取了%s个链接"%self.manager.old_url_size())
            except Exception as e:
                print("crawl failed:",e)
                traceback.print_exc()
        self.output.output_html("d:/baike.html")

if __name__=="__main__":
    print("Start run SpiderMan")
    spider_man = SpiderMain()
    spider_man.crawl("https://ssr1.scrape.center/")