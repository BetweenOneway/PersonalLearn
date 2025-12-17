// UseStaticLib.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//
#include "UseStaticLib.h"
#include <iostream>

int MyMathOper::MyAdd(int val1,int val2)
{
    Add(val1);
    return Add(val2);
}

//测试本地类继承来自静态库的类的使用
void testClassInheritClassFromLibrary()
{
    MyMathOper myMathOper(0);
    std::cout<<"MyMathOper.MyAdd(1,2)="<<myMathOper.MyAdd(1, 2) << std::endl;
}

void testClassFromStaticLibrary()
{
    // 1. 定义静态库中类的对象（调用构造函数）
    MathOperations mathObj(10);

    // 2. 调用成员函数
    int resultAdd = mathObj.Add(5);
    std::cout << "加法结果: " << resultAdd << std::endl; // 输出15

    int resultMultiply = mathObj.Multiply(2);
    std::cout << "乘法结果: " << resultMultiply << std::endl; // 输出30

    std::cout << "当前值: " << mathObj.GetValue() << std::endl; // 输出30
}

int main()
{
    std::cout << "Hello World!\n";
    //在调用使用了别的静态库的静态库时，需要在项目中设置两个依赖的库名和目录
    fnStaticLibCallStaitcLib();

    testClassFromStaticLibrary();
    testClassInheritClassFromLibrary();

    system("pause");
}
