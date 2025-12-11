#include <iostream>
#include <regex>
#include <string>
#include <vector>
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

//将名称中以指定分隔符进行分割，如"电影天堂.狂飙.01.mp4"之类的名字分割，并剔除或者替换某一个部分
void RenameFileMethod2(wstring fileName, wstring dir)
{
    string delimiter = ".";
    string strFileName = Wstring2String(fileName);
    string strDir = Wstring2String(dir);

    vector<string> res;
    char* strc = new char[strFileName.size() + 1];
    strcpy(strc, strFileName.c_str());   // 将str拷贝到 char类型的strc中
    char* temp = strtok(strc, delimiter.c_str());
    while (temp != NULL)
    {
        res.push_back(string(temp));
        temp = strtok(NULL, delimiter.c_str());	// 下一个被分割的串
    }
    delete[] strc;

    if (0 != res.size())
    {
        string targetString = "鹊刀门传奇";
        res[0] = targetString;
    }
    string destFileName = strDir;
    for (int i=0;i<res.size();i++)
    {
        if (i != 0)
        {
            destFileName += delimiter;
        }
        destFileName += res[i];
    }
    string srcFileName = strDir + strFileName;
    cout << srcFileName.c_str() << endl;
    cout << destFileName.c_str() << endl;
    rename(srcFileName.c_str(), destFileName.c_str());
}

