#include <iostream>
#include <sstream>
#include <fstream>
using namespace std;

void testWriteFileDirNotExist()
{
    //如果目录不存在，不会自动创建目录
    ostringstream oss;
    oss << "./test/output.log";
    std::ofstream fout(oss.str(), std::ios::binary);
    fout.write("hello stream", strlen("hello stream"));
    fout.close();
}

int testStream()
{
    testWriteFileDirNotExist();
    return 0;
}
