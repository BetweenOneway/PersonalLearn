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
        child newChild;
        newChild.SayHello();
        newChild.test();
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
        class Base
        {
        public:
            Base() {
                num = 10;
            }
        private:
            int getNum() {
                return num;
            }
        private:
            int num;
        };

        //class Child : public Base
        //{
        //public:
        //    int get()
        //    {
        //        return Base::getNum();
        //    }
        //};
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
}
