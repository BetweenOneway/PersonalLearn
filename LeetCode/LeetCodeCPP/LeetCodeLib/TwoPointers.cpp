#include "TwoPointers.h"
/*
* 给定一个链表，如果有环路，找出环路的开始点。
*/
ListNode* detectCycle(ListNode* head) {
	ListNode* slow = head, * fast = head;
	// 判断是否存在环路
	do {
		if (!fast || !fast->next) return nullptr;
		fast = fast->next->next;
		slow = slow->next;
	} while (fast != slow);
	// 如果存在，查找环路节点
	fast = head;
	while (fast != slow) {
		slow = slow->next;
		fast = fast->next;
	}
	return fast;
}

/*
* 给定两个字符串 S 和 T，求 S 中包含 T 所有字符的最短连续子字符串的长度，同时要求时间复杂度不得超过 O(n)
*/
string minWindow(string S, string T) {
	vector<int> chars(128, 0);
	vector<bool> flag(128, false);
	// 先统计T中的字符情况
	for (int i = 0; i < T.size(); ++i) {
		flag[T[i]] = true;
		++chars[T[i]];
	}

	// 移动滑动窗口，不断更改统计数据
	int cnt = 0, l = 0, min_l = 0, min_size = S.size() + 1;
	for (int r = 0; r < S.size(); ++r) {
		if (flag[S[r]]) {
			if (--chars[S[r]] >= 0) {
				++cnt;
			}
			// 若目前滑动窗口已包含T中全部字符，
			// 则尝试将l右移，在不影响结果的情况下获得最短子字符串
			while (cnt == T.size()) {
				//计算目前字符个数，如果比之前少，就更新边界
				if (r - l + 1 < min_size) {
					min_l = l;
					min_size = r - l + 1;
				}
				//移动左边界，移动之前判断左边界字符是否是T内的字符，如果是则更新之前字符串内数量
				if (flag[S[l]] && ++chars[S[l]] > 0) {
					--cnt;
				}
				++l;
			}
		}
	}
	return min_size > S.size() ? "" : S.substr(min_l, min_size);
}

//LeetCode #69
int mySqrt(int x) {
	if (x == 0 || x==1) return x;

	int l = 1, r = x;
	int mid = 0;

	while (l <= r)
	{
		mid = l + (r - l) / 2;
		if (false)
		{
			//会越界
			int powMid = mid * mid;
			if (powMid == x)
			{
				return mid;
			}
			if (powMid > x)
			{
				r = mid - 1;
			}
			else
			{
				l = mid + 1;
			}
		}
		else
		{
			int sqrt = x / mid;
			if (sqrt == mid)
			{
				return mid;
			}
			if (sqrt < mid)
			{
				r = mid - 1;
			}
			else
			{
				l = mid + 1;
			}
		}
	}

	return r;
}

//返回第一个大于等于 target 的元素下标
//不存在的情况可能返回0(都大于目标值)或size()(都小于目标值)
int lower_bound(const vector<int>& nums, const int target)
{
	//左闭右开
	int l = 0, r = nums.size();

	while (l < r)
	{
		int mid = l + (r - l) / 2;
		/*
		* 这里要考虑三种情况，
		* mid > t => r = mid
		* mid = t =>
		* mid < t => l=mid+1
		*/
		if (nums.at(mid) >= target)
		{
			r = mid;
		}
		else
		{
			l = mid + 1;
		}
	}
	return r;
}

//返回第一个大于 target 的元素下标
//不存在会返回size()（都小于目标值）或0（都大于目标值）
int upper_bound(const vector<int>& nums, const int target)
{
	//左闭右开
	int l = 0, r = nums.size();
	//这里取决于用什么区间，如果是左闭右闭，这里要写l<=r
	while (l < r)
	{
		int mid = l + (r - l) / 2;
		/*
		* 这里要考虑三种情况，
		* mid > t
		* mid = t
		* mid < t
		*/
		if (nums.at(mid) <= target)
		{
			l = mid + 1;
		}
		else
		{
			r = mid;
		}
	}
	return r;
}


//LeetCode #34
//查询一个数第一次和最后一次出现的位置 要求时间复杂度为LogN
vector<int> searchRange(const vector<int>& nums, const int target) {
	if (nums.empty()) return { -1,-1 };
	int lBound = lower_bound(nums, target);
	int rBound = upper_bound(nums, target) - 1;
	//这里为什么只判断lBound，而不判断rBound
	//因为当lBound不存在的时候，rBound一定不存在；当lBound存在的时候，rBound也一定存在
	if (lBound == nums.size() || nums.at(lBound) != target)
	{
		return { -1,-1 };
	}
	return { lBound,rBound };
}


