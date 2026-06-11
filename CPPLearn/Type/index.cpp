
namespace STATIC_TEST {
    static int num = 10;
}

#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <filesystem>
#include <unordered_map>
#include <iomanip>
#include <Windows.h>

#include "container.h"
#include "static.h"
#include "class.h"
#include "struct.h"
#include "stringOper.h"

#include "bitOper.h"
#include "stream.h"
#include "function.h"

#include "fileOper.h"
#include "type.h"
#include "exception.h"

#include "template.h"

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
    std::cout << i << std::endl;//0

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
        std::cout << "Red" << std::endl;
        break;
    case Color::Yellow:
        std::cout << "Yellow" << std::endl;
        break;
    default:
        std::cout << "Unknown color" << std::endl;
        break;
    }

    i = 2;
    type tmp1 = static_cast<type>(i);
    switch (tmp1)
    {
    case type::type1:
        std::cout << "type1" << std::endl;
        break;
    case type::type2:
        std::cout << "type1" << std::endl;
        break;
    case type::type3:
        std::cout << "type1" << std::endl;
        break;
    default:
        std::cout << "unknown type" << std::endl;
        break;
    }
    std::cout << tmp1 << std::endl;
}

void testWString()
{
    std::wstring wstr(L"舌刺xxcv123");
    std::wstring wstr1(L"舌刺");
    //int result = wstr.compare(0, 2, L"舌刺",2);
    int result = wstr.compare(0, wstr1.length(), L"舌刺");
    std::cout << "compare result:" << result << std::endl;

    //wchar_t wStrArr[2] = {L'1',L'2'};
    //wstring wStr(wStrArr);
    //int iFDI = atoi(STR_UnicodeToANSI(wStr.c_str()).c_str());

    const wchar_t* wStr1 = L"12";
    std::cout << lstrlen(wStr1) << std::endl;
    std::wstring wStr(wStr1, lstrlen(wStr1)+1);
    int iFDI = atoi(STR_UnicodeToANSI(wStr.c_str()).c_str());
    std::cout << iFDI << std::endl;

    std::wstring wstr2;
    wchar_t wt = L'1';
    wstr2.push_back(wt);
    wt = L'6';
    wstr2.push_back(wt);

    iFDI = atoi(STR_UnicodeToANSI(wstr2.c_str()).c_str());
    std::cout << iFDI << std::endl;
}

void testDiv()
{
    float fr = 1.0f / 60;
    double dr = 1.0f / 60;
    std::cout << "fr=" << fr << ",dr=" << dr << std::endl;
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
            std::cout << sum << " ";
        }
        std::cout << std::endl;
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
    std::vector<Student> v1{ Student(1),Student(2),Student(3),Student(4) };
    std::vector<Student> v2 = v1;

    for (auto& val : v2)
    {
        std::cout << val.getAge() << " ";
    }
    std::cout << std::endl;

    v1[2] = Student(5);

    for (auto& val : v1)
    {
        std::cout << val.getAge() << " ";
    }
    std::cout << std::endl;

    for (auto& val : v2)
    {
        std::cout << val.getAge() << " ";
    }
    std::cout << std::endl;
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
    std::unordered_map<int, Point> peekPoint;
    peekPoint.insert({ 1,{0,0} });
    peekPoint.insert({ 3,{3,3} });

    std::cout<<peekPoint[3].x<< peekPoint[3].y<<std::endl;
}

void testOper()
{
    int i = 51;
    i = (i / 10 - 4)*10 + i % 10;
    std::cout << i << std::endl;
}

void testVectorInit()
{
    std::vector<bool> vb(4, false);

    for (auto val : vb)
    {
        std::cout << std::boolalpha <<val<< std::endl;
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
    //CONTAINER_TEST::testVectorInsert();
	//CONTAINER_TEST::testVectorPointer();
    //CONTAINER_TEST::testVectorAddress();
    //CONTAINER_TEST::testPair();
    //CONTAINER_TEST::testVectorErase();
    //CONTAINER_TEST::compareVectorArray();
    //CONTAINER_TEST::testVectorConstruct();
    //CONTAINER_TEST::testVectorEfficent();
    //CONTAINER_TEST::testTuple();
    CONTAINER_TEST::testUnorderedMapSort();
}

void testWired()
{
    unsigned int p = 1000;
    //把值作为了指针的地址
    void* p1 = (void*)p;
    std::cout << p1 << std::endl;
}

void testScope()
{
    const int num = 10;
    {
        const int num = 100;
        std::cout << num << std::endl;
    }
    std::cout << num << std::endl;
}

void testClass()
{
    //CLASS_TEST::testFinalOvertide();
    //CLASS_TEST::testInherit();
    //CLASS_TEST::testClassPassPointer();
    //CLASS_TEST::testLozengeInherit();
    //CLASS_TEST::testInherit2();
    //CLASS_TEST::testRefMem();
    //CLASS_TEST::testClassScope();
    //CLASS_TEST::testFirendClass();
    //CLASS_TEST::testClassOverride();
    CLASS_TEST::TestPolymorphism();
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
    std::cout<<num<< std::endl;
}

void testString()
{
    //STRINGOPER::testStringOper();
    //STRINGOPER::testFind();
    //STRINGOPER::WStringSplit();
    //STRINGOPER::StringSplit(std::string("d:/testdata\\autocut\\path.obj"));
    //STRINGOPER::StringSplit("d:/testdata\\autocut\\path.obj");
    //STRINGOPER::StringSplit(L"d:/中国\\autocut\\path.obj");
    auto result = STRINGOPER::process_string("d:/testdata\\autocut\\path.obj","/\\");
    auto result1 = STRINGOPER::process_string(L"d:/中国\\autocut\\path.obj", L"/\\");
}

void testMacro()
{
#define M1
#ifdef M1
    std::cout << "M1 defined" << std::endl;
#else
#ifdef M2
    std::cout << "M2 defined" << std::endl;
#else
    std::cout << "M2 not defined" << std::endl;
#endif
#endif

}

void testBit()
{
    //int var1 = 0x00F0FF;
    //int var2 = var1 & 0xFF;
    //std::cout <<hex<< var2 << std::endl;
    //BIT_OPER::testBitOper();
    BIT_OPER::testOper();
}

void testDist()
{
    std::vector<int> vec{1,2,3,4,5,6,7,8};
    auto it = vec.begin();
    auto it1 = vec.begin() + 2;
    std::cout << *it << " " << *it1 << std::endl;
    std::cout << "dist;" << std::distance(vec.begin(), vec.begin()) << std::endl;

}

void testStream()
{
    STREAM::testStream();
}

void testFunction()
{
    //FUNCTION::testFunction();
    FUNCTION::testImplicitConvention();
}

void testFileOper()
{
    //FILE_OPER::testWriteContainerToFile();
    FILE_OPER::StingStreamToVector();
}

void testTypeOf()
{
    TYPE_OF::testTypeId();
}

void testException()
{
    EXCEPTION::testException();
}

int main()
{
    //testClass();
    //testException();
    //testTypeOf();
    //testFileOper();
    //testStream();
    //testDist();
    //testBit();
    //testContainer();
    //testWString();
    //testWired();
    //testScope();
    //testStatic();
    //testClass();
    //testStruct();
    //testType();
    //testString();
    //testMacro();

    //testFunction();

    TEST_TEMPLATE::Test1();

    //std::cout << STATIC_TEST::num << std::endl;
    system("pause");
    return 0;
}
