import requests
import logging

logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s:%(message)s')

INDEX_URL='https://spa1.scrape.center/api/movie/?limit={limit}&offset={offset}'

# 获取指定URL内容 并将JSON格式的内容转换为Python的字典
def scrape_api(url):
    logging.info('scraping %s...',url)
    try:
        response = requests.get(url)
        if response.status_code == 200:
            # 转换为Python的字典
            return response.json()
        logging.error('get invalid status code %s while scraping %s',response.status_code,url)
    except requests.RequestException:
        logging.error('error occurred while scraping %s',url,exc_info=True)

LIMIT=10
def scrape_index(page):
    url=INDEX_URL.format(limit=LIMIT,offset=LIMIT*(page-1))
    return scrape_api(url)

DETAIL_URL='https://spa1.scrape.center/api/movie/{id}'

def scrape_detail(id):
    url = DETAIL_URL.format(id=id)
    return scrape_api(url)

TOTAL_PAGE=10

def main():
    for page in range(1,TOTAL_PAGE+1):
        index_data = scrape_index(page)
        logging.info('index data %s',index_data)
        # for item in index_data.get('results'):
        #     id = item.get('id')
        #     detail_data = scrape_detail(id)
        #     logging.info('detail data %s',detail_data)

if __name__=='__main__':
    main()