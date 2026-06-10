#include <iostream>
#include "class.h"

namespace CLASS_TEST {

    //类实现
    void BaseClass::BaseClassProcess()
    {
        PublicVirtualFunction(1);
    }
    void BaseClass::BaseClassPrivateFunction()
    {
        std::cout << "BaseClass" << __func__ << std::endl;
    }
    void BaseClass::BaseClassPublicFunction(int param)
    {
        std::cout << "BaseClass" << __func__ << std::endl;
    }

    void BaseClass::PublicVirtualFunction(int param)
    {
        std::cout << "BaseClass::" << __func__ << std::endl;
    }

   void BaseClass::PublicVirtualFunction2()
    {
       std::cout << "BaseClass::" << __func__ << std::endl;
    }

    void PublicInheritClassLevel1_1::PublicVirtualFunction(int param)
    {
        std::cout << "PublicInheritClassLevel1_1::" << __func__ << std::endl;
    }
    void PublicInheritClassLevel1_2::PublicVirtualFunction(int param)
    {
        std::cout << "PublicInheritClassLevel1_2::" << __func__ << std::endl;
    }

    void PublicInheritClassLevel2_1::PublicVirtualFunction(int param)
    {
        //__func__只会打印函数名，不会打印类名
        std::cout <<"PublicInheritClassLevel2_1::"<< __func__ << std::endl;
    }

   void PublicInheritClassLevel2_1::PublicVirtualFunction2()
    {
       std::cout << "PublicInheritClassLevel2_1::" << __func__ << std::endl;
    }

    //测试函数

    void TestPolymorphism()
    {
        std::shared_ptr<BaseClass> ptr(new PublicInheritClassLevel2_1());
        ptr->PublicVirtualFunction(6);
        ptr->BaseClassProcess();
        ptr->PublicVirtualFunction2();

    }
    class Oper
    {
    public:
	    Oper() :Oper(0) {}
	    Oper(int v) {
		    m = v;
	    }
	    const Oper operator*(const Oper& roper) const
	    {
		    return Oper(m*roper.m);
	    }
	    int get_m() const
	    {
		    return m;
	    }
    private:
	    int m;
    };

    int testClass1()
    {
	    Oper op1(2);
	    Oper op2(3);
        std::cout << (op1*op2).get_m() << std::endl;
	    op1 = op1*op2;
        std::cout << op1.get_m() << std::endl;
	    system("pause");

	    return 0;
    }
    void Call()
    {
        std::cout << "global Call" << std::endl;
    }

    void classBase::SayHello(){
        std::cout << "base say Hello" << std::endl;
        }

    void classBase::SayHi()
    {
        std::cout << "base say Hi" << std::endl;
    }

    void child::SayHi(){
        std::cout << "child say Hi" << std::endl;
        //可以通过这种方式来调用父类的函数
        classBase::SayHi();
    }
    void child::SayHello()const
    {
        std::cout << "child say Hello" << std::endl;
    }
    void child::Call()
    {
        std::cout << "child Call" << std::endl;
    }

    void child::getNum()
    {
        std::cout <<"m_num=" << m_num << std::endl;
        std::cout << "m_num=" << classBase::m_num << std::endl;
    }

    void testClassScope()
    {
        child chi;
        chi.m_num = 10;
        chi.getNum();
    }

    void testFinalOvertide()
    {
        //child newChild;
        //newChild.SayHello();
        //newChild.test();

        std::shared_ptr< classBase> ptr(new child);
        //ptr->test();//global call
        //ptr->SayHello();//base say hello
        ptr->SayHi();//child say hi
        //ptr->Call();//语法错误
    }

    void testNew()
    {
        int* ip1 = new int(1);
        int* ip2 = new int(2);

        int*(*add)[2];
        {
            int* arr[2] = { ip1,ip2 };
            add = &arr;
        }
        //delete ip1;
        try
        {
            //占用局部变量arr数组的地址重新写数据
            //因为此时该地址已经被释放
            int* p = new(add) int[4]{6,7,8,9};
        }
        catch (std::exception& ex)
        {
            std::cout << ex.what() << std::endl;
        }

        std::cout << *add[0] << std::endl;
        std::cout << *add[1] << std::endl;

    }

    void testInherit()
    {
        class Base {
        public:
            void BaseFunc() {
                std::cout << __FUNCTION__ << std::endl;
            }
        };
        class CommonBase :virtual public Base{
        public:
            void Call() {
                BaseFunc();
                SubCall();
            };
        protected:
            virtual void SubCall() {
                std::cout << "Common Base SubCall" << std::endl;
                std::cout << __FUNCTION__ << std::endl;
            }
        };
        class CommonFunc :virtual public Base{
        public:
            void commonFunc()
            {
                std::cout << __FUNCTION__ << std::endl;
                BaseFunc();
            }
        };

        class Impl : public CommonBase, public CommonFunc {
        public:
            virtual void SubCall()override {
                std::cout << __FUNCTION__ << std::endl;
                commonFunc();
            }
        };

        std::shared_ptr<CommonBase> implPtr = std::make_shared<Impl>();
        implPtr->Call();
    }

