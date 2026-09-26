#include <vector>
#include <unordered_map>
#include <iostream>
#include <algorithm>
#include <numeric>
using namespace std;

//LeetCode 605
bool canPlaceFlowers(vector<int>& flowerbed, int n) {
    int end = flowerbed.size();
    int curPos = 0;
    int planted = 0;
    while (curPos < end && planted != n)
    {
        if (flowerbed[curPos] == 1)
        {
            //当前位置已经有花
            curPos = curPos + 2;
        }
        else
        {
            if (curPos == end - 1)
            {
                //当前位置为最后一个位置，直接种花，无需判断后续
                planted = planted + 1;
                curPos = curPos + 1;
            }
            else {
                curPos = curPos + 1;
                if (curPos < end && flowerbed[curPos] != 1)
                {
                    //当前位置无花，且下一个位置也无花，可以种植
                    curPos = curPos + 1;
                    planted = planted + 1;
                }
                else {
                    //当前位置无花，但下一个位置有花，无法种植
                    curPos = curPos + 1 + 1;
                }
            }
        }
    }
    return planted == n ? true : false;
}

void TestCanPlaceFlowers()
{
    vector<int> flowerBed = {1, 0, 0, 0, 1, 0, 0};
    int num = 2;
    cout << boolalpha << canPlaceFlowers(flowerBed, num)<<endl;
}

//LeetCode 452
int findMinArrowShots(vector<vector<int>>& points) {
    if (points.empty()) {
        return 0;
    }
    //按右边界从小到大排序
    sort(points.begin(), points.end(), [](const vector<int>& u, const vector<int>& v) {
        return u[1] < v[1];
        });
    int pos = points[0][1];
    int ans = 1;
    for (const vector<int>& balloon : points) {
        //如果当前球的左边界超过了上一个球的右边界，表示需要新的箭
        if (balloon[0] > pos) {
            pos = balloon[1];
            ++ans;
        }
    }
    return ans;
}

void TestFindArrowShots()
{
    vector<vector<int>> ballons = { {10, 16} ,{2, 8},{1, 6},{7, 12 }};

    cout<<findMinArrowShots(ballons)<<endl;
}

//LeetCode 763
vector<int> partitionLabels1(string s) {
    vector<int> result;
    unordered_map<char, pair<int, int>> charRange;
    // 初始化所有字符，first和second先设为-1
    for (auto& c : s) {
        charRange[c] = { -1,-1 };
    }

    for (int i = 0; i < s.length(); i++) {
        auto& p = charRange[s[i]];
        if (p.first == -1) {
            p.first = i;
        }
        p.second = i; // 每次都更新结尾，不用else
    }

    int start = 0;
    int end = 0;
    // 遍历原字符串，不是遍历map！
    for (int i = 0; i < s.size(); ++i) {
        end = max(end, charRange[s[i]].second);
        if (i == end) {
            result.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}
//更简洁的写法
vector<int> partitionLabels(string s) {
    vector<int> last(26);
    // 记录每个字符最后出现位置
    for (int i = 0; i < s.size(); i++) {
        last[s[i] - 'a'] = i;
    }
    vector<int> res;
    int start = 0, end = 0;
    for (int i = 0; i < s.size(); i++) {
        end = max(end, last[s[i] - 'a']);
        if (i == end) {
            res.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return res;
}

void TestPartitionLabels()
{
    string s("ababcbacadefegdehijhklij");
    std::vector<int> correctResult1{ 9,7,8 };
    std::vector<int> result = partitionLabels(s);

    if (result == correctResult1)
    {
        std::cout << "Correct Case 1!" << std::endl;
    }

    s = "eccbbbbdec";
    std::vector<int> correctResult2{ 10 };
    result = partitionLabels(s);

    if (result == correctResult2)
    {
        std::cout << "Correct Case 1!" << std::endl;
    }
}