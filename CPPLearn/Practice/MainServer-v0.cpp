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
#include <unistd.h>
#include <fcntl.h>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <signal.h>

// ===================== 工具函数 =====================
using Clock = std::chrono::steady_clock;
using TimePoint = Clock::time_point;
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
    ev.data.ptr = ptr;
    ev.events = events;
    epoll_ctl(epfd, EPOLL_CTL_MOD, fd, &ev);
}

static void del_epoll(int epfd, int fd) {
    epoll_ctl(epfd, EPOLL_CTL_DEL, fd, nullptr);
}

// ===================== 定时器堆（最小堆） =====================
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
    using Ptr = std::shared_ptr<TimerHeap>;

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

// ===================== HttpConn：一条TCP连接 =====================
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

    HttpConn(int f, EventLoop* l) : fd(f), loop(l) {}
    ~HttpConn() {
        if (fd >= 0) close(fd);
    }

    void on_read();
    void on_write();
    void close_conn();
    void reset_timer();
};

// ===================== Reactor EventLoop =====================
class EventLoop {
public:
    using Ptr = std::shared_ptr<EventLoop>;
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
    // 空闲超时：5s
    timer_id = loop->timer().add_timer(Milliseconds(5000), [this] {
        close_conn();
    });
}

void HttpConn::close_conn() {
    state = CLOSED;
    del_epoll(loop->epfd(), fd);
    delete this;
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

    // 极简HTTP判断：找到\r\n\r\n认为头部读完
    auto pos = read_buf.find("\r\n\r\n");
    if (pos == std::string::npos) {
        reset_timer();
        return;
    }

    state = HANDLING;
    // 丢给线程池执行业务
    loop->tp()->submit([this] {
        // ---------------- 业务handler，在这里改你的逻辑 ----------------
        std::string resp =
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: text/plain\r\n"
            "Content-Length: 13\r\n"
            "Connection: keep-alive\r\n\r\n"
            "Hello Reactor!\n";
        // ----------------------------------------------------------------
        write_buf = std::move(resp);
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
        // 写完，切回读事件，保持长连接
        read_buf.clear();
        state = READING;
        loop->mod_conn(this, EPOLLIN | EPOLLET);
        reset_timer();
    } else if (n < 0 && errno != EAGAIN && errno != EWOULDBLOCK) {
        close_conn();
    }
}

// ===================== Server：mainReactor + 轮询subReactor =====================
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

        std::cout << "Server listen on 0.0.0.0:" << port_ << std::endl;
        while (true) {
            epoll_event ev;
            int n = epoll_wait(main_epfd, &ev, 1, -1);
            if (n <= 0) continue;

            if (ev.data.ptr == this) {
                // accept 循环
                while (true) {
                    sockaddr_in client_addr{};
                    socklen_t len = sizeof(client_addr);
                    int cfd = accept4(listen_fd, (sockaddr*)&client_addr, &len, SOCK_NONBLOCK);
                    if (cfd < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK) break;
                        perror("accept4");
                        break;
                    }
                    // 轮询分配subReactor
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
    std::vector<EventLoop::Ptr> sub_loops_;
    std::vector<std::thread> sub_threads_;
    size_t next_loop_idx_;
};

int main() {
    signal(SIGPIPE, SIG_IGN);
    // 参数：端口、subReactor数量、线程池工作线程数
    HttpServer server(8080, 2, 4);
    server.start();
    return 0;
}
