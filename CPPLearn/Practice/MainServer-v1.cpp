#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <set>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <chrono>
#include <cstring>
#include <cassert>
#include <atomic>
#include <unistd.h>
#include <fcntl.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <signal.h>

#include "nlohmann/json.hpp"
using json = nlohmann::json;

using Clock = std::chrono::steady_clock;
using TimePoint = Clock::time_point;
using Microseconds = std::chrono::microseconds;
using Milliseconds = std::chrono::milliseconds;

static void set_nonblock(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

static void add_epoll(int epfd, int fd, uint32_t events, void* ptr) {
    epoll_event ev{};
    ev.data.ptr = ptr;
    ev.events = events;
    epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &ev);
}

static void mod_epoll(int epfd, int fd, uint32_t events, void* ptr) {
    epoll_event ev{};
    epoll_event ev{};
    ev.data.ptr = ptr;
    ev.events = events;
    epoll_ctl(epfd, EPOLL_CTL_MOD, fd, &ev);
}

static void del_epoll(int epfd, int fd) {
    epoll_ctl(epfd, EPOLL_CTL_DEL, fd, nullptr);
}

// ===================== 延迟直方图分桶 =====================
// buckets索引：0:0~100us,1:100~500us,2:500~1000us,3:1000~5000us,4:5000~20000us,5:>20000us
struct LatencyStat {
    std::atomic<uint64_t> buckets[6]{0};
    std::atomic<uint64_t> latency_total{0};
    std::atomic<uint64_t> latency_sum_us{0};

    void record(uint64_t us) {
        latency_total.fetch_add(1, std::memory_order_relaxed);
        latency_sum_us.fetch_add(us, std::memory_order_relaxed);
        if (us <= 100) {
            buckets[0].fetch_add(1, std::memory_order_relaxed);
        } else if (us <= 500) {
            buckets[1].fetch_add(1, std::memory_order_relaxed);
        } else if (us <= 1000) {
            buckets[2].fetch_add(1, std::memory_order_relaxed);
        } else if (us <= 5000) {
            buckets[3].fetch_add(1, std::memory_order_relaxed);
        } else if (us <= 20000) {
            buckets[4].fetch_add(1, std::memory_order_relaxed);
        } else {
            buckets[5].fetch_add(1, std::memory_order_relaxed);
        }
    }

    // 根据累计分桶计算百分位
    json get_percentile() {
        json res;
        uint64_t total = latency_total.load(std::memory_order_relaxed);
        if (total == 0) {
            res["avg_us"] = 0;
            res["p50"] = 0;
            res["p90"] = 0;
            res["p95"] = 0;
            res["p99"] = 0;
            res["p999"] = 0;
            return res;
        }
        uint64_t sum_us = latency_sum_us.load(std::memory_order_relaxed);
        res["avg_us"] = sum_us / total;

        uint64_t target50 = total * 50 / 100;
        uint64_t target90 = total * 90 / 100;
        uint64_t target95 = total * 95 / 100;
        uint64_t target99 = total * 99 / 100;
        uint64_t target999 = total * 999 / 1000;

        uint64_t acc = 0;
        auto calc = [&](uint64_t t) -> uint64_t {
            if (t == 0) return 0;
            acc = 0;
            if ((acc += buckets[0]) >= t) return 50;
            if ((acc += buckets[1]) >= t) return 300;
            if ((acc += buckets[2]) >= t) return 750;
            if ((acc += buckets[3]) >= t) return 2500;
            if ((acc += buckets[4]) >= t) return 12500;
            return 30000;
        };
        res["p50"] = calc(target50);
        res["p90"] = calc(target90);
        res["p95"] = calc(target95);
        res["p99"] = calc(target99);
        res["p999"] = calc(target999);
        return res;
    }
};

// ===================== 全局统计 =====================
struct Stat {
    std::atomic<uint64_t> active_conn{0};
    std::atomic<uint64_t> total_req{0};
    std::atomic<uint64_t> timeout_closed{0};
    LatencyStat latency;
} g_stat;

// ===================== 定时器堆 =====================
struct Timer {
    TimePoint expire;
    std::function<void()> cb;
    uint64_t id;

    bool operator>(const Timer& other) const {
        return expire > other.expire;
    }
};

class TimerHeap {
public:
    uint64_t add_timer(Milliseconds ms, std::function<void()> cb) {
        uint64_t tid = next_id_++;
        heap_.push(Timer{Clock::now() + ms, std::move(cb), tid});
        return tid;
    }

    void expire_timers() {
        auto now = Clock::now();
        while (!heap_.empty()) {
            auto& top = heap_.top();
            if (top.expire > now) break;
            auto cb = std::move(top.cb);
            heap_.pop();
            if (cb) cb();
        }
    }

