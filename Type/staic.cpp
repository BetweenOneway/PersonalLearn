#include <iostream>

using namespace std;
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
}
