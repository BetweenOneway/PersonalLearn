#include <vector>
using namespace std;

//LeetCode #33
int Search33(const vecot<int>& nums,int target)
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
bool Search(const vecot<int>& nums,int target)
{
	int l=0,r=nums.size()-1;
	while(l<=r)
	{
		int mid = l + (r-l)/2;
		if(nums[mid] == target){
			return true;
		}
		//左区间有序
		if(nums[l]<=nums[mid])
		{
			if(nums[l]<=target && target<nums[mid])
			{
				r=mid-1;
			}
			else
			{
				l = mid+1;
			}
		}
		//右区间有序
		else if(nums[mid]<=nums[r])
		{
			if(nums[mid]>target && target<=nums[r-1])
			{
				l=mid+1;
			}
			else
			{
				r=mid-1;
			}
		}
		else
		{
			l++;
			r++;
		}
	}
	return false;
}
