#include <vector>
using namespace std;

//LeetCode #33
int Search33(const vecot<int>& nums,const int target)
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
bool Search81(const vecot<int>& nums,const int target)
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
