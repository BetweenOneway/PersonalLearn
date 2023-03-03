#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <filesystem>
#include <unordered_map>
using namespace std;
#include <Windows.h>

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
    wstring wStr(wstr1, lstrlen(wStr1)+1);
    int iFDI = atoi(STR_UnicodeToANSI(wStr.c_str()).c_str());
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
    for (int i = 0; i < 10; i++)
    {
        static int sum = 0;
        sum = sum + i;
        cout << sum << " ";
    }
    cout << endl;
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
    rename("D:\\repo\\smarteeproj//SmarteeErpPrototypeFile//697770_周思怡_2211251654_信息码_20", "D:\\repo\\smarteeproj//SmarteeErpPrototypeFile\\697770_周思怡_2211251654_信息码_20_CNC");
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


void testVectorInsert()
{
    //插入10个5
    //vector<int> vi(10,5);
    vector<int> vi;
    for (int i = 0; i < 10; i++)
    {
        vi.push_back(i);
    }

    for (auto val : vi)
    {
        cout << val << " ";
    }
    cout << endl;
    auto it = vi.begin();
    advance(it, 3);
    //在给定的位置前插入
    vi.insert(it, 6);
    it = vi.begin();
    advance(it, 3);
    vi.insert(it, 5);
    cout << vi.size() << ": ";
    for (auto val : vi)
    {
        cout << val << " ";
    }
    cout << endl;

    //
    vector<int> vi1(10, 1);
    vector<int> vi2{11,22,33,44,55,66};
    it = vi1.begin();
    advance(it, 3);
    //[)
    vi1.insert(it, vi2.begin() + 2, vi2.begin() + 4);
    for (auto& val : vi1)
    {
        cout << val << " ";
    }
    cout << endl;
    
}

/*
* 测试vector访问越界
* 测试结果都会报错，但根据cppreference []不会做下标检查 at会做
*/
void testVectorRange()
{
    vector<int> vi(10, 1);
    for (int i = 0; i < 20; i++)
    {
        cout << vi[i] << endl;
    }
    //cout << vi[10] << endl;
    //cout << vi.at(10) << endl;
}

int main()
{
    testVectorInsert();
    system("pause");
    return 0;
}
