#include <iostream>
using namespace std;

namespace BIT_OPER {
    void testBitOper()
    {
        unsigned param = 258;
        unsigned int type = param & 0xFFFFFF00;
        cout << type << endl;
    }
}
