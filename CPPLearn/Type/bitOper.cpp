#include <iostream>

namespace BIT_OPER {
    void testBitOper()
    {
        unsigned param = 258;
        unsigned int type = param & 0xFFFFFF00;
        std::cout << type << std::endl;
    }

    void testOper()
    {
        int i = 133;
        int ui = !i;
        std::cout << ui << std::endl;
    }
}
