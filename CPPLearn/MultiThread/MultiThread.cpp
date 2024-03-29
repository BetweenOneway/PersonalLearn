#include <Windows.h>
#include <iostream>
#include <sstream>
#include <fstream>
using namespace std;

HANDLE g_hMutex;
DWORD CALLBACK ThreadProc(LPVOID lpParam);

class Base
{
public:
    Base() = default;
    Base(int i)
    {
        this->i = i;
    }
    void add(int num = 0)
    {
        i = i + num;
    }
    void print()
    {
        WaitForSingleObject(g_hMutex, INFINITE);
        cout <<"i=" << i << endl;
        ReleaseMutex(g_hMutex);
    }
    int get()
    {
        return i;
    }
private:
    int i;
};
typedef struct _st_Param
{
    Base* base;
    int num;
}ST_Param;

int main()
{
    g_hMutex = CreateMutex(NULL, FALSE, NULL);

    Base base(1);
    ST_Param stParam;
    stParam.base = &base;
    stParam.num = 10;

	DWORD dThreadId = 0;
    HANDLE hThread[2];

    hThread[0] = CreateThread(NULL, 0, ThreadProc, &stParam, 0, &dThreadId);
    hThread[1] = CreateThread(NULL, 0, ThreadProc, &stParam, 0, &dThreadId);
    WaitForMultipleObjects(2,hThread, TRUE,INFINITE);
	return 0;
}

void WriteLog(int num)
{
    ostringstream oss;
    oss << "ThreadProc:" << num << endl;
    WaitForSingleObject(g_hMutex, INFINITE);
    fstream ofs("./output/thread.log", ios::binary | ios::app);
    ofs.write(oss.str().c_str(), oss.str().length());
    ofs.close();
    ReleaseMutex(g_hMutex);
}

DWORD CALLBACK ThreadProc(LPVOID lpParam)
{
    ST_Param* stParam = (ST_Param*)lpParam;
    stParam->base->add(stParam->num);
    //stParam->base->print();
    WriteLog(stParam->base->get());


	return 0;
}
