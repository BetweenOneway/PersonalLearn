// StaticLibCallStaitcLib.cpp : 定义静态库的函数。
//

#include "StaticLibCallStaticLib.h"
#include <iostream>

#include "StaticLib/StaticLib.h"
// 在静态库中调用别的静态库中的函数，仅需设置所包含头文件路径即可
void fnStaticLibCallStaitcLib()
{
    fnStaticLib();
    std::cout << "fnStaticLibCallStaticLib"<<std::endl;
}
