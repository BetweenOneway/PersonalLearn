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

TEST(Search, LeetCode417)
{
	vector<vector<int>> heights{ 
		{1, 2, 2, 3, 5},
		{3, 2, 3, 4, 4},
		{2, 4, 5, 3, 1},
		{6, 7, 1, 4, 5},
		{5, 1, 1, 2, 4} };
	vector<vector<int>> expectResult{ {0, 4} ,{1, 3},{1, 4},{2, 2},{3, 0},{3, 1},{4, 0} };
	EXPECT_EQ(expectResult, pacificAtlantic(heights));

	heights={{2,1} ,{1,2} };
	expectResult = { {0,0} ,{0,1},{1,0},{1,1} };
	EXPECT_EQ(expectResult, pacificAtlantic(heights));
}