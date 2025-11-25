# coding:utf-8
import re
from urllib import parse
from bs4 import BeautifulSoup

class HtmlParser(object):
    def parser(self,page_url,html_cont):
        if page_url is None or html_cont is None:
            print("Parser input param error")
            return []
        soup = BeautifulSoup(html_cont,'html.parser')
        # 查找网页中的所有超链接
        new_urls = self._get_new_urls(page_url,soup)
        # 
        new_data = self._get_new_data(page_url,soup)
        return [new_urls,new_data]
    
    def _get_new_urls(self,page_url,soup):
        new_urls = set()
        links = soup.find_all('a',href=re.compile(r'detail'))
        for link in links:
            new_url = link['href']
            new_full_url=parse.urljoin(page_url,new_url)
            new_urls.add(new_full_url)
        return new_urls
    
    def _get_new_data(self,page_url,soup):
        data = {}
        data['url']=page_url
        title=soup.find('a',class_='name').find('h2')
        data['title']=title.get_text()
        # summary = soup.find('div',class_='lemma-summary')
        # data['summary'] = summary.get_text()
        return data