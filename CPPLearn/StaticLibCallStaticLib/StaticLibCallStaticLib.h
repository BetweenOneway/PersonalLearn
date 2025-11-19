#pragma once

#define WIN32_LEAN_AND_MEAN             // 从 Windows 头文件中排除极少使用的内容

#ifndef STATIC_LIBRARY_CALL_STATIC_LIBRARY_H
#define STATIC_LIBRARY_CALL_STATIC_LIBRARY_H

extern void fnStaticLibCallStaitcLib();

// 静态库中定义的类
class MathOperations {
private:
    int m_value; // 私有成员变量

public:
    // 构造函数
    MathOperations(int initialValue);

    // 成员函数：加法
    int Add(int num);

    // 成员函数：乘法
    int Multiply(int num);

    // 成员函数：获取当前值
    int GetValue() const;
};

#endif
