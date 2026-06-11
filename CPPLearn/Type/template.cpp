#include <iostream>
#include <string>
#include "template.h"

namespace TEST_TEMPLATE
{
    template <typename T>
    class ValueHolder
    {
    private:
        T data_;
    public:
        explicit ValueHolder(const T& val) : data_(val) {}

        T get() const { return data_; }
    };

    int Test1()
    {
        // C++17+ 自动推导类型，不用写 <int> / <string>
        ValueHolder h1(666);          // 推导为 ValueHolder<int>
        ValueHolder h2(99.9);         // 推导为 ValueHolder<double>
        ValueHolder h3(std::string("测试"));

        std::cout << h1.get() << "\n"
            << h2.get() << "\n"
            << h3.get() << std::endl;

        return 0;
    }
}
