#include <iostream>
using namespace std;

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

int testClass()
{
	Oper op1(2);
	Oper op2(3);
	cout << (op1*op2).get_m() << endl;
	op1 = op1*op2;
	cout << op1.get_m() << endl;
	system("pause");

	return 0;
}

