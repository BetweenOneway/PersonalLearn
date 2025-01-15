#include <vector>
#include <fstream>

namespace FILE_OPER{
void testWriteContainerToFile()
{
    std::vector<char> vec = { 'a','b','\n','c','d' };

    std::ofstream vertsF("../Debug/testWriteContainerToFile.txt");
    for (const auto& c : vec)
    {
        vertsF << c;
    }
    vertsF.close();
}
}
