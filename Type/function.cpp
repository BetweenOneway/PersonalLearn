#include <iostream>
#include <functional>

using namespace std;

#include "function.h"

namespace FUNCTION {
    void A()
    {
        cout << "Call A" << endl;
    }
    void B()
    {
        cout << "Call B" << endl;
    }
    void CallFunc(std::function<void()> func)
    {
        func();
    }
    void testFunction()
    {
        CallFunc(A);
        CallFunc(B);
    }
}