    int next_timeout_ms() {
        if (heap_.empty()) return -1;
        auto diff = std::chrono::duration_cast<Milliseconds>(heap_.top().expire - Clock::now());
        int ms = static_cast<int>(diff.count());
        return ms < 0 ? 0 : ms;
    }

private:
    std::priority_queue<Timer, std::vector<Timer>, std::greater<Timer>> heap_;
    uint64_t next_id_{1};
};

// ===================== 线程池 =====================
class ThreadPool {
public:
    explicit ThreadPool(size_t n) : running_(true) {
        for (size_t i = 0; i < n; ++i) {
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lk(mtx_);
                        cv_.wait(lk, [this] { return !running_ || !queue_.empty(); });
                        if (!running_ && queue_.empty()) return;
                        task = std::move(queue_.front());
                        queue_.pop();
                    }
                    task();
                }
            });
        }
    }

    ~ThreadPool() {
        {
            std::lock_guard<std::mutex> lk(mtx_);
            running_ = false;
        }
        cv_.notify_all();
        for (auto& t : workers_) t.join();
    }

    void submit(std::function<void()> task) {
        {
            std::lock_guard<std::mutex> lk(mtx_);
            queue_.push(std::move(task));
        }
        cv_.notify_one();
    }

private:
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> queue_;
    std::mutex mtx_;
    std::condition_variable cv_;
    bool running_;
};

// ===================== 前置声明 =====================
struct HttpConn;
class EventLoop;

// ===================== HttpConn =====================
struct HttpConn {
    enum State {
        READING,
        HANDLING,
        WRITING,
        CLOSED
    };

    int fd{-1};
    EventLoop* loop{nullptr};
    State state{READING};
    std::string read_buf;
    std::string write_buf;
    uint64_t timer_id{0};
    TimePoint req_start; // 请求起始时间，用来算延迟

    HttpConn(int f, EventLoop* l) : fd(f), loop(l) {
        g_stat.active_conn.fetch_add(1, std::memory_order_relaxed);
    }
    ~HttpConn() {
        g_stat.active_conn.fetch_sub(1, std::memory_order_relaxed);
        if (fd >= 0) close(fd);
    }

    void on_read();
    void on_write();
    void close_conn(bool is_timeout = false);
    void reset_timer();
    std::string route_handle(const std::string& buf);
};

// ===================== EventLoop =====================
class EventLoop {
public:
    explicit EventLoop(ThreadPool* tp) : tp_(tp) {
        epfd_ = epoll_create1(EPOLL_CLOEXEC);
        assert(epfd_ >= 0);
    }

    ~EventLoop() {
        close(epfd_);
    }

    void run() {
        running_ = true;
        while (running_) {
            int timeout = timer_.next_timeout_ms();
            std::vector<epoll_event> evs(128);
            int n = epoll_wait(epfd_, evs.data(), evs.size(), timeout);
            timer_.expire_timers();

            for (int i = 0; i < n; ++i) {
                auto* conn = reinterpret_cast<HttpConn*>(evs[i].data.ptr);
                if (!conn || conn->state == HttpConn::CLOSED) continue;

                uint32_t e = evs[i].events;
                if (e & (EPOLLERR | EPOLLHUP)) {
                    conn->close_conn();
                    continue;
                }
                if (e & EPOLLIN) {
                    conn->on_read();
                }
                if (e & EPOLLOUT) {
                    conn->on_write();
                }
            }
        }
    }

    void stop() { running_ = false; }
    void add_conn(HttpConn* conn) {
        add_epoll(epfd_, conn->fd, EPOLLIN | EPOLLET, conn);
        conn->reset_timer();
    }
    void mod_conn(HttpConn* conn, uint32_t events) {
        mod_epoll(epfd_, conn->fd, events | EPOLLET, conn);
    }
    TimerHeap& timer() { return timer_; }
    int epfd() const { return epfd_; }
    ThreadPool* tp() { return tp_; }

private:
    int epfd_{-1};
    bool running_{false};
    TimerHeap timer_;
    ThreadPool* tp_;
};

// ===================== HttpConn 实现 =====================
void HttpConn::reset_timer() {
    timer_id = loop->timer().add_timer(Milliseconds(5000), [this] {
        close_conn(true);
    });
}

void HttpConn::close_conn(bool is_timeout) {
    state = CLOSED;
    del_epoll(loop->epfd(), fd);
    if (is_timeout) {
        g_stat.timeout_closed.fetch_add(1, std::memory_order_relaxed);
    }
    delete this;
}

