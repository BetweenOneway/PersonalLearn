#include <iostream>
using namespace std;

namespace BIT_OPER {
    void testBitOper()
    {
        unsigned param = 258;
        unsigned int type = param & 0xFFFFFF00;
        cout << type << endl;
    }

    void testOper()
    {
        int i = 133;
        int ui = !i;
        cout << ui << endl;
    }
}