    void Child1::func()
    {
        std::cout << "Child1 func" << std::endl;
    }

    void Child2::func()
    {
        std::cout << "Child2 func" << std::endl;
    }

    void testFunc()
    {
        Base1* child1 = new Child1();
        Base1* child2 = new Child2();

        //child1->func();
    }

    Class1::Class1(int num)
    {
        m_num = num;
    }

    void Class1::SetNum(int num)
    {
        m_num = num;
    }

    void Class1::func()
    {
        std::cout << m_num << std::endl;
    }

    void Class2::init(const std::shared_ptr<Class1> ptr)
    {
        m_ptr = ptr;
    }

    void Class2::Call()
    {
        m_ptr->func();
    }

    void testClassPassPointer()
    {
        //Class1 c1(1);
        //Class2 c2;
        //c2.init(std::make_shared<Class1>(c1));
        //c2.Call();//1

        //c1.SetNum(6);
        //c1.func();//6
        //c2.Call();//1

        std::shared_ptr<Class1> c1(new Class1(1));
        Class2 c2;
        c2.init(c1);
        c2.Call();//1

        c1->SetNum(6);
        c1->func();//6
        c2.Call();//6
       // c1 = nullptr;
    }

    void DataBase::InitDataBase(int var)
    {
        num = var;
    }

    void Algorithm::InitAlgorithm()
    {
        InitDataBase(10);
    }

    void CommonFunction::InitCommonFunction()
    {
        InitDataBase(20);
    }

    void Version1::Init()
    {
        InitDataBase(30);
        std::cout <<"num="<< num << std::endl;
        InitAlgorithm();
        std::cout << "num=" << num << std::endl;
        InitCommonFunction();
        std::cout << "num=" << num << std::endl;
    }

    void testLozengeInherit()
    {
        Version1 ver;
        ver.Init();
    }
    Base2::Base2(int num)
    {
        std::cout << "call base2 construct:" << num << std::endl;
        m_num = num;
    }
    void Base2::set(int num)
    {
        m_num = num;
    }

    InheritClass1::InheritClass1():Base2(10)
    {
        std::cout << "Call InheritClass1 construct" << std::endl;
    }

    void InheritClass1::Output1()
    {
        std::cout <<"InheritClass1::Output1:"<< m_num << std::endl;
    }

    InheritClass2::InheritClass2() :Base2(20)
    {
        std::cout << "Call InheritClass2 construct" << std::endl;
    }

    void InheritClass2::Output2()
    {
        std::cout << m_num << std::endl;
    }

    void ActClass::Output()
    {
        std::cout <<"ActClass:"<< m_num << std::endl;
        Output1();
    }

    void testInherit2()
    {
        ActClass act;
        act.Output();
    }

    void ClassWithRefMem::PrintNum()
    {
        std::cout << "m_i=" << m_i << std::endl;
    }

    void ClassWithRefMem::SetNum(int num)
    {
        m_i = num;
    }

    void testRefMem()
    {
        int a = 10;
        ClassWithRefMem obj(a);

        obj.PrintNum();

        a = 20;

        obj.PrintNum();

        obj.SetNum(30);
        std::cout << a << std::endl;
    }

    void testAccess()
    {
        Class1 obj(10);

        //int* pSecret = reinterpret_cast<int*>(static_cast<char*>(static_cast<void*>(&obj)) + offsetof(Class1, m_num));

    }

    int OverrideBase::BaseFunction(int num)
    {
        std::cout << "OverrideBase BaseFunction with params int" << std::endl;
        return 0;
    }

    int OverrideBase::BaseFunction()
    {
        std::cout << "OverrideBase BaseFunction No params" << std::endl;
        return 0;
    }

    int OverrideChild::BaseFunction(float num)
    {
        std::cout << "OverrideChild BaseFunction" << std::endl;
        return 0;
    }

    void testClassOverride()
    {
        OverrideChild oc;
        //调用的child的函数
        oc.BaseFunction(5);
        //调用的child的函数
        oc.BaseFunction(5.5f);
        //下面这样不可以 会报语法错误
        //oc.BaseFunction();
        oc.OverrideBase::BaseFunction();
    }

    // 类A：声明Base为友元
    class A {
    private:
        int secret = 123; // 私有成员
        friend class Base; // 仅Base是友元
    };

    // 基类Base：可访问A的私有成员
    class Base {
    public:
        void accessA(A& a) {
            std::cout << "Base访问A的私有成员：" << a.secret << std::endl; // 合法
        }
    };

    // 子类Derived：继承Base，但未被A声明为友元
    class Derived : public Base {
    public:
        void accessA(A& a) {
            // 错误：Derived不是A的友元，无法访问私有成员
            //cout << "Derived访问A的私有成员：" << a.secret << endl;
        }
    };

    int testFriendClass() {
        A a;
        Base b;
        b.accessA(a); // 正常输出：Base访问A的私有成员：123

        //Derived d;
        // d.accessA(a); // 编译报错：'int A::secret' is private
        return 0;
    }
}
