#include "Search.h"
#include <queue>
using namespace std;

int DFS(vector<vector<int>>& grid, int row, int col)
{
	if (grid[row][col] == 0) return 0;

	//标记当前岛屿已经遍历过
	//即使回溯也不影响，因为如果当前岛屿与前面的联通，一定已经被前面计算过
	grid[row][col] = 0;

	int area = 1;
	//每两位代表一个方向 上右下左
	vector<int> direction{-1,0,1,0,-1};
	for (int i = 0; i < direction.size()-1; i++)
	{
		int curRow = row + direction[i];
		int curCol = col + direction[i + 1];
		if (curRow >= 0 && curRow < grid.size()
			&& curCol >= 0 && curCol < grid[curRow].size())
		{
			area += DFS(grid, curRow, curCol);
		}
	}

	return area;
}

//LeetCode #695
int maxAreaOfIsland(vector<vector<int>>& grid)
{
	if (grid.empty()) return 0;
	int maxArea = 0;
	for (int i = 0; i < grid.size(); i++)
	{
		for (int j = 0; j < grid[i].size(); j++)
		{
			int area = DFS(grid, i, j);
			maxArea = maxArea > area ? maxArea : area;
		}
	}

	return maxArea;
}

void DFS(vector<vector<int>>& isConnected, vector<bool>& isVisited, int kth)
{
	isVisited[kth] = true;
	for (int i = 0; i < isConnected.size(); i++)
	{
		if (isConnected[kth][i] == 1 && !isVisited[i])
		{
			DFS(isConnected, isVisited, i);
		}
	}
}

//LeetCode #547
int findCircleNum(vector<vector<int>>& isConnected)
{
	int n = isConnected.size(), count = 0;
	vector<bool> isVisited(n,false);
	for (int i = 0; i < n; i++)
	{
		if (false == isVisited[i])
		{
			DFS(isConnected, isVisited, i);
			count++;
		}
	}
	return count;
}

//LeetCode #417 
//求解输入数据中，有哪些数据，从当前位置出发，既可以流入大西洋，也可以流入太平洋

void DFS417(const vector<vector<int>>& heights, vector<vector<bool>>& canReach, const int row, const int col)
{
	if (canReach[row][col])
	{
		return;
	}

	canReach[row][col] = true;
	vector<int> direction{ -1,0,1,0,-1 };
	for (int i = 0; i < direction.size() - 1; i++)
	{
		int curRow = row + direction[i];
		int curCol = col + direction[i + 1];
		if (curRow >= 0 && curRow < heights.size()
			&& curCol >= 0 && curCol < heights[curRow].size()
			&& heights[row][col] <= heights[curRow][curCol])
		{
			DFS417(heights, canReach, curRow, curCol);
		}
	}
}

//输入数据是一个m*n的矩阵
vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
	if (heights.empty() || heights.at(0).empty())
	{
		return {};
	}

	int m = heights.size();
	int n = heights.at(0).size();
	vector<vector<bool>> canReachPacific(m,vector<bool>(n,false));
	vector<vector<bool>> canReachAtlantic(m, vector<bool>(n, false));

	for (int i = 0; i < n; i++)
	{
		DFS417(heights, canReachAtlantic, 0, i);
		DFS417(heights, canReachPacific, m-1, i);
	}

	for (int i = 0; i < m; i++)
	{
		DFS417(heights, canReachAtlantic, i, 0);
		DFS417(heights, canReachPacific, i, n - 1);
	}

	vector<vector<int>> ans;
	for (int i = 0; i < m; i++)
	{
		for (int j = 0; j < n; j++)
		{
			if (canReachPacific[i][j] == true
				&& canReachAtlantic[i][j] == true)
			{
				ans.push_back({ i,j });
			}
		}
	}

	return ans;
}

//LeetCode #46
//toFillPos表示，目前要填第几位
void backtrack(vector<int>& nums, int toFillPos, vector<vector<int>>& ans)
{
	if (toFillPos == nums.size() - 1)
	{
		ans.push_back(nums);
	}

	for (int i = toFillPos; i < nums.size(); i++)
	{
		swap(nums[i], nums[toFillPos]);
		backtrack(nums, toFillPos + 1, ans);
		swap(nums[i], nums[toFillPos]);
	}
}

