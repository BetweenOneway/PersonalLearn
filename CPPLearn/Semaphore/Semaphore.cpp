#include <Windows.h>
#include <iostream>
using namespace std;

HANDLE g_hSemaphore = 0;

DWORD CALLBACK TestProc(LPVOID lParam)
{
	while (1)
	{
		Sleep(1000);
		long int nPrevCount = 0;
		ReleaseSemaphore(g_hSemaphore, 1, &nPrevCount);
		cout << "Previous count=" << nPrevCount << endl;
	}
}

int main()
{
	g_hSemaphore = CreateSemaphore(NULL, 1, 10, NULL);
	DWORD nThreadId = 0;
	HANDLE hThread = CreateThread(NULL, 0, TestProc, NULL, 0, &nThreadId);
	WaitForSingleObject(hThread,INFINITE);
	CloseHandle(g_hSemaphore);
	return 0;
}