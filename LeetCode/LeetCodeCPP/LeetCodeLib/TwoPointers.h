#pragma once
#include <string>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* detectCycle(ListNode* head);
string minWindow(string S, string T);

int mySqrt(int x);

vector<int> searchRange(const vector<int>& nums, const int target);