void ListAllFiles()
{
	wstring dir(L"D:\\Downloads\\鹊刀门传奇\\");
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
            RenameFileMethod2(findData.cFileName,dir);
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
    if(false)
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

    if(false)
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

// 辅助函数：打印捕获结果
void printCaptureResult(const std::wsmatch& match, const std::wstring& desc) {
    std::wcout << L"=== " << desc << L" ===" << std::endl;
    // match[0] 是整个匹配的字符串
    std::wcout << L"完整匹配: " << (match.empty() ? L"无" : match.str(0)) << std::endl;

    // 遍历所有捕获组
    for (size_t i = 1; i < match.size(); ++i) {
        if (match[i].matched) {
            std::wcout << L"捕获组 " << i << L": " << match.str(i)
                << L" (位置: " << match.position(i) << L", 长度: " << match.length(i) << L")" << std::endl;
        }
        else {
            std::wcout << L"捕获组 " << i << L": 未匹配" << std::endl;
        }
    }
    std::wcout << std::endl;
}

int IfMatchChinese() {
    std::ios::sync_with_stdio(false);
    std::wcout.imbue(std::locale(""));

    std::wstring test = L"订单号";
    std::wregex re(L"\\S+"); // 尝试匹配非空白字符
    std::wsmatch match;

    //if走失败分支
    if (std::regex_match(test, match, re)) {
        std::wcout << L"匹配成功：" << match.str() << std::endl;
    }
    else {
        std::wcout << L"匹配失败（说明\\S不匹配中文）" << std::endl;
    }
    return 0;
}

void CaptureReg()
{
    // 设置控制台输出宽字符（Windows 下可选，确保中文/宽字符正常显示）
    std::ios::sync_with_stdio(false);
    std::wcout.imbue(std::locale(""));

    // ===================== 场景0：基础捕获（提取数字和文本） =====================
    std::wstring str0 = L"订单号：20251210，金额：999.99 元";
    // 修正：用 .+? 替代 \S+?（. 匹配任意字符，包括中文）
    std::wregex re0(L"(?:.+?)：(\\d+)，(?:.+?)：([0-9.]+) 元");
    std::wsmatch match0;

    if (std::regex_search(str0, match0, re0)) {
        std::wcout << L"订单号：" << match0.str(1) << std::endl;
        std::wcout << L"金额：" << match0.str(2) << std::endl;
    }
    else {
        std::wcout << L"匹配失败" << std::endl;
    }

    // ===================== 场景1：基础捕获（提取数字和文本） =====================
    std::wstring str1 = L"订单号：20251210，金额：999.99 元";
    // 正则表达式：捕获 订单号数字 和 金额数字
    std::wregex re1(L"订单号：(\\d+)，金额：([0-9.]+) 元");
    std::wsmatch match1;

    if (std::regex_search(str1, match1, re1)) {
        printCaptureResult(match1, L"基础捕获（订单号+金额）");
        // 直接使用捕获组
        std::wstring orderNo = match1.str(1);
        std::wstring amount = match1.str(2);
        std::wcout << L"提取结果：订单号=" << orderNo << L"，金额=" << amount << L"\n\n";
    }

    // ===================== 场景2：命名捕获（C++11 及以上） =====================
    std::wstring str2 = L"用户：张三，年龄：28，邮箱：zhangsan@example.com";
    // 命名捕获组：name, age, email
    std::wregex re2(L"用户：(?<name>[^，]+)，年龄：(?<age>\\d+)，邮箱：(?<email>[^\\s]+)");
    std::wsmatch match2;

    if (std::regex_search(str2, match2, re2)) {
        printCaptureResult(match2, L"命名捕获（用户信息）");
        // 通过名称访问捕获组（C++11 需注意编译器支持，如 GCC/Clang/VS2015+）
        std::wstring name = match2.str(1);
        std::wstring age = match2.str(2);
        std::wstring email = match2.str(3);
        std::wcout << L"提取结果：姓名=" << name << L"，年龄=" << age << L"，邮箱=" << email << L"\n\n";
    }

    // ===================== 场景3：多次匹配（提取所有符合条件的子串） =====================
    std::wstring str3 = L"商品1：苹果（5.99元），商品2：香蕉（3.5元），商品3：橙子（4.8元）";
    std::wregex re3(L"商品\\d+：([^（]+)（([0-9.]+)元）");
    std::wsmatch match3;

    std::wcout << L"=== 多次匹配（提取所有商品） ===" << std::endl;
    // 迭代查找所有匹配项
    std::wstring::const_iterator it = str3.cbegin();
    while (std::regex_search(it, str3.cend(), match3, re3)) {
        std::wcout << L"商品名称：" << match3.str(1)
            << L"，价格：" << match3.str(2) << L" 元" << std::endl;
        // 移动迭代器到当前匹配的末尾，继续查找下一个
        it = match3[0].second;
    }
    std::wcout << std::endl;

    // ===================== 场景4：可选捕获组（部分匹配） =====================
    std::wstring str4 = L"联系方式：13800138000（无备注）";
    std::wstring str5 = L"联系方式：13900139000（工作电话）";
    // 可选捕获组：备注（可能不存在）
    std::wregex re4(L"联系方式：(\\d{11})（(.*)）");
    std::wsmatch match4, match5;

    std::regex_search(str4, match4, re4);
    printCaptureResult(match4, L"可选捕获组（无备注）");

    std::regex_search(str5, match5, re4);
    printCaptureResult(match5, L"可选捕获组（有备注）");
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

// 提取 "-" 前后的内容（去除空格）
// 返回值：pair<前半部分, 后半部分>，若匹配失败则返回空字符串
std::pair<std::wstring,std::wstring> extractSplitContent(const std::wstring& str) {
    // 正则规则解析：
    // ^\\s*：匹配字符串开头的所有空格（忽略）
    // ([^-\\s]+)：捕获组1：- 前的内容（非 -、非空格的字符）
    // \\s*-\\s*：匹配 - 及其前后的所有空格（0个或多个）
    // ([^\\s]+)：捕获组2：- 后的内容（非空格的字符）
    // $：匹配字符串结尾（确保无多余内容）
    std::wregex re (L"^\\s*([^-\\s]+)\\s*-\\s*([^\\s]+)\\s*$");
    std::wsmatch match;

    if (std::regex_match(str, match, re)) {
        // 捕获组1：- 前内容，捕获组2：- 后内容
        return { match.str(1), match.str(2) };
    }
    else {
        return { L"", L"" }; // 匹配失败返回空
    }
}

int Capture1() {
    // 初始化宽字符输出，确保中文/特殊字符正常显示
    std::ios::sync_with_stdio(false);
    std::wcout.imbue(std::locale(""));

    // 测试字符串数组
    std::vector<std::wstring> strs = {
        L"gum",
        L"att-age",
        L"tooth-12",
        L"gumline - 13",
        L"  test  -  45  ", // 带首尾空格的场景
        L"abc- 67",        // - 后仅右侧空格
        L"def  -89"        // - 前仅左侧空格
    };

    // 遍历提取
    for (const auto& str : strs) {
        auto pairResult = extractSplitContent(str);
        std::wcout << L"原始字符串：「" << str << L"」" << std::endl;
        
        if (!pairResult.first.empty() && !pairResult.second.empty()) {
            std::wcout << L"提取结果：前 = 「" << pairResult.first << L"」，后 = 「" << pairResult.second << L"」" << std::endl;
        }
        else {
            std::wcout << L"提取失败：字符串格式不符合要求" << std::endl;
        }
        std::wcout << L"-------------------------" << std::endl;
    }

    return 0;
}

int main()
{
    //ListAllFiles();
    //MathOrSearch();
    //RegToken();
    //StringSplit();
    //CaptureReg();
    //IfMatchChinese();
    Capture1();
	system("pause");
	return 0;
}
