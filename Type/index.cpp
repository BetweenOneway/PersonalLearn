#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <filesystem>
#include <unordered_map>
#include <iomanip>
using namespace std;
#include <Windows.h>

#include "container.h"
#include "static.h"
#include "class.h"
#include "struct.h"
#include "stringOper.h"

enum class Color:int {
    Red,
    Yellow
};

std::string STR_UnicodeToANSI(const std::wstring& str)
{
    std::string strText;

    char* pElementText;
    int    iTextLen;
    // wide char to multi char
    iTextLen = WideCharToMultiByte(CP_ACP,
        0,
        str.c_str(),
        -1,
        NULL,
        0,
        NULL,
        NULL);
    pElementText = new char[iTextLen + 1];
    memset((void*)pElementText, 0, sizeof(char) * (iTextLen + 1));
    ::WideCharToMultiByte(CP_ACP,
        0,
        str.c_str(),
        -1,
        pElementText,
        iTextLen,
        NULL,
        NULL);
    strText = pElementText;
    delete[] pElementText;
    return strText;
}

void testEnum()
{
    Color color = Color::Red;

    int i = static_cast<int>(color);
    cout << i << endl;//0

    i = 1;
    enum type {
        type1 = 0,
        type2,
        type3
    };

    Color tmp = Color(i);
    switch (tmp)
    {
    case Color::Red:
        cout << "Red" << endl;
        break;
    case Color::Yellow:
        cout << "Yellow" << endl;
        break;
    default:
        cout << "Unknown color" << endl;
        break;
    }

    i = 2;
    type tmp1 = static_cast<type>(i);
    switch (tmp1)
    {
    case type::type1:
        cout << "type1" << endl;
        break;
    case type::type2:
        cout << "type1" << endl;
        break;
    case type::type3:
        cout << "type1" << endl;
        break;
    default:
        cout << "unknown type" << endl;
        break;
    }
    cout << tmp1 << endl;
}

void testWString()
{
    wstring wstr(L"舌刺xxcv123");
    wstring wstr1(L"舌刺");
    //int result = wstr.compare(0, 2, L"舌刺",2);
    int result = wstr.compare(0, wstr1.length(), L"舌刺");
    cout << "compare result:" << result << endl;

    //wchar_t wStrArr[2] = {L'1',L'2'};
    //wstring wStr(wStrArr);
    //int iFDI = atoi(STR_UnicodeToANSI(wStr.c_str()).c_str());

    const wchar_t* wStr1 = L"12";
    cout << lstrlen(wStr1) << endl;
    wstring wStr(wStr1, lstrlen(wStr1)+1);
    int iFDI = atoi(STR_UnicodeToANSI(wStr.c_str()).c_str());
    cout << iFDI << endl;

    wstring wstr2;
    wchar_t wt = L'1';
    wstr2.push_back(wt);
    wt = L'6';
    wstr2.push_back(wt);

    iFDI = atoi(STR_UnicodeToANSI(wstr2.c_str()).c_str());
    cout << iFDI << endl;


}

void testDiv()
{
    float fr = 1.0f / 60;
    double dr = 1.0f / 60;
    cout << "fr=" << fr << ",dr=" << dr << endl;
}

/*
测试循环内的static变量能否重复使用
结论：可以重用
*/
void testStatic()
{
    {
        for (int i = 0; i < 10; i++)
        {
            static int sum = 0;
            sum = sum + i;
            cout << sum << " ";
        }
        cout << endl;
    }
    STATIC_TEST::testSameStaticInDifferentFunction();
}

/*
* vector的赋值
*/

void tesstVector()
{
    class Student
    {
    public:
        Student() :age(0) {}
        Student(int i) :age(i) {}
        Student(const Student& st)
        {
            this->age = st.age;
        }
        void operator=(const Student& st)
        {
            this->age = st.age;
        }
        int getAge()
        {
            return age;
        }
    private:
        int age;
    };
    vector<Student> v1{ Student(1),Student(2),Student(3),Student(4) };
    vector<Student> v2 = v1;

    for (auto& val : v2)
    {
        cout << val.getAge() << " ";
    }
    cout << endl;

    v1[2] = Student(5);

    for (auto& val : v1)
    {
        cout << val.getAge() << " ";
    }
    cout << endl;

    for (auto& val : v2)
    {
        cout << val.getAge() << " ";
    }
    cout << endl;
}

void testRename()
{
    rename("D:\\test\\信息码_20", "D:\\test\\信息码_20_CNC");
}

void testUnorderedMap()
{
    typedef struct _st {
        int x;
        int y;
    }Point;
    unordered_map<int, Point> peekPoint;
    peekPoint.insert({ 1,{0,0} });
    peekPoint.insert({ 3,{3,3} });

    cout<<peekPoint[3].x<< peekPoint[3].y<<endl;
}

void testOper()
{
    int i = 51;
    i = (i / 10 - 4)*10 + i % 10;
    cout << i << endl;
}

void testVectorInit()
{
    vector<bool> vb(4, false);

    for (auto val : vb)
    {
        cout << boolalpha <<val<< endl;
    }
}

void testMaxMin()
{
    unsigned int num1 = 0;
    unsigned int num2 = 1;

    int result = max(num1, num2);

}

void testLoop()
{
    int index = 0;
    do {
        int index = 0;
    } while (index != 10);

}

void testContainer()
{
    //CONTAINER_TEST::testStack();
    //CONTAINER_TEST::testPriorityQueue();
    //CONTAINER_TEST::testQueue();
    CONTAINER_TEST::testVectorInsert();
	//CONTAINER_TEST::testVectorPointer();
    //CONTAINER_TEST::testVectorAddress();
    //CONTAINER_TEST::testPair();

}

void testWired()
{
    unsigned int p = 1000;
    //把值作为了指针的地址
    void* p1 = (void*)p;
    cout << p1 << endl;
}

void testScope()
{
    const int num = 10;
    {
        const int num = 100;
        cout << num << endl;
    }
    cout << num << endl;
}

void testClass()
{
    //CLASS_TEST::testFinalOvertide();
    CLASS_TEST::testNew();
}

void testStruct()
{
    STRUCT_TEST::testStruct();
}

void testType()
{
    wchar_t t1 = L'0';
    wchar_t t2 = L'6';
    int num = t2 - t1;
    cout<<num<< endl;
}

void testString()
{
    STRINGOPER::testStringOper();
}

void testMacro()
{
#define M1
#ifdef M1
    cout << "M1 defined" << endl;
#else
#ifdef M2
    cout << "M2 defined" << endl;
#else
    cout << "M2 not defined" << endl;
#endif
#endif

}
void testBitOper()
{
    int var1 = 0x00F0FF;
    int var2 = var1 & 0xFF;
    cout <<hex<< var2 << endl;
}

int main()
{
    testBitOper();
    //testContainer();
   // testWString();
    //testWired();
    //testScope();
    //testStatic();
    //testClass();
    //testStruct();
    //testType();
    //testString();
    //testMacro();

    system("pause");
    return 0;
}
