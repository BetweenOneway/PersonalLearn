#include <iostream>
#include <string>
#include <memory>
using namespace std;

namespace DECORATOR_1 {
    // 抽象组件类
    class Component {
    public:
        // C++ 纯虚函数 = 0，对应 C# abstract
        virtual void Operation() = 0;
        // 基类必须加虚析构函数，防止内存泄漏
        virtual ~Component() = default;
    };

    // 具体组件
    class ConcreteComponent : public Component {
    public:
        void Operation() override {
            cout << "具体对象的操作" << endl;
        }
    };

    // 抽象装饰器
    class Decorator : public Component {
    protected:
        Component* component;  // C++ 使用指针
    public:
        Decorator() : component(nullptr) {}

        // 设置被装饰的对象
        void SetComponent(Component* comp) {
            component = comp;
        }

        void Operation() override {
            if (component != nullptr) {
                component->Operation();
            }
        }

        // 虚析构
        ~Decorator() {
            cout << "delete Decorator 1" << endl;
        }
    };

    // 具体装饰器 A
    class ConcreteDecoratorA : public Decorator {
    private:
        string addedState;
    public:
        void Operation() override {
            Decorator::Operation();  // 调用基类方法
            addedState = "New State";
            cout << "具体装饰对象A的操作" << endl;
        }
    };

    // 具体装饰器 B
    class ConcreteDecoratorB : public Decorator {
    public:
        void Operation() override {
            Decorator::Operation();
            AddedBehavior();
            cout << "具体装饰对象B的操作" << endl;
        }

    private:
        void AddedBehavior() {
            // 独有功能
        }
    };
}

namespace DECORATOR_2 {
    class Component {
    public:
        virtual void Operation() = 0;
        // 基类统一声明 SetComponent，支持链式
        virtual Component* SetComponent(Component* comp) = 0;
        virtual ~Component() = default;

    protected:
        Component* component = nullptr;
    };

    // 具体组件：实现 SetComponent，支持链式
    class ConcreteComponent : public Component {
    public:
        void Operation() override {
            if (component) component->Operation();
            cout << "具体对象的操作" << endl;
        }

        Component* SetComponent(Component* comp) override {
            component = comp;
            return comp;
        }

        ~ConcreteComponent() override {
            delete component;
        }
    };

    // 抽象装饰器
    class Decorator : public Component {
    public:
        void Operation() override {
            if (component) component->Operation();
        }

        Component* SetComponent(Component* comp) override {
            component = comp;
            return comp;
        }

        ~Decorator() override {
            delete component;
        }
    };

    // 装饰A
    class ConcreteDecoratorA : public Decorator {
    private:
        string addedState;
    public:
        ConcreteDecoratorA() {
            addedState = "A";
        }
        void Operation() override {
            Decorator::Operation();
            addedState = "New State";
            cout << "具体装饰对象A的操作" << endl;
        }
    };

    // 装饰B
    class ConcreteDecoratorB : public Decorator {
    private:
        string addedState;
    public:
        ConcreteDecoratorB() {
            addedState = "B";
        }
        void Operation() override {
            Decorator::Operation();
            cout << "具体装饰对象B的操作" << endl;
        }
    };
}

// 客户端主函数
int Decorator2() {
    // 创建对象（C++ 使用 new 创建堆对象）
    DECORATOR_1::ConcreteComponent* c = new DECORATOR_1::ConcreteComponent();
    DECORATOR_1::ConcreteDecoratorA* d1 = new DECORATOR_1::ConcreteDecoratorA();
    DECORATOR_1::ConcreteDecoratorB* d2 = new DECORATOR_1::ConcreteDecoratorB();

    // 装饰链：d2 包装 d1，d1 包装 c
    /*
    * 输出内容
    * 具体对象的操作
    * 具体装饰对象A的操作
    * 具体装饰对象B的操作
    */
    d1->SetComponent(c);
    d2->SetComponent(d1);
    d2->Operation();

    // 释放内存（C++ 必须手动管理）
    delete d2;
    delete d1;
    delete c;

    return 0;
}

int Decorator3() {
    DECORATOR_2::ConcreteComponent* c = new DECORATOR_2::ConcreteComponent();
    DECORATOR_2::ConcreteDecoratorA* d1 = new DECORATOR_2::ConcreteDecoratorA();
    DECORATOR_2::ConcreteDecoratorB* d2 = new DECORATOR_2::ConcreteDecoratorB();

    c->SetComponent(d1)->SetComponent(d2);
    /*
    * 具体装饰对象B的操作
    * 具体装饰对象A的操作
    * 具体对象的操作
    */
    c->Operation();

    delete c;
    return 0;
}
