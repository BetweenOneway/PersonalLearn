import requests
import logging
import time

logging.basicConfig(level=logging.INFO,format='%(asctime)s-%(levelname)s:%(message)s')

TOTAL_NUMBER=100

# httpbin是一个专门测试HTTP请求与相应的工具网站
URL='https://www.httpbin.org/delay/5'

def Impl1():
    start_time = time.time()
    for _ in range(1,TOTAL_NUMBER+1):
        logging.info('scraping %s',URL)
        response = requests.get(URL)
    end_time = time.time()
    logging.info('total time %s seconds',end_time-start_time)