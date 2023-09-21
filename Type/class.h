#pragma once
namespace CLASS_TEST {
    void Call();
    class classBase {
    public:
        virtual void SayHello() final;
        virtual void SayHi();
        void test()
        {
            Call();
        }
    };

    class child :public classBase
    {
    public:
        void SayHi() override;
        void SayHello()const;
        void Call();
    };

    class Base1
    {
    };
    class Child1 : public Base1
    {
    public:
        void func();
    };

    class Child2 : public Base1
    {
    public:
        void func();
    };

    void testFinalOvertide();

    void testNew();

    void testInherit();

    class Class1
    {
    public:
        Class1(int num);
        void func();
        void SetNum(int num);
    private:
        int m_num;
    };
    class Class2
    {
    public:
        void init(const std::shared_ptr<Class1> ptr);
        void Call();
    public:
        std::shared_ptr<Class1> m_ptr;
    };

    void testClassPassPointer();
}
