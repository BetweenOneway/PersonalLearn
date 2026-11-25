#include "DP.h"
#include <vector>
#include <set>
#include <numeric>
using namespace std;

void backtrack70(int& ans, int cur, int step, int n)
{
	if (cur + step > n)
	{
		return;
	}
	if (cur + step == n)
	{
		ans++;
		return;
	}
	backtrack70(ans, cur + step, 1, n);
	backtrack70(ans, cur + step, 2, n);
}

//LeetCode #70 递归写法，会超时
int climbStairsRec(int n) {
	if (n <= 3) return n;
	int ans = 0;
	int cur = 0;
	backtrack70(ans, cur, 1, n);
	backtrack70(ans, cur, 2, n);

	return ans;
}

//LeetCode #70
int climbStairs(int n) {
	//状态转移方程为dp[i]=dp[i-1]+dp[i-2]
	if (n <= 3) return n;
	/*
	* 为什么是n + 1，因为dp[n]表示第n级台阶的结果
	* 为什么初始化为1？因为dp[2]=2，dp[1]=1，由此推算dp[0]也只能是1
	*/
	vector<int> dp(n + 1, 1);
	//为什么从2开始？因为方程的下标是从[i-2]开始，不然会越界
	for (int i = 2; i <= n; i++)
	{
		dp[i] = dp[i - 1] + dp[i - 2];
	}

	return dp[n];
}

//LeetCode #198
int rob(vector<int>& nums)
{
	int length = nums.size();
	if (0 == length)
	{
		return 0;
	}
	if (1 == length)
	{
		return nums[0];
	}

	int* rob = new int[length]();
	rob[0] = nums[0];

	rob[1] = max(nums[0], nums[1]);

	for (int i = 2; i < length; i++)
	{
		rob[i] = max(nums[i] + rob[i - 2], rob[i - 1]);
	}
	int result = rob[length - 1];
	delete[] rob;

	return result;
}

//LeetCode #413
int numberOfArithmeticSlices(vector<int>& nums) {
	int n = nums.size();
	if (n < 3) return 0;
	vector<int> dp(n, 0);
	for (int i = 2; i < n; i++)
	{
		if (nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2])
		{
			//所有之前以i-1为结尾的等差数列，都可以以i为结尾
			//同时多了一个i,i-1,i-2的等差数列，所以是dp[i-1]+1
			dp[i] = dp[i - 1] + 1;
		}
	}

	return accumulate(dp.begin(), dp.end(), 0);
}

void backtrack64(int& minAns,int curAns,int row,int col,const vector<vector<int>>& grid)
{
	int nRow = grid.size();
	int nCol = grid.front().size();

	if (row >= nRow || row < 0 || col >= nCol || col < 0)
	{
		return;
	}

	curAns = curAns + grid[row][col];

	if (row == nRow - 1 && col == nCol - 1)
	{	
		minAns = curAns < minAns ? curAns : minAns;
		return;
	}

	backtrack64(minAns, curAns, row + 1, col, grid);
	backtrack64(minAns, curAns, row, col+1, grid);
}

//LeetCode #64
int minPathSum(vector<vector<int>>& grid) {
	int nRow = grid.size();
	int nCol = grid.front().size();
	int ans = 0;
	if (false)
	{
		//回溯法，可以解决，但是大数据速度会慢，会超时
		ans = grid.front().front();
		if (nRow > 1 || nCol > 1)
		{
			int minAns = numeric_limits<int>::max();
			int curAns = 0;
			backtrack64(minAns, curAns, 0, 0, grid);
			ans = minAns;
		}
	}
	else
	{
		vector<vector<int>> dp(nRow, vector<int>(nCol, 0));
		for (int i = 0; i < nRow; i++)
		{
			for (int j = 0; j < nCol; j++)
			{
				if (i == 0 && j == 0)
				{
					dp[i][j] = grid[i][j];
				}
				else if (i == 0)
				{
					dp[i][j] = dp[i][j - 1] + grid[i][j];
				}
				else if (j == 0)
				{
					dp[i][j] = dp[i - 1][j] + grid[i][j];
				}
				else
				{
					dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
				}
			}
		}

		ans = dp[nRow - 1][nCol - 1];
	}
	return ans;
}

//LeetCode #542
vector<vector<int>> updateMatrix(vector<vector<int>>& mat) 
{
	vector<vector<int>> ans;
	return ans;
}
