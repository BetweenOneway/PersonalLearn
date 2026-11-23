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

TEST(DP, LeetCode198)
{
	vector<int> nums = { 1,2,3,1 };
	int expectResult = 4;
	EXPECT_EQ(expectResult, rob(nums));

	nums = { 2,7,9,3,1 };
	expectResult = 12;
	EXPECT_EQ(expectResult, rob(nums));
}