#include <iostream>
#include <vector>
using namespace std;
#include "struct.h"

namespace STRUCT_TEST {

class base
{
public:
    base() = delete;
};

typedef struct _st {
	int* pint;
}st_test;

struct st_test1 {
    int i;
};

struct st_containClass {
    //base* p;
    //int& ri;
};
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

void test1()
{
    st_test1 st;
    st.i = 10;
    cout << st.i << endl;
}

void test2()
{
    st_containClass st;
    //st.p = new base();
}

int testStruct()
{
	test1();
	return 0;
}


}
