#include <iostream>
#include <regex>
#include <string>
using namespace std;

#include <Windows.h>

std::string Wstring2String(std::wstring wstr)
{
	// support chinese
	std::string res;
	int len = WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), wstr.size(), nullptr, 0, nullptr, nullptr);
	if (len <= 0) {
		return res;
	}
	char* buffer = new char[len + 1];
	if (buffer == nullptr) {
		return res;
	}
	WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), wstr.size(), buffer, len, nullptr, nullptr);
	buffer[len] = '\0';
	res.append(buffer);
	delete[] buffer;
	return res;
}

std::wstring String2Wstring(std::string wstr)
{
	std::wstring res;
	int len = MultiByteToWideChar(CP_ACP, 0, wstr.c_str(), wstr.size(), nullptr, 0);
	if (len < 0) {
		return res;
	}
	wchar_t* buffer = new wchar_t[len + 1];
	if (buffer == nullptr) {
		return res;
	}
	MultiByteToWideChar(CP_ACP, 0, wstr.c_str(), wstr.size(), buffer, len);
	buffer[len] = '\0';
	res.append(buffer);
	delete[] buffer;
	return res;
}

//将名称中含有中括号，如"[电影天堂]狂飙-01.mp4"之类的名字转换成"狂飙-01.mp4"
void modifyFileName(wstring fileName,wstring dir)
{
	string strFileName = Wstring2String(fileName);
	string strDir = Wstring2String(dir);
	//hive的正则表达式在进行通配符匹配的时候\d,\w,\s，这种需要进行二次转换，即先转义后正则的形式：(\S+)-->(\\S+)
	wstring result = regex_replace(fileName, wregex(L"\\[.+\\]"), L"");
	string strResult = Wstring2String(result);

	string srcFileName = strDir + strFileName;
	string destFileName = strDir + strResult;
   	cout << srcFileName.c_str()<<endl;
	cout << destFileName.c_str() << endl;
	rename(srcFileName.c_str(), destFileName.c_str());
}

void ListAllFiles()
{
	wstring dir(L"H:\\电视剧\\浪漫医生金师傅\\3\\");
	wstring searchDir = dir + L"*.*";
	HANDLE hFind;
	WIN32_FIND_DATA findData;
	hFind = FindFirstFile(searchDir.c_str(), &findData);
	if (hFind == INVALID_HANDLE_VALUE)
	{
		cout << "error!!!";
		return;
	}
	do {
		if (0 == wcscmp(findData.cFileName, L".") || 0 == wcscmp(findData.cFileName, L".."))
		{
			continue;
		}
		if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
		{
			cout << "find dir" << endl;
		}
		else
		{
			cout << findData.cFileName << endl;
			modifyFileName(findData.cFileName,dir);
		}
	} while (FindNextFile(hFind, &findData));
}

void testReplace()
{
    wstring text(L"丁昕奕774652U");
    //wstring result = regex_replace(text, wregex(L"[\u4e00-\u9fa5]"), L"");
    std::wstring name(L"丁昕奕");
    wstring result = regex_replace(text, wregex(name), L"");
    wstring dir = regex_replace(result, wregex(L"[0-9]"),L"");
    if (1)
    {

    }
}

void MathOrSearch()
{
    std::wstring str(L"ABC123LinguleBuckle3.5.obj");
    std::wstring str1(L"123舌侧扣3.5.obj");
    //L表示宽字符 R表示原始字符串 icase表示忽略大小写
    //https://en.cppreference.com/w/cpp/regex/basic_regex
    std::wregex wreg(LR"(lingule|舌侧扣|舌侧口)", std::regex::icase);

    std::wsmatch result;
    if (std::regex_search(str1, result, wreg))
    {
        for (int i = 0; i < result.size(); i++)
        {
            cout << Wstring2String(result[i].str()) << endl;
        }
    }
}

int main()
{
    ListAllFiles();

    MathOrSearch();

	system("pause");
	return 0;
}
