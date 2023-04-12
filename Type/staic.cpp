#include <iostream>

using namespace std;
#include "static.h"

namespace STATIC_TEST{
void useStaic()
{
	static int num = 10;
	num = (num + 1)%numeric_limits<int>::max();
	cout << num << endl;
}

void test()
{
	for (int i = 0; i < 10; i++)
	{
		useStaic();
	}
}

int testStatic()
{
	test();
	return 0;
}

/*
* 两个函数中的同名static变量互不影响
*/
void func1()
{
    static int num = 10;
    num = num + 10;
    cout << __LINE__ <<"num=" << num<<endl;
}

void func2()
{
    static int num = 10;
    num = num + 20;
    cout << __LINE__ << "num=" << num<<endl;
}

void testSameStaticInDifferentFunction()
{
    func1();
    func2();
}

}
