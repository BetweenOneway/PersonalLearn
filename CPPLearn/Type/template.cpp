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

namespace TEMPLATE_VAR_ARGS
{
    template<typename... Args>
    auto right_fold(Args... args) {
        return (args - ...);
    }
    // right_fold(10, 3, 2) → 10 - (3 - 2) = 10 -1 =9

    //一元左折叠
    template<typename... Args>
    auto left_fold(Args... args) {
        return (... - args);
    }

    void TestFoldExpression()
    {
        //2
        std::cout << right_fold<int>(10, 9, 8, 7)<<std::endl;
        //-14
        std::cout << left_fold<int>(10, 9, 8, 7) << std::endl;
    }
}
