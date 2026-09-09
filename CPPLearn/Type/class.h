#pragma once
#include <iostream>
#include <random>
#include <memory>
using namespace std;

namespace CLASS_TEST {
    class BaseClass {
    public:
        void BaseClassProcess();
        void BaseClassPublicFunction(int param);
        virtual void PublicVirtualFunction(int param);
        virtual void PublicVirtualFunction2();
    private:
        void BaseClassPrivateFunction();
    private:
        int m_num;
    };

    class PublicInheritClassLevel1_1 :public BaseClass {
    public:
        virtual void PublicVirtualFunction(int param) override;
    };

    class PublicInheritClassLevel1_2 :public BaseClass {
    public:
        virtual void PublicVirtualFunction(int param) override;
    };

    class PublicInheritClassLevel2_1 :public PublicInheritClassLevel1_1 {
    public:
        virtual void PublicVirtualFunction(int param);
        virtual void PublicVirtualFunction2();
    };


    void Call();
    class classBase {
    public:
        virtual void SayHello() final;
        virtual void SayHi();
        void test()
        {
            Call();
        }

        int m_num;
    };

    class child :public classBase
    {
    public:
        int m_num;
    public:
        void getNum();
    private:
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

    class DataBase {
    public:
        void InitDataBase(int);
    public:
        int num;
    };

    class Algorithm : virtual public DataBase {
    public:
        void InitAlgorithm();
    };

    class CommonFunction : virtual public DataBase {
    public:
        void InitCommonFunction();
    };
    class Version1 : virtual public Algorithm, virtual public CommonFunction {
    public:
        void Init();
    };

    void testLozengeInherit();

    //virtual类似于将最开始的父类单独提取了一份放在最终的子类中
    //子类在构造的时候要求明确指出祖父类的构造
    //祖父类的构造函数只被调用了一次
    class Base2 {
    public:
        Base2(int num);
        void set(int num);
    protected:
        int m_num;
    };

    class InheritClass1 : virtual protected Base2 {
    public:
        InheritClass1();
        void Output1();
    };

    class InheritClass2 : virtual protected Base2 {
    public:
        InheritClass2();
        void Output2();
    };

    class ActClass : private InheritClass1, private InheritClass2
    {
    public:
        ActClass() :InheritClass1(), InheritClass2(),Base2(40) {};
        void Output();
    };

    void testInherit2();


    //
    class DB {
    public:
        int m_num;
    };

    //class A : virtual protected DB {
    //public:
    //    void funcA() {};
    //};

    //class B :virtual private A, virtual protected DB {

    //};

    //class C :virtual  protected A, protected B {
    //public:
    //    void CFunc() {
    //        funcA();
    //    }
    //};

    class ClassWithRefMem {
    public:
        ClassWithRefMem(int& num) :m_i(num)
        {

        }
        void PrintNum();
        void SetNum(int num);
    private:
        int& m_i;
    };

    void testRefMem();
    void testClassScope();
    void testFirendClass();

    class OverrideBase {
    public:
        int BaseFunction(int num);
        int BaseFunction();
    };

    class OverrideChild :public OverrideBase{
    public:
        int BaseFunction(float num);
    };
    void testClassOverride();

    class SecretClass {
    public:
        SecretClass() = default;
        friend class FriendBaseClass;
    public:
        int m_pubNum;
    protected:
        int m_proNum;
    private:
        int m_priNum;

    };

    class FriendBaseClass {
    public:
        FriendBaseClass() = default;
        void FriendBaseClassFunction();
        virtual void FriendFunction(SecretClass& sc);
    };

    class ChildClass : protected FriendBaseClass {
    public:
        ChildClass() = default;
        void ChildFunction();
        void FriendFunction(SecretClass& sc) override;
    };

    void TestPolymorphism();

    namespace DELEGATE_CONSTRUCT {
        class Base {
        public:
            Base(int& m):m_num(m) {
                cout << "Base params construct" << endl;
            }
            void Add(int num = 10)
            {
                m_num += num;
            }
        public:
            int& m_num;
        };

        class Child :public Base{
        public:
            Child(int& m) :Base(m) {
                cout << "Child params construct" << endl;
            }
        };
    }

    void TestDelegateConstruct();

    namespace INCLUDE_EACH {
        class Pointer : public std::enable_shared_from_this<Pointer>{
        public:
            Pointer(int num,std::pair<std::shared_ptr<Pointer>, std::shared_ptr<Pointer>>& pairPointer)
            :m_pairPointer(pairPointer){
                m_num = num;
            }
            void Run() {
                if(m_num/2 == 0)
                {
                    m_pairPointer.first = shared_from_this();
                }
                else
                {
                    m_pairPointer.second = shared_from_this();
                }
            }
        private:
            std::pair<std::shared_ptr<Pointer>, std::shared_ptr<Pointer>>& m_pairPointer;
            int m_num;
        };

        class Container {
        public:
            Container() {
                
            }
            void Func() {
                // 随机设备，获取真随机种子
                std::random_device rd;
                // 引擎，用 rd 作为种子
                std::mt19937 gen(rd());

                // 分布：闭区间 [1, 100]
                std::uniform_int_distribution<int> dist(1, 100);

                int x = dist(gen);

                m_pointer = nullptr;
                m_pointer = std::make_shared<Pointer>(x,m_pairPointer);
                m_pointer->Run();
            }
        private:
            std::shared_ptr<Pointer> m_pointer;
            std::pair<std::shared_ptr<Pointer>, std::shared_ptr<Pointer>> m_pairPointer;
        };
    }
}

