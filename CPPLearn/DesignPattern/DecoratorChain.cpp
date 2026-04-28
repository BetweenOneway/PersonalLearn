#include <iostream>
#include <string>
#include <memory>

// -------------------------- 1. 全局唯一共享数据（单例，自动共享） --------------------------
struct SharedData
{
    int         value = 0;
    std::string msg;
    bool        ok = false;

    void clear()
    {
        value = 0;
        msg.clear();
        ok = false;
    }

    // 全局唯一实例（线程安全，C++11及以上保证）
    static SharedData& Instance()
    {
        static SharedData inst;
        return inst;
    }
};

// 别名简化，所有类直接使用，无需传参
inline auto& g_data = SharedData::Instance();

// -------------------------- 2. 原子功能类（纯业务，无继承、低耦合） --------------------------
// 加法功能（可自定义参数）
class FuncAdd
{
public:
    void exec(int n) {
        g_data.value += n;
        g_data.msg += "[加" + std::to_string(n) + "] ";
    }
};

// 乘法功能（可自定义参数）
class FuncMul
{
public:
    void exec(int n) {
        g_data.value *= n;
        g_data.msg += "[乘" + std::to_string(n) + "] ";
    }
};

// 校验功能
class FuncCheck
{
public:
    void exec() {
        g_data.ok = (g_data.value > 0);
        g_data.msg += "[校验] ";
    }
};

// -------------------------- 3. 统一基础抽象类（规范入口） --------------------------
class BaseNode
{
public:
    virtual void run() = 0;
    virtual ~BaseNode() = default;
};

// -------------------------- 4. 装饰器基类（统一嵌套逻辑，无需重复写） --------------------------
class Decorator : public BaseNode
{
protected:
    std::unique_ptr<BaseNode> inner; // 智能指针，自动释放内存

public:
    explicit Decorator(std::unique_ptr<BaseNode> in) : inner(std::move(in)) {}

    void run() override {
        if (inner) inner->run(); // 先执行内层逻辑，再执行自身装饰逻辑
    }
};

// -------------------------- 5. 具体节点/装饰器（极简定义） --------------------------
// 空节点（流程内核）
class EmptyNode : public BaseNode
{
public:
    void run() override {
        g_data.msg += "[空流程] ";
    }
};

// 加法装饰器（支持自定义参数）
class AddDec : public Decorator
{
private:
    FuncAdd func;
    int num; // 自定义加法数值，不再写死
public:
    AddDec(std::unique_ptr<BaseNode> in, int n) : Decorator(std::move(in)), num(n) {}
    void run() override {
        Decorator::run();
        func.exec(num);
    }
};

// 乘法装饰器（支持自定义参数）
class MulDec : public Decorator
{
private:
    FuncMul func;
    int num; // 自定义乘法数值
public:
    MulDec(std::unique_ptr<BaseNode> in, int n) : Decorator(std::move(in)), num(n) {}
    void run() override {
        Decorator::run();
        func.exec(num);
    }
};

// 校验装饰器
class CheckDec : public Decorator
{
private:
    FuncCheck func;
public:
    using Decorator::Decorator; // 复用基类构造
    void run() override {
        Decorator::run();
        func.exec();
    }
};

// -------------------------- 6. 核心：流式链式构建器（极简调用关键） --------------------------
class FlowBuilder
{
private:
    std::unique_ptr<BaseNode> root; // 根节点（空流程）

public:
    // 构造时初始化空流程（默认内核）
    FlowBuilder() : root(std::make_unique<EmptyNode>()) {}

    // 链式添加：加法（支持自定义数值）
    FlowBuilder& add(int num = 10) { // 默认值10，可自定义
        root = std::make_unique<AddDec>(std::move(root), num);
        return *this; // 返回自身，支持链式调用
    }

    // 链式添加：乘法（支持自定义数值）
    FlowBuilder& mul(int num = 2) { // 默认值2，可自定义
        root = std::make_unique<MulDec>(std::move(root), num);
        return *this;
    }

    // 链式添加：校验
    FlowBuilder& check() {
        root = std::make_unique<CheckDec>(std::move(root));
        return *this;
    }

    // 统一入口：执行所有流程
    void run() {
        root->run();
    }

    // 统一出口：获取结果（可选，简化调用）
    const SharedData& result() const {
        return g_data;
    }
};

// 快捷创建构建器（无需new，直接调用）
inline FlowBuilder create() {
    return FlowBuilder();
}

// -------------------------- 7. 业务使用示例（极简流式调用） --------------------------
int DecoratorChain()
{
    // 快捷打印结果（复用逻辑，简化代码）
    auto printResult = [](const std::string& desc) {
        std::cout << "==== " << desc << " ====\n";
        std::cout << "val=" << g_data.value
            << "  ok=" << std::boolalpha << g_data.ok
            << "  log=" << g_data.msg << "\n\n";
        g_data.clear(); // 每次执行后清空数据，避免干扰下一次
    };

    // 1. 空流程：create().run()
    create().run();
    printResult("空流程");

    // 2. 空流程 + 加法（默认加10）：create().add().run()
    create().add().run();
    printResult("空 + 加10");

    // 3. 空流程 + 加法（自定义加5） + 乘法（自定义乘3）：create().add(5).mul(3).run()
    create().add(5).mul(3).run();
    printResult("空 + 加5 + 乘3");

    // 4. 完整流程：空 + 加10 + 乘2 + 校验：create().add().mul().check().run()
    create().add().mul().check().run();
    printResult("空 + 加10 + 乘2 + 校验");

    // 5. 任意组合（校验在前，加法在后）：create().check().add(20).run()
    create().check().add(20).run();
    printResult("空 + 校验 + 加20");

    return 0;
}
