#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

template <typename T>  struct ST {
	T x;
	T y;
	T z;
	const T& operator[](unsigned i) const { return  ((T*)(&x))[i]; }
	ST(T x, T y, T z)
	{
		this->x = x;
		this->y = y;
		this->z = z;
	}
	ST(const ST& ref)
	{
		cout << "call copy constructor" << endl;
		this->x = ref.x;
		this->y = ref.y;
		this->z = ref.z;
	}
};

void test()
{
	vector<int> vec{ 1,2,3,4,5,6,7,8,9 };
	auto result = minmax_element(vec.begin(), vec.end(), [](int l, int r) {return l < r; });
	cout << *result.first << "," << *result.second << endl;
}

void test1()
{
	for (int i = 0; i < 10 && i != 5; i++)
	{
		cout << i << endl;
	}
}

void test2()
{
	struct ST<int> sti { 1, 2, 3 };
	cout << sti[0] << " " << sti[1] << " " << sti[2] << endl;
}

void test3()
{
	ST<int> st1{ 1,2,3 };
	ST<int> st2{ 4,5,6 };
	vector<ST<int>> vecSt;
	cout << "start push_back" << endl;
	vecSt.push_back(st1);
	vecSt.push_back(st2);

}

void test4()
{
    vector<vector<int>> vecContainer;
    //是vecContainer有了30个容量
    vecContainer.resize(30);
    return;
}
int main()
{
	test4();
	cin.get();
	return 0;
}
