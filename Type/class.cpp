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
}
