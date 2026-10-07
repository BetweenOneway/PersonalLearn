#include <vector>
using namespace std;

//LeetCode #69
int mySqrt(int x) {
	if (x == 0 || x == 1) return x;

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

//LeetCode #33
int Search33(const vector<int>& nums,const int target)
{
	int l=0,r=nums.size();
	while(l<r)
	{
		int mid = l+(r-l)/2;
		if(nums[mid] == target)
		{
			return mid;
		}
		//左边有序
		if(nums[l]<=nums[mid])
		{
			//target [l,r)
			if(nums[l]<=target && target<nums[mid])
			{
				r=mid;//[l,mid)
			}
			else
			{
				l = mid+1;//[mid+1,r)
			}
		}
		//右边有序
		else
		{
			if(target>nums[mid] && target<=nums[r-1])
			{
				l=mid+1;
			}
			else
			{
				r=mid;
			}
		}
	}
	return -1;
}

//LeetCode #81
bool Search81(const vector<int>& nums,const int target)
{
	int l=0,r=nums.size();
	while(l<r)
	{
		int mid = l + (r-l)/2;
		if(nums[mid] == target){
			return true;
		}
		//相对于上面的第33题，这里因为允许重复数字，所以存在了一种可能性，即两端相等的情况 所以要跳过
		if(nums[l] == nums[mid] && nums[mid]==nums[r-1])
		{
			l++;
			r--;
		}
		//左区间有序
		else if(nums[l]<=nums[mid])
		{
			if(nums[l]<=target && target<nums[mid])
			{
				r=mid;
			}
			else
			{
				l = mid+1;
			}
		}
		//右区间有序
		else
		{
			if(nums[mid]<target && target<=nums[r-1])
			{
				l=mid+1;
			}
			else
			{
				r=mid;
			}
		}
	}
	return false;
}
