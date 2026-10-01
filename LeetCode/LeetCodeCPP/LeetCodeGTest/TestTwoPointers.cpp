#include "gtest/gtest.h"
#include "TwoPointers.h"

TEST(TwoPointers, LeetCode69)
{
	int result = 2;
	EXPECT_EQ(result,mySqrt(8));

	EXPECT_EQ(result, mySqrt(4));
}

TEST(TwoPointers, LeetCode34)
{
	std::vector<int> nums1 = { 5, 7, 7, 8, 8, 10 };
	int target1 = 8;
	std::vector<int> expectResult1 = { 3, 4 };

	EXPECT_EQ(expectResult1, searchRange(nums1, target1));

	std::vector<int> nums2 = {5, 7, 7, 8, 8, 10};
	int target2 = 6;
	std::vector<int> expectResult2 = { -1, -1 };

	EXPECT_EQ(expectResult2, searchRange(nums2, target2));

	std::vector<int> nums3 = {};
	int target3 = 0;
	std::vector<int> expectResult3 = { -1, -1 };

	EXPECT_EQ(expectResult3, searchRange(nums3, target3));
}