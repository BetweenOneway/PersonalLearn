#include <iostream>
#include <string>
#include <iomanip>
#include <memory>

using namespace std;

// ====================== 1. 共享数据类 ======================
struct SharedData {
    int value = 0;
    std::string message;
    bool success = false;

    void clear() {
        value = 0;
        message.clear();
        success = false;
    }
};

// ====================== 2. 功能类 ======================
class FuncAdd {
public:
    void execute(SharedData& data, int num) {
        data.value += num;
        data.message += "[加法] ";
    }
};

class FuncMultiply {
public:
    void execute(SharedData& data, int num) {
        data.value *= num;
        data.message += "[乘法] ";
    }
};

class FuncCheck {
public:
    void execute(SharedData& data) {
        data.success = (data.value > 0);
        data.message += "[校验] ";
    }
};

// ====================== 3. 基础抽象类（持有共享数据引用） ======================
class BaseClass {
protected:
    // 🔥 关键修复：使用引用，确保所有子类共用同一份数据
    SharedData& m_data;

public:
    BaseClass(SharedData& data) : m_data(data) {}

    // 统一入口
    virtual void run() = 0;

    // 统一出口
    SharedData& getResult() {
        return m_data;
    }

    void reset() {
        m_data.clear();
    }

    virtual ~BaseClass() = default;
};

// ====================== 4. 空业务类（被装饰的内核） ======================
class BaseEmpty : public BaseClass {
public:
    using BaseClass::BaseClass;

    void run() override {
        m_data.message += "[空业务] ";
    }
};

// ====================== 5. 装饰器基类（继承BaseClass，持有被装饰对象） ======================
class Decorator : public BaseClass {
protected:
    BaseClass* m_component;

public:
    Decorator(SharedData& data, BaseClass* comp)
        : BaseClass(data), m_component(comp) {}

    void run() override {
        if (m_component) {
            m_component->run();
        }
    }

    ~Decorator() override {
        cout << "delete Decorator" << endl;
        delete m_component;
    }
};

// ====================== 6. 具体装饰器（全部共享同一份 data） ======================

// 加法装饰器
class AddDecorator : public Decorator {
private:
    FuncAdd m_add;
public:
    using Decorator::Decorator;

    void run() override {
        Decorator::run();
        m_add.execute(m_data, 10);  // 操作共享数据
    }
};

// 乘法装饰器
class MultiplyDecorator : public Decorator {
private:
    FuncMultiply m_mul;
public:
    using Decorator::Decorator;

    void run() override {
        Decorator::run();
        m_mul.execute(m_data, 2);  // 操作共享数据
    }
};

// 校验装饰器
class CheckDecorator : public Decorator {
private:
    FuncCheck m_check;
public:
    using Decorator::Decorator;

    void run() override {
        Decorator::run();
        m_check.execute(m_data);  // 操作共享数据
    }
};

// ====================== 7. 测试（输出完全正确） ======================
int Decorator1() {
    std::cout << "===== 装饰器模式：真正共享同一份数据 =====" << std::endl;

    // 🔥 全局只创建 1 份数据！所有类都共用它
    SharedData global_data;

    // 1. 空业务
    BaseClass* proc1 = new BaseEmpty(global_data);
    proc1->run();
    std::cout << "1: value=" << proc1->getResult().value
        << " 成功=" << std::boolalpha << proc1->getResult().success
        << " 步骤：" << proc1->getResult().message << "\n";
    delete proc1;
    global_data.clear();

    // 2. 空业务 + 加法
    BaseClass* proc2 = new AddDecorator(global_data, new BaseEmpty(global_data));
    proc2->run();
    std::cout << "2: value=" << proc2->getResult().value
        << " 成功=" << std::boolalpha << proc2->getResult().success
        << " 步骤：" << proc2->getResult().message << "\n";
    delete proc2;
    global_data.clear();

    // 3. 空业务 + 加法 + 乘法 + 校验 ✅ 预期：0+10=10 → ×2=20 → 校验成功
    BaseClass* proc3 = new CheckDecorator(
        global_data,
        new MultiplyDecorator(
            global_data,
            new AddDecorator(
                global_data,
                new BaseEmpty(global_data)
            )
        )
    );
    proc3->run();
    std::cout << "3: value=" << proc3->getResult().value
        << " 成功=" << std::boolalpha << proc3->getResult().success
        << " 步骤：" << proc3->getResult().message << "\n";
    delete proc3;

    return 0;
}
