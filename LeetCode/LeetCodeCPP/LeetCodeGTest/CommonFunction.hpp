#pragma once
#include <vector>
using namespace std;

template<typename T1>
void CheckResult(vector<vector<T1>>& expectResult, vector<vector<T1>>& actualResult) {
	EXPECT_EQ(actualResult.size(), expectResult.size());

	for (int i = 0; i < expectResult.size(); i++)
	{
		EXPECT_NE(std::find(actualResult.begin(), actualResult.end(), expectResult.at(i)), actualResult.end());
	}
}