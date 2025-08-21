#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

std::mutex mtx;
std::condition_variable cv;
int turn = 0;

void printA(int count) {
    for (int i = 0; i < count; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return turn == 0; });
        std::cout << "A";
        turn = 1;
        cv.notify_all();
    }
}

void printB(int count) {
    for (int i = 0; i < count; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return turn == 1; });
        std::cout << "B";
        turn = 2;
        cv.notify_all();
    }
}

void printC(int count) {
    for (int i = 0; i < count; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return turn == 2; });
        std::cout << "C"<<std::endl;
        turn = 0;
        cv.notify_all();
    }
}

int PrintABC() {
    int count = 10;
    std::thread t1(printA, count);
    std::thread t2(printB, count);
    std::thread t3(printC, count);

    t1.join();
    t2.join();
    t3.join();

    return 0;
}
