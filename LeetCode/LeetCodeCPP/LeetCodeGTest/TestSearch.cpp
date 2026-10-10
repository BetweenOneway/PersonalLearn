#include "gtest/gtest.h"
#include "Search.h"

TEST(Search, LeetCode695)
{
	vector<vector<int>> inputNums =
	  { {1, 0, 1, 1, 0, 1, 0, 1} ,
		{1, 0, 1, 1, 0, 1, 1, 1},
		{0, 0, 0, 0, 0, 0, 0, 1} };
	int expectResult = 6;

	EXPECT_EQ(expectResult, maxAreaOfIsland(inputNums));
}