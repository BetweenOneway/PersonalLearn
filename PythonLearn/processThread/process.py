import os,time,random
from multiprocessing import Process
from multiprocessing import Pool

def run_proc(name):
    print('Child process %s(%s) is running...'%(name,os.getpid()))

# 测试进程的创建
def CreateProcess():
    print('Parent process %s.'%(os.getpid()))
    for i in range(5):
        p = Process(target=run_proc,args=(str(i),))
        print('process will start')
        p.start()
    p.join()
    print('process end.')

def run_task(name):
    print('task %s (pid=%s)is running...'%(name,os.getpid()))
    time.sleep(random.random()*3)
    print('task %s end.'%(name))

# 进程池
def ProcessPool():
    p = Pool(processes=3)
    for i in range(5):
        p.apply_async(run_task,args=(i,))
    print('waiting for all subprocesses done...')
    p.close()
    p.join()
    print('all sub processes done')

if __name__ == '__main__':
    # CreateProcess()
    ProcessPool()