//这个解法实际上是回溯和DFS的组合
vector<vector<int>> permute(vector<int>& nums) 
{
	vector<vector<int>> ans;
	backtrack(nums, 0, ans);
	return ans;
}

void backtrack77(vector<vector<int>>& ans,vector<int>& combine,int n,int k,int pos)
{
	if (combine.size() == k)
	{
		ans.push_back(combine);
		return;
	}

	for (int i = pos; i <= n; i++)
	{
		combine.push_back(i);
		backtrack77(ans, combine, n, k, i+1);
		combine.pop_back();
	}
}

//LeetCode #77
vector<vector<int>> combine(int n, int k) {
	vector<vector<int>> ans;
	vector<int> combine;
	backtrack77(ans, combine, n, k, 1);
	return ans;
}

void backtrack79(int i,int j,int curPos,bool& found, vector<vector<bool>>& isVisited, const vector<vector<char>>& board, const string word)
{
	//越界
	if (i < 0 || i >= board.size() || j < 0 || j >= board[0].size())
	{
		return;
	}

	//找到、已访问
	if (found || isVisited[i][j] || board[i][j] != word[curPos])
	{
		return;
	}

	if (curPos == word.size() - 1)
	{
		found = true;
		return;
	}
	isVisited[i][j] = true;
	
	backtrack79(i+1, j, curPos+1,found, isVisited, board, word);
	backtrack79(i-1, j, curPos + 1, found, isVisited, board, word);
	backtrack79(i, j+1, curPos + 1, found, isVisited, board, word);
	backtrack79(i, j-1, curPos + 1, found, isVisited, board, word);

	isVisited[i][j] = false;
}

//LeetCode #79
//DFS+回溯的写法
bool exist(vector<vector<char>>& board, string word) {
	int row = board.size(), col = board[0].size();
	vector<vector<bool>> isVisited(row, vector<bool>(col, false));

	int curPos = 0;
	bool found = false;

	for (int i = 0; i < row; i++)
	{
		for (int j = 0; j < col; j++)
		{
			backtrack79(i, j, curPos, found, isVisited, board, word);
		}
	}

	return found;
}

void backtrack51(vector<vector<string>>& result, vector<vector<int>>& status,int n,int row)
{
	if (row >= n)
	{
		vector<string> curResult;

		//组合答案
		for (int i = 0; i < n; i++)
		{
			string str(n, '.');
			for (int j = 0; j < n; j++)
			{
				if (status[i][j] == 1)
				{
					str[j] = 'Q';
					curResult.push_back(str);
					break;
				}
			}
		}
		result.push_back(curResult);
		return;
	}

	//在第row行，尝试所有列
	for (int i = 0; i < n; i++)
	{
		bool canPlace = true;
		for (int j = 1; j <=row; j++)
		{
			int curRow = row - j;
			int prevCol = i - j,nextCol = i+j;
			if (curRow >=0)
			{
				if (status[curRow][i] == 1)
				{
					canPlace = false;
					break;
				}
				//左斜
				if (prevCol >= 0) 
				{
					if (status[curRow][prevCol] == 1)
					{
						canPlace = false;
						break;
					}
				}
				//右斜
				if (nextCol >= 0 && nextCol < n)
				{
					if (status[curRow][nextCol] == 1)
					{
						canPlace = false;
						break;
					}
				}
			}
		}
		if (canPlace)
		{
			status[row][i] = 1;
			backtrack51(result,status, n, row + 1);
			status[row][i] = 0;
		}
	}
}

//LeetCode #51
vector<vector<string>> solveNQueens(int n) {
	vector<vector<int>> status(n,vector<int>(n,0));
	vector<vector<string>> result;

	backtrack51(result, status, n, 0);
	return result;
}

