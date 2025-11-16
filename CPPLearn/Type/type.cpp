#include <iostream>
using namespace std;

#include "type.h"

namespace TYPE_OF {
    int testTypeId()
    {
        int num = 10;
        cout << typeid(num).name() << endl;
        cout << typeid(int).name() << endl;

        if (typeid(num) == typeid(int))
        {
            cout << "type equal" << endl;
        }
        cout << typeid(double[10]).name() << endl;
        return 0;
    }

    void testEnumClass()
    {
        //:后面的类型只能是int、char、long 等，char类型会被转成ASCII码
        //枚举类型的底层类型必须是整数类型
        //不能是string等类型
        enum class ModuleName:char {
            Algorithm='a',
            Business
        };
    }
}
