#include <cstdlib>
#include <ctime>
using namespace std;

#include "Sort.h"

// 三路快排 arr[l...r]
void quickSort3Way(vector<int>& arr, int l, int r)
{
	if (l >= r) return;

	int pivot = arr[l];
	// lt: <pivot区间右边界；gt: >pivot区间左边界
	int lt = l;
	int gt = r;
	int i = l + 1;

	while (i <= gt)
	{
		if (arr[i] < pivot)
		{
			swap(arr[i], arr[lt]);
			lt++;
			i++;
		}
		else if (arr[i] > pivot)
		{
			swap(arr[i], arr[gt]);
			gt--;
		}
		else // arr[i] == pivot，直接跳过
		{
			i++;
		}
	}
	// [l, lt-1] < pivot
	// [lt, gt]   = pivot
	// [gt+1, r]  > pivot
	quickSort3Way(arr, l, lt - 1);
	quickSort3Way(arr, gt + 1, r);
}

void quickSort3Way(vector<int>& nums)
{
	quickSort3Way(nums, 0, nums.size() - 1);
}

void quickSort(vector<int>& arr, int l, int r)
{
	if (l >= r) return;
	// 随机选基准，交换到最左边
	int randIdx = l + rand() % (r - l + 1);
	swap(arr[l], arr[randIdx]);
	int pivot = arr[l];

	int i = l, j = r;
	while (i < j)
	{
		while (i < j && arr[j] > pivot) j--;
		while (i < j && arr[i] < pivot) i++;
		if (i < j) swap(arr[i], arr[j]);
	}
	arr[l] = arr[i];
	arr[i] = pivot;

	quickSort(arr, l, i - 1);
	quickSort(arr, i + 1, r);
}

void QuickSort(vector<int>& nums)
{
	quickSort(nums, 0, nums.size() - 1);
}

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