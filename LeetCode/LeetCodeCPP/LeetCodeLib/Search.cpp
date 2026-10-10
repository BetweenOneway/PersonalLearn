#include "Search.h"

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