#include "gtest/gtest.h"
#include "Greedy.h"
#include "Graph.h"
#include "TwoPointers.h"

TEST(Greedy,LeetCode122)
{
	vector<int> flowerBed = { 1, 0, 0, 0, 1, 0, 0 };
	int num = 2;
	EXPECT_TRUE(canPlaceFlowers(flowerBed, num));
}