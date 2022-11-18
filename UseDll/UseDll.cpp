#include <iostream>
using namespace std;

_declspec(dllimport) int CPPDll_add(int add1, int add2);
_declspec(dllimport) int CPPDll_sub(int sub1, int sub2);
_declspec(dllimport) int CPPDll_mul(int mul1, int mul2);

#pragma comment(lib,"./Debug/CPPDll.lib")

int main()
{
	int sum = CPPDll_add(5, 4);
	int sub = CPPDll_sub(5, 4);
	int mul = CPPDll_mul(5, 4);

	cout << "sum=" << sum << ",sub=" << sub << ",mul=" << mul << endl;
	return 0;
}


