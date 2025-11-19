#pragma once
#ifndef USE_STATIC_LIB_H
#define USE_STATIC_LIB_H
#include "StaticLibCallStaticLib/StaticLibCallStaticLib.h"

class MyMathOper :public MathOperations
{
public:
    MyMathOper(int val = 0) :MathOperations(val) {};

    int MyAdd(int val1, int val2);
};

#endif
