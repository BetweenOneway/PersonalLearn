#include "gtest/gtest.h"
#include "Greedy.h"
#include "Graph.h"
#include "TwoPointers.h"

TEST(Greedy,LeetCode605)
{
	vector<int> flowerBed = { 1, 0, 0, 0, 1, 0, 0 };
	int num = 2;
	EXPECT_TRUE(canPlaceFlowers(flowerBed, num));
}

TEST(Greedy, LeetCode452)
{
	vector<vector<int>> ballons = { {10, 16} ,{2, 8},{1, 6},{7, 12 } };
	int result = 2;
	EXPECT_EQ(result, findMinArrowShots(ballons));
}

TEST(Greedy, LeetCode763)
{
	string s("ababcbacadefegdehijhklij");
    std::vector<int> correctResult1{ 9,7,8 };

    EXPECT_EQ(correctResult1, partitionLabels(s));

    s = "eccbbbbdec";
    std::vector<int> correctResult2{ 10 };

    EXPECT_EQ(correctResult2, partitionLabels(s));
}

TEST(Greedy, LeetCode122)
{
	std::vector<int> stockPrices1 = { 7,1,5,3,6,4 };
	int correctResult1 = 7;

	EXPECT_EQ(correctResult1, maxProfit(stockPrices1));

	std::vector<int> stockPrices2 = { 7,6,4,3,1 };
	int correctResult2 = 0;

	EXPECT_EQ(correctResult2, maxProfit(stockPrices2));

}