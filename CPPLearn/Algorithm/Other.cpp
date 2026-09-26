#include "Other.h"

namespace OTHER {
    /*
    * 在 n 个数中，其中一个数出现 1 次，其余都出现 3 次。不用额外哈希，用 O(n)时间和 O(1)空间找出那个数。值范围 32 位整数
    * 追问：出现2次怎么办，有没有更好的方法
    */
    int singleNumber(vector<int>& nums) {
        // ones：bit出现次数 %3 ==1；twos：bit出现次数%3 ==2
        int ones = 0, twos = 0;
        for (int num : nums) {
            // 1. 如果这一位之前已经是1次(ones该位=1)，现在又遇到num该位=1
            // → 次数从1 → 2，把twos对应bit置1
            twos |= ones & num;

            // 2. 异或：遇到1就翻转。
            // 次数0→1：ones置1；次数1→2：ones置0；次数2→3：ones置1
            ones ^= num;

            // 3、4、5步实现对3取余
            // 3. 当 ones 和 twos 的同一位同时为1，代表该位计数达到3（不可能出现的非法状态11）
            // mask就是用来清除这种非法bit
            int mask = ~(ones & twos);

            // 4. 把ones里那些同时在twos为1的bit清0（消除状态11）
            ones &= mask;

            // 5. 同样清除twos里非法的bit，状态11全部置0，回到00，完成模3清零
            twos &= mask;
        }
        return ones;
    }
}
