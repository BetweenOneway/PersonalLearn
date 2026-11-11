#include "gtest/gtest.h"
#include "Search.h"

TEST(Search, LeetCode695)
{
	vector<vector<int>> inputNums =
	  { {1, 0, 1, 1, 0, 1, 0, 1} ,
		{1, 0, 1, 1, 0, 1, 1, 1},
		{0, 0, 0, 0, 0, 0, 0, 1} };
	int expectResult = 6;

	EXPECT_EQ(expectResult, maxAreaOfIsland(inputNums));
}

TEST(Search, LeetCode547)
{
	vector<vector<int>> inputNums =
	{
		{1, 1, 0},
		{1, 1, 0},
		{0, 0, 1}
	};
	int expectResult = 2;

	EXPECT_EQ(expectResult, findCircleNum(inputNums));

	inputNums =
	{
		{1, 0, 0},
		{0, 1, 0},
		{0, 0, 1} 
	};
	expectResult = 3;

	EXPECT_EQ(expectResult, findCircleNum(inputNums));
}

TEST(Search, LeetCode417)
{
	vector<vector<int>> heights{ 
		{1, 2, 2, 3, 5},
		{3, 2, 3, 4, 4},
		{2, 4, 5, 3, 1},
		{6, 7, 1, 4, 5},
		{5, 1, 1, 2, 4} };
	vector<vector<int>> expectResult{ {0, 4} ,{1, 3},{1, 4},{2, 2},{3, 0},{3, 1},{4, 0} };
	EXPECT_EQ(expectResult, pacificAtlantic(heights));

	heights={{2,1} ,{1,2} };
	expectResult = { {0,0} ,{0,1},{1,0},{1,1} };
	EXPECT_EQ(expectResult, pacificAtlantic(heights));
}

