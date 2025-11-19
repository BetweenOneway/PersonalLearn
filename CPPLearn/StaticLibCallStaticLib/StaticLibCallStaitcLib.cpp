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

// 构造函数实现
MathOperations::MathOperations(int initialValue)
    : m_value(initialValue) {}

// 加法实现
int MathOperations::Add(int num) {
    m_value += num;
    return m_value;
}

// 乘法实现
int MathOperations::Multiply(int num) {
    m_value *= num;
    return m_value;
}

// 获取当前值实现
int MathOperations::GetValue() const {
    return m_value;
}
