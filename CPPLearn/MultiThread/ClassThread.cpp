
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>  // 互斥锁头文件
#include "ClassThread.h"
#include "MultiThread.h"

class T
{
public:
    void Func()
    {
        std::cout << "Func 启动线程..." << std::endl;
        std::thread t1(&T::ThreadFunc1, this);
        std::thread t2(&T::ThreadFunc2, this);

        t1.join();
        t2.join();
        std::cout << "所有线程执行完毕，m = " << m << std::endl;
    }

private:
    int m = 0;                // 共享成员变量
    std::mutex mtx;           // 互斥锁，保护变量 m

    void ThreadFunc1()
    {
        for (int i = 0; i < 5; ++i)
        {
            // 进入作用域自动加锁，出作用域自动解锁
            std::lock_guard<std::mutex> lock(mtx);
            m++;
            std::cout << "Thread1: m = " << m << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    }

    void ThreadFunc2()
    {
        for (int i = 0; i < 5; ++i)
        {
            std::lock_guard<std::mutex> lock(mtx);
            m--;
            std::cout << "Thread2: m = " << m << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    }
};

class Common
{
protected:
    static int m_sharedVal;
    std::mutex mtx;
public:
    virtual void run() = 0;
    virtual ~Common() = default;
};
int Common::m_sharedVal = 0;

class ClassA : public Common
{
public:
    void run() override
    {
        for (int i = 0; i < 5; ++i)
        {
            std::lock_guard<std::mutex> lock(mtx);
            m_sharedVal++;
            std::cout << "A shared: " << m_sharedVal << "\n";
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    }
};

class ClassB : public Common
{
public:
    void run() override
    {
        for (int i = 0; i < 5; ++i)
        {
            std::lock_guard<std::mutex> lock(mtx);
            m_sharedVal++;
            std::cout << "B shared: " << m_sharedVal << "\n";
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    }
};

void ClassThread1()
{
    ClassA a;
    ClassB b;
    std::thread t1(&Common::run, &a);
    std::thread t2(&Common::run, &b);
    t1.join();
    t2.join();
}

void ClassThread()
{
    T obj;
    obj.Func();
}