void DFS934(vector<vector<int>>& grid, queue<pair<int, int>>& nbrWater,int row,int col)
{
	int m = grid.size(), n = grid[0].size();
	if (row < 0 || col < 0 || row >= m || col >= n)
	{
		return;
	}

	//重复找到之前的岛
	if (grid[row][col] == 2)
	{
		return;
	}
	
	//找到岛改标记
	if (grid[row][col] == 1)
	{
		grid[row][col] = 2;
	}

	//找到相邻水域，无需继续深入
	if (grid[row][col] == 0)
	{
		nbrWater.push({ row,col });
		return;
	}

	//遍历四个方向
	vector<int> direction{ 0,-1,0,1,0 };
	for (int i = 0; i < 4; i++)
	{
		DFS934(grid, nbrWater, row + direction[i], col + direction[i + 1]);
	}
}

//LeetCode #934
int shortestBridge(vector<vector<int>>& grid) {
	int m = grid.size(), n = grid[0].size();

	//相邻水域
	queue<pair<int, int>> nbrWater;
	//遍历第一个岛 并标记相邻水域
	bool found = false;
	for (int i = 0; i < m; i++)
	{
		for (int j = 0; j < n; j++)
		{
			if (grid[i][j] == 1)
			{
				DFS934(grid, nbrWater,i,j);
				found = true;
				break;
			}
		}
		if (found) break;
	}

	int level = 0;
	while (!nbrWater.empty())
	{
		level++;
		int maxSize = nbrWater.size();
		while (maxSize > 0)
		{
			pair<int, int> curWater = nbrWater.front();
			int row = curWater.first, col = curWater.second;

			vector<int> direction{ 0,-1,0,1,0 };
			for (int i = 0; i < 4; i++)
			{
				int curRow = row + direction[i];
				int curCol = col + direction[i + 1];
				//越界
				if (curRow < 0 || curCol < 0 || curRow >= m || curCol >= n)
				{
					continue;
				}
				//找到之前的岛
				if (grid[curRow][curCol] == 2)
				{
					continue;
				}
				//找到第二座岛
				if (grid[curRow][curCol] == 1)
				{
					return level;
				}
				//已经找过，或者已经翻转
				grid[curRow][curCol] = 2;
				nbrWater.push({ curRow,curCol });
			}

			nbrWater.pop();
			maxSize--;
		}
	}

	return level;
}

void DFS126(vector<vector<string>>& ans,vector<string> curPath,vector<bool>& isVisited,const vector<string>& wordList,const string curWord,const string endWord)
{
	if (curWord == endWord)
	{
		ans.push_back(curPath);
		return;
	}

	auto checkMatch = [](string a, string b)->bool {
		if (a.length() != b.length()) return false;
		int num = 0;
		for (int i = 0; i < a.length(); i++)
		{
			if (a[i] != b[i]) num++;
		}
		if (num > 1) return false;
		return true;
	};

	for (int i = 0; i < isVisited.size(); i++)
	{
		if (isVisited[i]) continue;
		if (checkMatch(curWord,wordList[i]))
		{
			isVisited[i] = true;
			curPath.push_back(wordList[i]);
			DFS126(ans, curPath, isVisited, wordList, wordList[i], endWord);
			isVisited[i] = false;
			curPath.pop_back();
		}
	}
}

vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList)
{
	vector<vector<string>> ans;
	vector<vector<string>> fullAns;
	vector<bool> isVisited(wordList.size(), false);

	vector<string> curPath;
	curPath.push_back(beginWord);
	for (int i = 0; i < isVisited.size(); i++)
	{
		if (beginWord == wordList[i])
		{
			isVisited[i] = true;
		}
	}
	DFS126(fullAns, curPath, isVisited, wordList, beginWord, endWord);
	if (!fullAns.empty())
	{
		std::sort(fullAns.begin(), fullAns.end(), [](vector<string> a, vector<string> b) {return a.size() < b.size(); });
		int minLength = fullAns.front().size();
		for (int i = 0; i < fullAns.size(); i++)
		{
			if (fullAns.at(i).size() <= minLength)
			{
				ans.push_back(fullAns.at(i));
			}
		}
	}
	return ans;
}