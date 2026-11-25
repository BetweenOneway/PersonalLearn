#include "gtest/gtest.h"
#include "DP.h"
#include "CommonFunction.hpp"

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

TEST(DP, LeetCode413)
{
	vector<int> nums = { 1, 2, 3, 4 };
	int expectResult = 3;
	EXPECT_EQ(expectResult, numberOfArithmeticSlices(nums));

	nums = { 1};
	expectResult = 0;
	EXPECT_EQ(expectResult, numberOfArithmeticSlices(nums));
}

TEST(DP, LeetCode64)
{
	vector<vector<int>> grid = { 
		{1,3,1} ,
		{1,5,1},
		{4,2,1} 
	};
	int expectResult = 7;
	EXPECT_EQ(expectResult, minPathSum(grid));

	grid = {
		{1,2,3},
		{4,5,6}
	};
	expectResult = 12;
	EXPECT_EQ(expectResult, minPathSum(grid));

	grid = { {9, 1, 4, 8} };
	expectResult = 22;
	EXPECT_EQ(expectResult, minPathSum(grid));
}

TEST(DP, LeetCode542)
{
	vector<vector<int>> mat = { 
		{0, 0, 0} ,
		{0, 1, 0},
		{0, 0, 0} 
	};
	vector<vector<int>> expectOutput = { 
		{0, 0, 0} ,
		{0, 1, 0},
		{0, 0, 0} 
	};
	vector<vector<int>> actualResult = updateMatrix(mat);

	CheckResult(expectOutput, actualResult);

	mat = { 
		{0, 0, 0} ,
		{0, 1, 0},
		{1, 1, 1} 
	};
	expectOutput = { 
		{0, 0, 0} ,
		{0, 1, 0},
		{1, 2, 1} 
	};

	actualResult = updateMatrix(mat);
	CheckResult(expectOutput, actualResult);
}