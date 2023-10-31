#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

#include <vector>
using namespace std;

#include "stringOper.h"

namespace STRINGOPER{
    void test()
    {
	    string src = "D:/repo/smarteeproj//SmarteeErpPrototypeFile//358165_2201100015_4//CombineMesh.stl123";
	    //src = "D:/1.stl123";
	    int pos = src.find_last_of('.');
	    int len = src.length();
	    auto replacePos = src.begin();
	    advance(replacePos, src.find_last_of('.'));
	    //src.replace(replacePos, src.end(), ".obj");
	    src.replace(pos, len - pos, "wangwei.obj");
	    cout << src << endl;
    }

    void test1()
    {
	    for (int i = 0; i < 5; i++)
	    {
		    ostringstream oss;
		    oss << "D:/repo/smarteeproj/SmarteeErpPrototypeFile/" << i << "splited.stl";
		    string src = oss.str();
		    cout << src << endl;
	    }
    }

    template< class T >
    struct VNVector3
    {
	    T  x;
	    T  y;
	    T  z;
	    VNVector3() {}
	    VNVector3(T ix, T iy, T iz) : x(ix), y(iy), z(iz) {}
	    const T& operator[](unsigned i) const { 
		    return  ((T*)(&x))[i]; 
	    }
	    T& operator[](unsigned i) 
	    { 
		    return  ((T*)(&x))[i]; 
	    }
	    const T* Ptr() const { return &x; }
	    T* Ptr() { return &x; }
    };

    void test2()
    {
	    VNVector3<unsigned int> vec(0,1,2);
	    cout << vec[0] << endl;
	    cout << vec[1] << endl;
	    cout << vec[2] << endl;
    }

    void testWstring()
    {
        std::wstring wstr(L"中bc");
        wchar_t wchar = wstr[0];
        wchar_t upperChar = std::toupper(wchar);
        wstr[0] = upperChar;
        wcout.imbue(locale("chs"));
        wcout << wstr << endl;

        std::wstringstream ss;
        ss << L"中国" << setw(2) << std::setfill(L'0') << 6<<"China"<<9;

        cout << 7 << endl;
        std::wstring s = ss.str();

        cout << s.c_str() << endl;
    }

    int testStringOper()
    {
        testWstring();
	    cin.get();
        return 0;
    }

    void testFind()
    {
        std::wstring str(L"LinguleBuckle3.5.obj");
        unsigned int pos = str.find(L"LinguleBuckle");
        cout << pos << endl;
    }

    void StringSplit()
    {
        std::string str("11, 12,,13 ,14,");
        char split = ',';

        std::vector<string> subStrs;
        size_t prevPos = 0;
        auto pos = str.find_first_of(split);
        while (pos != std::string::npos)
        {
            if (pos > prevPos)
            {
                subStrs.push_back(str.substr(prevPos, pos - prevPos));
            }
            prevPos = pos + 1;
            pos = str.find_first_of(split, prevPos);
        }
        if (prevPos != str.length())
        {
            subStrs.push_back(str.substr(prevPos));
        }
        for (auto& elem : subStrs)
        {
            cout << elem.c_str() << endl;
        }
    }

    void WStringSplit()
    {
        std::wstring str(L"11, 12,,13 ,14,");
        wchar_t split{ ',' };

        std::vector<wstring> subStrs;
        size_t prevPos = 0;
        auto pos = str.find_first_of(split);
        while (pos != std::string::npos)
        {
            if (pos > prevPos)
            {
                subStrs.push_back(str.substr(prevPos, pos - prevPos));
            }
            prevPos = pos + 1;
            pos = str.find_first_of(split, prevPos);
        }
        if (prevPos != str.length())
        {
            subStrs.push_back(str.substr(prevPos));
        }
        for (auto& elem : subStrs)
        {
            cout << elem.c_str() << endl;
        }
    }
}
