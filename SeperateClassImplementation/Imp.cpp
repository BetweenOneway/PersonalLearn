#include "head.h"
#include <iostream>
using namespace std;

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

int Adder::caculate(int a, int b)
{
    return a + b;
}
