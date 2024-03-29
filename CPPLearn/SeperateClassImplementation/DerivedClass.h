#pragma once
#include "BaseClass.h"
class DerivedClass : public BaseClass {
public:
    void pureVirtualFunction() override; // 声明将在DerivedClass.cpp中实现
};
