#include "DP.h"
#include <vector>
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

