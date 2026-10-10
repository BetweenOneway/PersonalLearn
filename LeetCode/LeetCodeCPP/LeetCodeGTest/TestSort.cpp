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

TEST(Sort, LeetCode75)
{
	vector<int> inputNums = {2, 0, 2, 1, 1, 0};
	vector<int> expectTarget = { 0, 0, 1, 1, 2, 2 };
	
	sortColors(inputNums);
	
	EXPECT_EQ(expectTarget, inputNums);

	inputNums = { 2, 0, 1 };
	expectTarget = { 0, 1, 2 };

	sortColors(inputNums);

	EXPECT_EQ(expectTarget, inputNums);

}

TEST(Sort, LeetCode347)
{
	vector<int> nums = { 1, 1, 1, 2, 2, 3 };
	int k = 2;

	vector<int> result = { 1, 2 };
	EXPECT_EQ(result, topKFrequent(nums, k));

	nums = { 1, 2, 1, 2, 1, 2, 3, 1, 3, 2 }; 
	k = 2;
	result = { 1, 2 };
	EXPECT_EQ(result, topKFrequent(nums, k));
}