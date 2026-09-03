#include "TwoPointers.h"
/*
* 给定一个链表，如果有环路，找出环路的开始点。
*/
ListNode* detectCycle(ListNode* head) {
	ListNode* slow = head, * fast = head;
	// 判断是否存在环路
	do {
		if (!fast || !fast->next) return nullptr;
		fast = fast->next->next;
		slow = slow->next;
	} while (fast != slow);
	// 如果存在，查找环路节点
	fast = head;
	while (fast != slow) {
		slow = slow->next;
		fast = fast->next;
	}
	return fast;
}

/*
* 给定两个字符串 S 和 T，求 S 中包含 T 所有字符的最短连续子字符串的长度，同时要求时间复杂度不得超过 O(n)
*/
string minWindow(string S, string T) {
	vector<int> chars(128, 0);
	vector<bool> flag(128, false);
	// 先统计T中的字符情况
	for (int i = 0; i < T.size(); ++i) {
		flag[T[i]] = true;
		++chars[T[i]];
	}

	// 移动滑动窗口，不断更改统计数据
	int cnt = 0, l = 0, min_l = 0, min_size = S.size() + 1;
	for (int r = 0; r < S.size(); ++r) {
		if (flag[S[r]]) {
			if (--chars[S[r]] >= 0) {
				++cnt;
			}
			// 若目前滑动窗口已包含T中全部字符，
			// 则尝试将l右移，在不影响结果的情况下获得最短子字符串
			while (cnt == T.size()) {
				//计算目前字符个数，如果比之前少，就更新边界
				if (r - l + 1 < min_size) {
					min_l = l;
					min_size = r - l + 1;
				}
				//移动左边界，移动之前判断左边界字符是否是T内的字符，如果是则更新之前字符串内数量
				if (flag[S[l]] && ++chars[S[l]] > 0) {
					--cnt;
				}
				++l;
			}
		}
	}
	return min_size > S.size() ? "" : S.substr(min_l, min_size);
}