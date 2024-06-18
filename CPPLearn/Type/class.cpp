#include <iostream>
using namespace std;
#include "class.h"

namespace CLASS_TEST {

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
	    cout << (op1*op2).get_m() << endl;
	    op1 = op1*op2;
	    cout << op1.get_m() << endl;
	    system("pause");

	    return 0;
    }
    void Call()
    {
        cout << "global Call" << endl;
    }

    void classBase::SayHello(){
            cout << "base say Hello" << endl;
        }

    void classBase::SayHi()
    {
        cout << "base say Hi" << endl;
    }

    void child::SayHi(){
        cout << "child say Hi" << endl;
        classBase::SayHi();
    }
    void child::SayHello()const
    {
        cout << "child say Hello" << endl;
    }
    void child::Call()
    {
        cout << "child Call" << endl;
    }

    void testFinalOvertide()
    {
        //child newChild;
        //newChild.SayHello();
        //newChild.test();

        shared_ptr< classBase> ptr(new child);
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
        catch (exception& ex)
        {
            cout << ex.what() << endl;
        }

        cout << *add[0] << endl;
        cout << *add[1] << endl;

    }

    void testInherit()
    {
        class Base {
        public:
            void BaseFunc() {
                cout << __FUNCTION__ << endl;
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
                cout << "Common Base SubCall" << endl;
                cout << __FUNCTION__ << endl;
            }
        };
        class CommonFunc :virtual public Base{
        public:
            void commonFunc()
            {
                cout << __FUNCTION__ << endl;
                BaseFunc();
            }
        };

        class Impl : public CommonBase, public CommonFunc {
        public:
            virtual void SubCall()override {
                cout << __FUNCTION__ << endl;
                commonFunc();
            }
        };

        shared_ptr<CommonBase> implPtr = std::make_shared<Impl>();
        implPtr->Call();
    }

    void Child1::func()
    {
        std::cout << "Child1 func" << endl;
    }

    void Child2::func()
    {
        std::cout << "Child2 func" << endl;
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
        cout << m_num << endl;
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
        std::cout <<"num="<< num << endl;
        InitAlgorithm();
        std::cout << "num=" << num << endl;
        InitCommonFunction();
        std::cout << "num=" << num << endl;
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
        cout <<"InheritClass1::Output1:"<< m_num << endl;
    }

    InheritClass2::InheritClass2() :Base2(20)
    {
        std::cout << "Call InheritClass2 construct" << std::endl;
    }

    void InheritClass2::Output2()
    {
        cout << m_num << endl;
    }

    void ActClass::Output()
    {
        cout <<"ActClass:"<< m_num << endl;
        Output1();
    }

    void testInherit2()
    {
        ActClass act;
        act.Output();
    }

    void ClassWithRefMem::PrintNum()
    {
        cout << "m_i=" << m_i << endl;
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
        cout << a << endl;
    }

}
