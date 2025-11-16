#pragma once
namespace STRINGOPER {
    int testStringOper();
    void testFind();
    void WStringSplit();
    //void StringSplit(const char* path);
    //void StringSplit(const wchar_t* path);
    std::vector<std::string> StringSplit(const std::string& str);
    std::vector<std::wstring> StringSplit(const std::wstring& str);

    template <typename T>
    std::vector<std::basic_string<T>> process_string(const std::basic_string<T>& str, const std::basic_string<T>& delimiters)
    {
        if (is_same_v<char, T>)
        {
            cout << "char type" << endl;
        }
        else if (is_same_v<wchar_t, T>)
        {
            cout << "wchar type" << endl;
        }
        std::vector<std::basic_string<T>> result;
        if (str.empty()) return result; // 空字符串直接返回

        size_t start = 0;
        // 遍历字符串，查找分隔符位置
        for (size_t end = 0; end < str.size(); ++end) {
            // 检查当前字符是否为分隔符（利用find，C++11起支持string_view优化，但此处保持兼容）
            if (delimiters.find(str[end]) != std::string::npos)
            {
                // 截取非空片段（start到end前）
                if (end > start)
                {
                    // emplace_back直接构造，避免临时字符串拷贝
                    result.emplace_back(str.data() + start, end - start);
                }
                start = end + 1; // 移动起始位置
            }
        }

        // 处理最后一个片段（若存在）
        if (start < str.size()) {
            result.emplace_back(str.data() + start, str.size() - start);
        }
        return result;
    }

    template <typename T>
    std::vector<std::basic_string<T>> process_string(const T* c_str, const T* delim) {
        // 转换为std::basic_string后调用核心逻辑，避免重复代码
        return process_string(std::basic_string<T>(c_str), std::basic_string<T>(delim));
    }
}
