#include <iostream>
#include <string>
#include <sstream>
using namespace std;

void test()
{
	string src = "D:/repo/smarteeproj//SmarteeErpPrototypeFile//358165_2201100015_4//CombineMesh.stl123";
	//src = "D:/1.stl123";
	int pos = src.find_last_of('.');
	int len = src.length();
	auto replacePos = src.begin();
	advance(replacePos, src.find_last_of('.'));
	//src.replace(replacePos, src.end(), ".obj");
	src.replace(pos, len - pos, "wangwei.obj");
	cout << src << endl;
}

void test1()
{
	for (int i = 0; i < 5; i++)
	{
		ostringstream oss;
		oss << "D:/repo/smarteeproj/SmarteeErpPrototypeFile/" << i << "splited.stl";
		string src = oss.str();
		cout << src << endl;
	}
}

template< class T >
struct VNVector3
{
	T  x;
	T  y;
	T  z;
	VNVector3() {}
	VNVector3(T ix, T iy, T iz) : x(ix), y(iy), z(iz) {}
	const T& operator[](unsigned i) const { 
		return  ((T*)(&x))[i]; 
	}
	T& operator[](unsigned i) 
	{ 
		return  ((T*)(&x))[i]; 
	}
	const T* Ptr() const { return &x; }
	T* Ptr() { return &x; }
};

void test2()
{
	VNVector3<unsigned int> vec(0,1,2);
	cout << vec[0] << endl;
	cout << vec[1] << endl;
	cout << vec[2] << endl;
}

int testStringOper()
{
	test2();
	cin.get();
}
