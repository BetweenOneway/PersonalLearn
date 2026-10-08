#include "gtest/gtest.h"
#include "Sort.h"

TEST(Sort, LeetCode215)
{
	vector<int> inputNums = {3, 2, 1, 5, 6, 4};
	int k = 2;
	int expectTarget = 5;
	EXPECT_EQ(expectTarget,findKthLargest(inputNums,k));

	inputNums = { 3, 2, 3, 1, 2, 4, 5, 5, 6 };
	k = 4;
	expectTarget = 4;
	EXPECT_EQ(expectTarget, findKthLargest(inputNums, k));

	inputNums = { 7, 6, 5, 4, 3, 2, 1 };
	k = 2;
	expectTarget = 6;
	EXPECT_EQ(expectTarget, findKthLargest(inputNums, k));
}