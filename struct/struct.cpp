#include <iostream>
#include <vector>
using namespace std;

typedef struct _st {
	int* pint;
}st_test;

void test()
{
	vector<st_test> vecTest;
	vecTest.reserve(10);
	st_test st;
	st.pint = new int(0);
	for (int i = 0; i < 10; i++)
	{
		//int* p = new int(i);
		*st.pint = i;
		vecTest.push_back(st);
	}

	for (auto& var : vecTest)
	{
		cout << *var.pint << endl;
	}
}

int main()
{
	test();
	return 0;
}