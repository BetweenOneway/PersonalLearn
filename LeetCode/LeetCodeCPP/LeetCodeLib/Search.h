#pragma once
#include <vector>
#include <string>
using namespace std;

//LeetCode #695
int maxAreaOfIsland(vector<vector<int>>& grid);

//LeetCode #547
int findCircleNum(vector<vector<int>>& isConnected);

//LeetCode #417
vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights);

//LeetCode #46
vector<vector<int>> permute(vector<int>& nums);

//LeetCode #77
vector<vector<int>> combine(int n, int k);

//LeetCode #79
bool exist(vector<vector<char>>& board, string word);

//
vector<vector<string>> solveNQueens(int n);

//LeetCode #934
int shortestBridge(vector<vector<int>>& grid);

//LeetCode #126
vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList);

// LeetCode #130
void solve(vector<vector<char>>& board);

/*
* Definition for a binary tree node.
*/
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

//LeetCode #257
vector<string> binaryTreePaths(TreeNode* root);

//LeetCode #47
vector<vector<int>> permuteUnique(vector<int>& nums);

//LeetCode #40
vector<vector<int>> combinationSum2(vector<int>& candidates, int target);

//LeetCode #37
/*
* 数独的解法需 遵循如下规则：
数字 1-9 在每一行只能出现一次。
数字 1-9 在每一列只能出现一次。
数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）
数独部分空格内已填入了数字，空白格用 '.' 表示。
*/
void solveSudoku(vector<vector<char>>& board);