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


TEST(Search, LeetCode547)
{
	vector<vector<int>> inputNums =
	{
		{1, 1, 0},
		{1, 1, 0},
		{0, 0, 1}
	};
	int expectResult = 2;

	EXPECT_EQ(expectResult, findCircleNum(inputNums));

	inputNums =
	{
		{1, 0, 0},
		{0, 1, 0},
		{0, 0, 1} 
	};
	expectResult = 3;

	EXPECT_EQ(expectResult, findCircleNum(inputNums));
}