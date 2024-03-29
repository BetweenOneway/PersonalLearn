#include <iostream>
using namespace std;

#include "../ClassDll/ClassDll.h"
#pragma comment(lib,"../Debug/ClassDll.lib")

int main()
{
	CMath math;
	cout << "sum="<<math.add(5, 4) << ",sub=" << math.sub(5, 4) << endl;
	return 0;
}