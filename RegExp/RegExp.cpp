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
    {
        //这个用法不行 regex_match：全文匹配，要求整个字符串符合正则表达式的匹配规则。用来判断一个字符串和一个正则表达式是否模式匹配
        std::string str2("11,12,13,14");
        std::regex regex(R"(\\b[0-9]+\\b)");
        std::smatch pieces_match;
        if(std::regex_match(str2, pieces_match, regex))
        {
            for (size_t i = 0; i < pieces_match.size(); ++i)
            {
                std::ssub_match sub_match = pieces_match[i];
                std::string piece = sub_match.str();
                std::cout << "  submatch " << i << ": " << piece << '\n';
            }
        }
        else
        {
            cout << "regex_match error" << endl;
        }
    }

    {
        const std::string fnames[] = { "foo.txt", "bar.txt", "baz.dat", "zoidberg" };
        const std::regex txt_regex("[a-z]+\\.txt");

        for (const auto& fname : fnames)
            std::cout << fname << ": " << std::regex_match(fname, txt_regex) << '\n';

        // Extraction of a sub-match
        const std::regex base_regex("([a-z]+)\\.txt");
        std::smatch base_match;

        for (const auto& fname : fnames)
        {
            if (std::regex_match(fname, base_match, base_regex))
            {
                // The first sub_match is the whole string; the next
                // sub_match is the first parenthesized expression.
                if (base_match.size() == 2)
                {
                    std::ssub_match base_sub_match = base_match[1];
                    std::string base = base_sub_match.str();
                    std::cout << fname << " has a base of " << base << '\n';
                }
            }
        }
    }
}

void RegToken()
{
    std::string str("11, 12,13 ,14");
    std::regex reg(",");
    std::sregex_token_iterator pos(str.begin(), str.end(), reg, -1);
    decltype(pos) end;
    for (; pos != end; ++pos)
    {
        std::cout << pos->str() << std::endl;
    }
}

int main()
{
    //ListAllFiles();

    //MathOrSearch();
    //RegToken();
    //StringSplit();
	system("pause");
	return 0;
}
