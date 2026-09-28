//
// main.cpp
//
#include "gtest/gtest.h"

int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);

    // 需要全局环境时在此注册：
    // ::testing::AddGlobalTestEnvironment(new MyEnvironment());

    return RUN_ALL_TESTS();
}
