#define DLLCLASS_EXPORT
#include "ClassDll.h"

int CMath::add(int op1, int op2)
{
    int* p = nullptr;
    *p = 1;
	return op1 + op2;
}

int CMath::sub(int op1, int op2)
{
    int* p = nullptr;
    *p = 1;
	return op1 - op2;
}
