#include "head.h"
#include <iostream>
using namespace std;

void Father::Init()
{
    cout << m_num << endl;
    cout << "Father::Init()" << endl;
    m_num = 10;
}

void Father::FatherPublicFunction()
{
    cout << "Father public function" << endl;
}

void Father::FatherProtectedFunction()
{
    cout << "Father protected function" << endl;
}

void Father::FatherPrivateFunction()
{
    cout << "Father private function" << endl;
}

void PublicInheritChild::CallFather()
{
    FatherPublicFunction();
    FatherProtectedFunction();
    //FatherPrivateFunction();
}

void ProtectedInheritChild::CallFather()
{

}

void PrivateInheritChild::CallFather()
{

}

int Adder::calculate(int a, int b)
{
    return a + b;
}

void Child::Init()
{
    Father::Init();
    cout << "Child::Init()" << endl;
    cout << m_num << endl;
}