TEST(Search, LeetCode46)
{
	auto checkResult = [](vector<vector<int>>& expectResult, vector<vector<int>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	vector<int> nums = { 1, 2, 3 };
	vector<vector<int>> expectResult = { {1, 2, 3} ,{1, 3, 2},{2, 1, 3},{2, 3, 1},{3, 1, 2},{3, 2, 1} };
	vector<vector<int>> actualResult = permute(nums);
	
	checkResult(expectResult, actualResult);

	nums = { 0, 1 };
	expectResult = { {0, 1} ,{1, 0} };
	actualResult = permute(nums);

	checkResult(expectResult, actualResult);

	nums = { 1 };
	expectResult = { {1} };
	actualResult = permute(nums);
	
	checkResult(expectResult, actualResult);
}

TEST(Search, LeetCode77)
{
	auto checkResult = [](vector<vector<int>>& expectResult, vector<vector<int>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	int n = 4, k = 2;
	vector<vector<int>> expectResult = {
		{2, 4},{3, 4},{2, 3},{1, 2},{1, 3},{1, 4},
	};
	vector<vector<int>> actualResult = combine(n,k);

	checkResult(expectResult, actualResult);

	n = 1, k = 1;
	expectResult = {
		{1}
	};

	actualResult = combine(n, k);

	checkResult(expectResult, actualResult);
}

TEST(Search, LeetCode79)
{
	vector<vector<char>> board = { 
		{'A', 'B', 'C', 'E'} ,
		{'S', 'F', 'C', 'S'},
		{'A', 'D', 'E', 'E'} 
	};

	string word = "ABCCED";

	EXPECT_TRUE(exist(board, word));

	board = { 
		{'A', 'B', 'C', 'E'} ,
		{'S', 'F', 'C', 'S'},
		{'A', 'D', 'E', 'E'} 
	};
	word = "SEE";
	
	EXPECT_TRUE(exist(board, word));

	board = { 
		{'A', 'B', 'C', 'E'} ,
		{'S', 'F', 'C', 'S'},
		{'A', 'D', 'E', 'E'} 
	};
	word = "ABCB";
	EXPECT_FALSE(exist(board, word));
}

TEST(Search, LeetCode51)
{
	int n = 4;
	vector<vector<string>> expectResult = { 
		{".Q..", "...Q", "Q...", "..Q."} ,
		{"..Q.", "Q...", "...Q", ".Q.."} 
	};

	vector<vector<string>> actualResult = solveNQueens(n);
	EXPECT_EQ(expectResult, actualResult);

	n = 1;
	expectResult = { {"Q"} };

	actualResult = solveNQueens(n);
	EXPECT_EQ(expectResult, actualResult);
}

TEST(Search, LeetCode934)
{
	vector<vector<int>> grid = { 
		{0, 1} ,
		{1, 0} 
	};
	int expectResult = 1;
	EXPECT_EQ(expectResult, shortestBridge(grid));

	grid = { 
		{0, 1, 0},
		{0, 0, 0},
		{0, 0, 1} 
	};
	expectResult = 2;
	EXPECT_EQ(expectResult, shortestBridge(grid));

	grid = { 
		{1, 1, 1, 1, 1},
		{1, 0, 0, 0, 1},
		{1, 0, 1, 0, 1},
		{1, 0, 0, 0, 1},
		{1, 1, 1, 1, 1} 
	};
	expectResult = 1;
	EXPECT_EQ(expectResult, shortestBridge(grid));
}

TEST(Search, LeetCode126)
{
	auto checkResult = [](vector<vector<string>>& expectResult, vector<vector<string>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	string beginWord = "hit", endWord = "cog";
	vector<string> wordList = { "hot", "dot", "dog", "lot", "log", "cog" };

	vector<vector<string>> expectResult = {
		{"hit", "hot", "dot", "dog", "cog"} ,
		{"hit", "hot", "lot", "log", "cog"}
	};

	vector<vector<string>> actualResult = findLadders(beginWord, endWord, wordList);
	checkResult(expectResult, actualResult);

	beginWord = "hit";
	endWord = "cog";
	wordList = { "hot", "dot", "dog", "lot", "log" };
	expectResult.clear();

	actualResult = findLadders(beginWord, endWord, wordList);
	checkResult(expectResult, actualResult);
}

TEST(Search, LeetCode130)
{
	vector<vector<char>> board = { 
		{'X', 'X', 'X', 'X'} ,
		{'X', 'O', 'O', 'X'},
		{'X', 'X', 'O', 'X'},
		{'X', 'O', 'X', 'X'} };

	vector<vector<char>> expectResult = { 
		{'X', 'X', 'X', 'X'} ,
		{'X', 'X', 'X', 'X'},
		{'X', 'X', 'X', 'X'},
		{'X', 'O', 'X', 'X'} };

	vector<vector<char>> actualResult = board;
	solve(actualResult);

	EXPECT_EQ(expectResult, actualResult);
	
	board = { {'X'} };
	expectResult = { {'X' }};
	actualResult = board;
	solve(actualResult);
	
	EXPECT_EQ(expectResult, actualResult);
}

TEST(Search, LeetCode257)
{
	auto buildBinaryTree = [](const vector<int>& vals)->TreeNode* {
		if (vals.empty()) return nullptr;

		vector<TreeNode*> nodeArr;
		nodeArr.resize(vals.size());

		for (size_t i = 0; i < vals.size(); i++)
		{
			if (-1 == vals[i])
			{
				nodeArr[i] = nullptr;
			}
			else
			{
				nodeArr[i] = new TreeNode(vals[i]);
			}
			if (i != 0)
			{

				size_t parentIndex = (i - 1) / 2;
				if (nodeArr[parentIndex] == nullptr)
					continue;
				size_t leftChildIndex = 2 * parentIndex + 1;
				size_t rightChildIndex = 2 * parentIndex + 2;
				if (leftChildIndex == i)
				{
					nodeArr[parentIndex]->left = nodeArr[i];
				}
				else if (rightChildIndex == i)
				{
					nodeArr[parentIndex]->right = nodeArr[i];
				}
			}
		}

		return nodeArr[0];
	};

	// 递归释放二叉树（lambda无法自调用）（C++14泛型lambda，C++11不能用这个递归lambda）
	auto freeTree = [](auto&& self, TreeNode* node) -> void {
		if (!node) return;
		self(self, node->left);
		self(self, node->right);
		delete node;
	};

	//这里的-1表示null
	vector<int> vals = { 1, 2, 3, -1, 5 };

	TreeNode* root = buildBinaryTree(vals);

	vector<string> expectResult = { "1->2->5", "1->3" };
	vector<string> actualResult = binaryTreePaths(root);
	EXPECT_EQ(expectResult, actualResult);
	freeTree(freeTree,root);
	root = nullptr;

	vals = { 1};
	root = buildBinaryTree(vals);
	expectResult = { "1" };
	actualResult = binaryTreePaths(root);
	EXPECT_EQ(expectResult, actualResult);
	freeTree(freeTree, root);
	root = nullptr;
}

TEST(Search, LeetCode47)
{
	auto checkResult = [](vector<vector<int>>& expectResult, vector<vector<int>>& actualResult) {
		EXPECT_EQ(actualResult.size(), expectResult.size());

		for (int i = 0; i < expectResult.size(); i++)
		{
			EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
		}
	};

	vector<int> nums = {1, 1, 2};
	vector<vector<int>> expectResult = { 
		{1, 1, 2} ,
		{1, 2, 1},
		{2, 1, 1} };

	vector<vector<int>> actualResult = permuteUnique(nums);
	checkResult(expectResult, actualResult);

	nums = { 1, 2, 3 };
	expectResult = { {1,2,3} ,{1,3,2},{2,1,3},{2,3,1},{3,1,2},{3,2,1} };
	actualResult = permuteUnique(nums);
	checkResult(expectResult, actualResult);
}