#include <iostream>
#include <vector>
#include <cmath>
#include <string>
#include <chrono>
#include <thread>
#include <mutex>

using namespace std;

namespace TEST_OPENMP
{
    const int N = 20000000;

    // ------------------------------
    // 版本1：OpenMP
    // ------------------------------
    bool run_openmp(std::vector<double>& out)
    {
        out.resize(N);
        auto start = std::chrono::high_resolution_clock::now();

#pragma omp parallel for
        for (int i = 0; i < N; ++i)
        {
            double x = static_cast<double>(i);
            out[i] = sin(x) * sqrt(x + 1.0);
        }

        auto end = std::chrono::high_resolution_clock::now();
        double ms = std::chrono::duration<double, std::milli>(end - start).count();
        std::cout << "[OpenMP] done, time = " << ms << " ms\n";
        return true;
    }

    // ------------------------------
    // 版本2：std::thread 手动分片
    // ------------------------------
    void thread_work(std::vector<double>& out, int begin, int end)
    {
        for (int i = begin; i < end; ++i)
        {
            double x = static_cast<double>(i);
            out[i] = sin(x) * sqrt(x + 1.0);
        }
    }

    bool run_stdthread(std::vector<double>& out, int thread_cnt)
    {
        out.resize(N);
        std::vector<std::thread> workers;
        int block = N / thread_cnt;

        auto start = std::chrono::high_resolution_clock::now();

        for (int t = 0; t < thread_cnt; ++t)
        {
            int b = t * block;
            int e = (t == thread_cnt - 1) ? N : (t + 1) * block;
            workers.emplace_back(thread_work, std::ref(out), b, e);
        }
        for (auto& th : workers)
        {
            th.join();
        }

        auto end = std::chrono::high_resolution_clock::now();
        double ms = std::chrono::duration<double, std::milli>(end - start).count();
        std::cout << "[std::thread " << thread_cnt << " threads] done, time = " << ms << " ms\n";
        return true;
    }

    // ------------------------------
    // 校验：打印头尾值
    // ------------------------------
    void verify(const std::vector<double>& res)
    {
        std::cout << "res[0] = " << res[0] << "\n";
        std::cout << "res.back() = " << res.back() << "\n\n";
    }

    void TestOpenMp()
    {
        std::vector<double> res;

        bool ok = false;

        {
            ok = run_openmp(res);
            verify(res);
        }

        {
            // 这里手动指定线程数，你可以改成和CPU核心数一致
            ok = run_stdthread(res, 8);
            verify(res);
        }
        
        return;
    }

}
