#pragma once
class Test {
public:
    void output1();
    void output2();
};

class Father {
public:
    virtual void Init();
    void FatherPublicFunction();
protected:
    void FatherProtectedFunction();
private:
    void FatherPrivateFunction();
public:
    int m_num;
};

class PublicInheritChild : public Father
{
public:
    void CallFather();
};

class ProtectedInheritChild : protected Father
{
public:
    void CallFather();
};


class PrivateInheritChild : private Father
{
public:
    void CallFather();
};

#include "Calc.h"

class Adder : public Calculator
{
public:
    int calculate(int a, int b) override;
};

class Child :virtual public Father
{
public:
    void Init();
};
