#include <iostream>
#include <string>
using namespace std;

enum class Color:int {
    Red,
    Yellow
};

void testEnumClass()
{
    Color color = Color::Red;

    int i = static_cast<int>(color);
}

void testWString()
{
    wstring wstr(L"舌刺xxcv123");
    wstring wstr1(L"舌刺");
    //int result = wstr.compare(0, 2, L"舌刺",2);
    int result = wstr.compare(0, wstr1.length(), L"舌刺");
    cout << "compare result:" << result << endl;
}

void testDiv()
{
    float fr = 1.0f / 60;
    double dr = 1.0f / 60;
    cout << "fr=" << fr << ",dr=" << dr << endl;
}

int main()
{
    testDiv();
    system("pause");
    return 0;
}
