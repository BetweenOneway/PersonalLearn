from gevent import monkey
import gevent.pool
monkey.patch_all()
import urllib.request
from gevent.pool import Pool
import gevent

global urls

def run_task(url):
    print('visit -->%s'%url)
    try:
        response = urllib.request.urlopen(url)
        data = response.read()
        print('%d bytes reveived from %s.'%(len(data),url))
    except Exception as e:
        print(e)
    return 'url:%s-->finish'%url

# 协程池的方式
def runWithPool():
    pool = Pool(2)
    # urls=['https://cn.bing.com/','https://www.python.org','https://www.cnblogs.com/']
    results = pool.map(run_task,urls)
    print(results)

# 直接使用协程方式
def simpleCoroutine():
    # urls=['https://cn.bing.com/','https://www.python.org','https://www.cnblogs.com/']
    greenlets = [gevent.spawn(run_task,url) for url in urls]
    gevent.joinall(greenlets)

if __name__=='__main__':
    urls=['https://cn.bing.com/','https://www.python.org','https://www.cnblogs.com/']
    # runWithPool()
    simpleCoroutine()