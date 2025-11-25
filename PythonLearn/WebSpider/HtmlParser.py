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
        a_tag = soup.find('a', class_='name')
        if a_tag:
            h2_tag = a_tag.find('h2')
            print(h2_tag)  # 找到则输出 h2 标签，否则输出 None
            data['title']=h2_tag.get_text()
        else:
            print("not found title=>",a_tag)
        # title=soup.find('a',class_='name').find('h2')
        
        # summary = soup.find('div',class_='lemma-summary')
        # data['summary'] = summary.get_text()
        print("parsed data=>",data)
        return data