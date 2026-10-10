#include <unordered_map>
#include <algorithm>
using namespace std;

#include "Sort.h"

int quickSelection1(vector<int>& nums, int l, int r)
{
	int i = l, j = r;
	int key = nums[l];
	int keyIndex = l;
	while (true)
	{
		//i指向第一个大于key的位置
		while (i < r && nums[i] <= key)
		{
			i++;
		}
		//j指向第一个小于key的位置
		while (j > l && nums[j] >= key)
		{
			j--;
		}
		if (i >= j)
		{
			break;
		}
		swap(nums[i], nums[j]);
	}
	//这里只能跟j换，跟i换会把大值换到前面去,排序后的主要左边<=key，右边>=key
	swap(nums[keyIndex], nums[j]);

	//返回值也要注意，这里只能返回j也就是key值的位置
	return j;
}

//这个解法，遇到大量重复值时，会超时
int findKthLargest1(vector<int>& nums, int k) {
	int l = 0, r = nums.size() - 1, target = nums.size() - k;
	while (l < r)
	{
		int mid = quickSelection1(nums, l, r);
		if (mid == target)
		{
			return nums[mid];
		}
		if (mid < target)
		{
			l = mid + 1;
		}
		else
		{
			r = mid - 1;
		}
	}
	return nums[l];
}

int quickselect(vector<int>& nums, int l, int r, int k) {
	if (l == r)
		return nums[k];
	int partition = nums[l], i = l - 1, j = r + 1;
	while (i < j) {
		do i++; while (nums[i] < partition);
		do j--; while (nums[j] > partition);
		if (i < j)
			swap(nums[i], nums[j]);
	}
	//这里为什么k==j的情况还要再走一遍呢？ 因为一轮分区只保证“区域大小关系”，不保证 pivot 恰好停在 j
	//为什么k==j只能走上面，不能走else 因为else不遍历j,只有if包含j
	if (k <= j)return quickselect(nums, l, j, k);
	else return quickselect(nums, j + 1, r, k);
}

//LeetCode #215
int findKthLargest(vector<int>& nums, int k) {
	int n = nums.size();
	return quickselect(nums, 0, n - 1, n - k);
}

void quickSort3Way(vector<int>& nums, int left, int right)
{
	if (left >= right) return;
	
	int base = nums[left];
	int lt = left;
	int gt = right;
	
	int index = left+1;

	while (index <= gt)
	{
		if (nums[index] < base)
		{
			swap(nums[index], nums[lt]);
			lt++;
			//这里是因为换到index位置上的值实际是base值，所以不需要比较了
			index++;
		}
		else if (nums[index] > base)
		{
			swap(nums[index], nums[gt]);
			//这里为什么不index++呢？因为换到index位置上的值还没有比较过
			gt--;
		}
		else
		{
			index++;
		}
	}
	//[lt,gt]区间内是等于base的值
	quickSort3Way(nums, left, lt - 1);
	quickSort3Way(nums, gt + 1, right);
}

//LeetCode #75
void sortColors(vector<int>& nums) {
	quickSort3Way(nums, 0, nums.size() - 1);
}

//LeetCode #347
vector<int> topKFrequent(vector<int>& nums, int k) {
	unordered_map<int, int> kv;
	for (auto& num : nums)
	{
		if (kv.find(num) != kv.end())
		{
			kv[num]++;
		}
		else
		{
			kv[num] = 1;
		}
	}

	std::vector<pair<int, int>> vecKv;
	for (const auto& it : kv)
	{
		vecKv.push_back(it);
	}

	sort(vecKv.begin(), vecKv.end(), [](pair<int, int>& prev, pair<int, int>& next) {return prev.second > next.second; });

	std::vector<int> result;
	for (int i = 0; i < k; i++)
	{
		result.push_back(vecKv[i].first);
	}

	return result;
}