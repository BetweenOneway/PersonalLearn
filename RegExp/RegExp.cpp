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

void modifyFileName(wstring fileName,wstring dir)
{
	string strFileName = Wstring2String(fileName);
	string strDir = Wstring2String(dir);
	//hive��������ʽ�ڽ���ͨ���ƥ���ʱ��\d,\w,\s��������Ҫ���ж���ת��������ת����������ʽ��(\S+)-->(\\S+)
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
	wstring dir(L"D:\\���\\");
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

int main()
{
	ListAllFiles();
	system("pause");
	return 0;
}