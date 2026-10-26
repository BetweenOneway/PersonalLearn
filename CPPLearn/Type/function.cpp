#include <iostream>
#include <functional>
#include <string>

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

    void C(const unsigned int num)
    {
        cout << num << endl;
    }

    void testImplicitConvention()
    {
        bool flag = true;
        C(flag);
    }

    int TestHash()
    {
        char nts1[] = "Test";
        char nts2[] = "Test";
        std::string str1(nts1);
        std::string str2(nts2);

        //这里是普通Hash，非密码学Hash
        //Hash的地址
        std::hash<char*> ptr_hash;
        //Hash的字符串
        std::hash<std::string> str_hash;

        cout << ptr_hash(nts1)<<endl;
        cout << ptr_hash(nts2) << endl;

        cout << str_hash(nts1) << endl;
        cout << str_hash(nts2) << endl;

        cout << str_hash(str1) << endl;
        cout << str_hash(str2) << endl;

        cout << "same hashes:\n" << std::boolalpha;
        cout << "nts1 and nts2: " << (ptr_hash(nts1) == ptr_hash(nts2)) << endl;
        cout << "str1 and str2: " << (str_hash(str1) == str_hash(str2)) << endl;

        return 0;
    }
}
