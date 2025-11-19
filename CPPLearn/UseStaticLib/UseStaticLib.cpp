// UseStaticLib.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include <iostream>
#include "StaticLibCallStaticLib/StaticLibCallStaticLib.h"

int main()
{
    //在调用使用了别的静态库的静态库时，需要在项目中设置两个依赖的库名和目录
    fnStaticLibCallStaitcLib();
    std::cout << "Hello World!\n";
    system("pause");
}
