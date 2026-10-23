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

TEST(Search, LeetCode46)
{
	auto checkResult = [](vector<vector<int>>& expectResult, vector<vector<int>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	vector<int> nums = { 1, 2, 3 };
	vector<vector<int>> expectResult = { {1, 2, 3} ,{1, 3, 2},{2, 1, 3},{2, 3, 1},{3, 1, 2},{3, 2, 1} };
	vector<vector<int>> actualResult = permute(nums);
	
	checkResult(expectResult, actualResult);

	nums = { 0, 1 };
	expectResult = { {0, 1} ,{1, 0} };
	actualResult = permute(nums);

	checkResult(expectResult, actualResult);

	nums = { 1 };
	expectResult = { {1} };
	actualResult = permute(nums);
	
	checkResult(expectResult, actualResult);
}

TEST(Search, LeetCode77)
{
	auto checkResult = [](vector<vector<int>>& expectResult, vector<vector<int>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	int n = 4, k = 2;
	vector<vector<int>> expectResult = {
		{2, 4},{3, 4},{2, 3},{1, 2},{1, 3},{1, 4},
	};
	vector<vector<int>> actualResult = combine(n,k);

	checkResult(expectResult, actualResult);

	n = 1, k = 1;
	expectResult = {
		{1}
	};

	actualResult = combine(n, k);

	checkResult(expectResult, actualResult);
}