#include <windows.h>
#include <iostream>
#include <tchar.h>
#include <io.h>
#include <fcntl.h>


// 遍历指定目录下的所有文件（不递归子文件夹）
void TraverseFiles(LPCTSTR lpszPath)
{
    TCHAR szFindPath[MAX_PATH];
    // 拼接查找路径：路径 + \*.*
    _stprintf_s(szFindPath, _T("%s\\*.*"), lpszPath);

    WIN32_FIND_DATA findData;
    // 开始查找
    HANDLE hFind = FindFirstFile(szFindPath, &findData);
    if (hFind == INVALID_HANDLE_VALUE)
    {
        _tprintf(_T("路径无效或打开失败：%s\n"), lpszPath);
        return;
    }

    // 循环遍历所有文件/文件夹
    do
    {
        // 跳过 . 和 .. 两个系统目录
        if (_tcscmp(findData.cFileName, _T(".")) == 0 ||
            _tcscmp(findData.cFileName, _T("..")) == 0)
        {
            continue;
        }

        // 拼接完整路径
        TCHAR szFullPath[MAX_PATH];
        _stprintf_s(szFullPath, _T("%s\\%s"), lpszPath, findData.cFileName);

        // 判断是文件还是文件夹
        if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
        {
            _tprintf(_T("[文件夹] %s\n"), szFullPath);
        }
        else
        {
            _tprintf(_T("[文件]   %s\n"), szFullPath);
        }

    } while (FindNextFile(hFind, &findData)); // 查找下一个

    // 关闭查找句柄
    FindClose(hFind);
}

// 递归遍历所有文件和子文件夹
void TraverseFilesRecursive(LPCTSTR lpszPath)
{
    TCHAR szFindPath[MAX_PATH];
    _stprintf_s(szFindPath, _T("%s\\*.*"), lpszPath);

    WIN32_FIND_DATA findData;
    HANDLE hFind = FindFirstFile(szFindPath, &findData);
    if (hFind == INVALID_HANDLE_VALUE)
        return;

    do
    {
        // 跳过系统目录
        if (_tcscmp(findData.cFileName, _T(".")) == 0 ||
            _tcscmp(findData.cFileName, _T("..")) == 0)
        {
            continue;
        }

        TCHAR szFullPath[MAX_PATH];
        _stprintf_s(szFullPath, _T("%s\\%s"), lpszPath, findData.cFileName);

        if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
        {
            // 是文件夹：递归进入遍历
            _tprintf(_T("[文件夹] %s\n"), szFullPath);
            TraverseFilesRecursive(szFullPath);
        }
        else
        {
            // 是文件：直接输出
            _tprintf(_T("[文件]   %s\n"), szFullPath);
        }

    } while (FindNextFile(hFind, &findData));

    FindClose(hFind);
}

int main(int argc, TCHAR* argv[])
{
    std::cout << "你好，中国！" << std::endl;

    //解决_tprintf输出的中文不显示问题
    _setmode(_fileno(stdout), _O_U8TEXT);
    
    LPCTSTR szPath = _T("D:\\wangwei\\工作\\笔记");  // 你的目标路径

    _tprintf(_T("递归遍历：%s\n\n"), szPath);
    TraverseFilesRecursive(szPath);

    system("pause");
    return 0;
}
