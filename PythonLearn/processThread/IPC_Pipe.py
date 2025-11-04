import multiprocessing
import random
import time,os

def proc_send(pipe,urls):
    for url in urls:
        print("Process(%d) send=>%s"%(os.getpid(),url))
        pipe.send(url)
        time.sleep(random.random())

def proc_recv(pipe):
    while True:
        print("Process(%d) recv<==%s"%(os.getpid(),pipe.recv()))
        time.sleep(random.random())

if __name__=="__main__":
    pipe = multiprocessing.Pipe()
    pSender = multiprocessing.Process(target=proc_send,args=(pipe[0],['url_'+str(i) for i in range(10)]))
    pRecver = multiprocessing.Process(target=proc_recv,args=(pipe[1],))

    pSender.start()
    pRecver.start()

    pSender.join()
    # 稍微等待下 否则接收进程会收不到最后一条消息
    time.sleep(2)
    pRecver.terminate()