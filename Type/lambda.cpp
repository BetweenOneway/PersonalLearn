#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

void testLambda()
{
	auto func = [](int& i) {
		int num = 10;
		cout << &num << endl;
	};
	vector<int> a{ 0,1,2,3,4,5,6,7,8,9 };
	for_each(a.begin(), a.end(), func);
	for (int i = 0; i < 10; i++)
	{
		int num = 10;
		cout << &num << endl;
	}
}
