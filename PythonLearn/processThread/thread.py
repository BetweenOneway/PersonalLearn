import random
import time,threading

def thread_proc(urls):
    currentThreadName = threading.current_thread().name
    print('Current %s is running...'% currentThreadName)
    for url in urls:
        print('%s--->%s'%(currentThreadName,url))
        time.sleep(random.random())
    print('%s ended.'%(currentThreadName))

def CreateThreadMethod1():
    # 这里获取的线程名是MainThread
    print('%s is running...' % (threading.current_thread().name))
    t1 = threading.Thread(target=thread_proc,name="Thread_1",args=(['url_1','url_2','url_3'],))
    t2 = threading.Thread(target=thread_proc,name="Thread_2",args=(['url_4','url_5','url_6'],))

    t1.start()
    t2.start()

    t1.join()
    t2.join()

    print('%s ended' % (threading.current_thread().name))

class myThread(threading.Thread):
    def __init__(self,name,urls):
        threading.Thread.__init__(self,name=name)
        self.urls = urls
    
    def run(self):
        currentThreadName = threading.current_thread().name
        print('Current %s is running...'%(currentThreadName))
        
        for url in self.urls:
            print('%s--->%s'%(currentThreadName,url))
            time.sleep(random.random())

        print('%s ended.'%(currentThreadName))

# 第二种方式 以类的方式创建线程
def CreateThreadMethod2():
    # 这里获取的线程名是MainThread
    print('%s is running...' % (threading.current_thread().name))

    t1 = myThread(name="Thread3",urls=['url_7','url_8','url_9'])
    t2 = myThread(name="Thread4",urls=['url_10','url_11','url_12'])

    t1.start()
    t2.start()

    t1.join()
    t2.join()

    print('%s ended' % (threading.current_thread().name))

if __name__=="__main__":
    CreateThreadMethod2()