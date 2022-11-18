#include <Windows.h>
#include <iostream>
using namespace std;

DWORD CALLBACK ThreadProc(LPVOID lpParam);

int testFunc()
{
	return 0;
}
int main()
{
	DWORD dThreadId = 0;
	HANDLE hThread = CreateThread(NULL, 0, ThreadProc, NULL, 0, &dThreadId);
	return 0;
}

DWORD CALLBACK ThreadProc(LPVOID lpParam)
{
	testFunc();
	return 0;
}