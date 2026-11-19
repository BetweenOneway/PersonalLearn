#include "gtest/gtest.h"
#include "DP.h"

TEST(DP, LeetCode70)
{
	int n = 2;
	int expectResult = 2;
	EXPECT_EQ(expectResult, climbStairs(n));

	n = 3, expectResult = 3;
	EXPECT_EQ(expectResult, climbStairs(n));

	n = 4, expectResult = 5;
	EXPECT_EQ(expectResult, climbStairs(n));
}