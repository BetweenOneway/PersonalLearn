#include <vector>
#include <iostream>
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