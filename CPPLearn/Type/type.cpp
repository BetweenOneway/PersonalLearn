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
}