std::string HttpConn::route_handle(const std::string& buf) {
    g_stat.total_req.fetch_add(1, std::memory_order_relaxed);
    if (buf.find("GET /api/stat") != std::string::npos) {
        json j;
        j["active_conn"] = g_stat.active_conn.load(std::memory_order_relaxed);
        j["total_req"]   = g_stat.total_req.load(std::memory_order_relaxed);
        j["timeout_closed"] = g_stat.timeout_closed.load(std::memory_order_relaxed);
        auto lp = g_stat.latency.get_percentile();
        j["latency"] = lp;
        std::string body = j.dump();

        std::string resp =
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: application/json\r\n"
            "Content-Length: " + std::to_string(body.size()) + "\r\n"
            "Connection: keep-alive\r\n\r\n"
            + body;
        return resp;
    }

    std::string resp =
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: text/plain\r\n"
        "Content-Length: 13\r\n"
        "Connection: keep-alive\r\n\r\n"
        "Hello Reactor!\n";
    return resp;
}

void HttpConn::on_read() {
    char buf[4096];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0) {
        read_buf.append(buf, n);
    }
    if (n == 0) {
        close_conn();
        return;
    }
    if (n < 0 && errno != EAGAIN && errno != EWOULDBLOCK) {
        close_conn();
        return;
    }

    auto pos = read_buf.find("\r\n\r\n");
    if (pos == std::string::npos) {
        reset_timer();
        return;
    }

    req_start = Clock::now();
    state = HANDLING;
    loop->tp()->submit([this] {
        write_buf = route_handle(read_buf);
        state = WRITING;
        loop->mod_conn(this, EPOLLOUT | EPOLLET);
    });
}

void HttpConn::on_write() {
    ssize_t n = write(fd, write_buf.data(), write_buf.size());
    if (n > 0) {
        write_buf.erase(0, n);
    }
    if (write_buf.empty()) {
        // 写完响应，记录本次请求耗时
        auto dur = std::chrono::duration_cast<Microseconds>(Clock::now() - req_start);
        g_stat.latency.record(dur.count());

        read_buf.clear();
        state = READING;
        loop->mod_conn(this, EPOLLIN | EPOLLET);
        reset_timer();
    } else if (n < 0 && errno != EAGAIN && errno != EWOULDBLOCK) {
        close_conn();
    }
}

// ===================== HttpServer =====================
class HttpServer {
public:
    HttpServer(uint16_t port, size_t sub_loop_cnt, size_t thread_pool_size)
        : port_(port), next_loop_idx_(0) {
        tp_ = std::make_unique<ThreadPool>(thread_pool_size);
        for (size_t i = 0; i < sub_loop_cnt; ++i) {
            auto loop = std::make_shared<EventLoop>(tp_.get());
            sub_loops_.push_back(loop);
            sub_threads_.emplace_back([loop] { loop->run(); });
        }
    }

    ~HttpServer() {
        for (auto& l : sub_loops_) l->stop();
        for (auto& t : sub_threads_) t.join();
    }

    void start() {
        int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
        assert(listen_fd >= 0);
        set_nonblock(listen_fd);
        int opt = 1;
        setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port_);
        addr.sin_addr.s_addr = INADDR_ANY;
        bind(listen_fd, (sockaddr*)&addr, sizeof(addr));
        listen(listen_fd, 128);

        int main_epfd = epoll_create1(EPOLL_CLOEXEC);
        add_epoll(main_epfd, listen_fd, EPOLLIN, this);

        std::cout << "C++ Reactor Server listen on 0.0.0.0:" << port_ << std::endl;
        while (true) {
            epoll_event ev;
            int n = epoll_wait(main_epfd, &ev, 1, -1);
            if (n <= 0) continue;
            if (ev.data.ptr == this) {
                while (true) {
                    sockaddr_in client_addr{};
                    socklen_t len = sizeof(client_addr);
                    int cfd = accept4(listen_fd, (sockaddr*)&client_addr, &len, SOCK_NONBLOCK);
                    if (cfd < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK) break;
                        perror("accept4");
                        break;
                    }
                    auto& loop = sub_loops_[next_loop_idx_];
                    next_loop_idx_ = (next_loop_idx_ + 1) % sub_loops_.size();
                    HttpConn* conn = new HttpConn(cfd, loop.get());
                    loop->add_conn(conn);
                }
            }
        }
    }

private:
    uint16_t port_;
    std::unique_ptr<ThreadPool> tp_;
    std::vector<std::shared_ptr<EventLoop>> sub_loops_;
    std::vector<std::thread> sub_threads_;
    size_t next_loop_idx_;
};

int main() {
    signal(SIGPIPE, SIG_IGN);
    HttpServer server(18082, 2, 4);
    server.start();
    return 0;
}
