#pragma once
#ifdef DLLCLASS_EXPORT
#define EXT_CLASS _declspec(dllexport)
#else 
#define EXT_CLASS _declspec(dllimport)
#endif 

class EXT_CLASS CMath {
public:
	int add(int op1, int op2);
	int sub(int op1, int op2);
};