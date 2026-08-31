#include "Sort.h"

/* 冒泡排序 */
void BubbleSort(vector<int>& nums) {
    // 外循环：未排序区间为 [0, i]
    for (int i = nums.size() - 1; i > 0; i--) {
        // 内循环：将未排序区间 [0, i] 中的最大元素交换至该区间的最右端
        for (int j = 0; j < i; j++) {
            if (nums[j] > nums[j + 1]) {
                // 交换 nums[j] 与 nums[j + 1]
                // 这里使用了 std::swap() 函数
                swap(nums[j], nums[j + 1]);
            }
        }
    }
}

/* 选择排序
* 每次选择一个最大/最小元素
*/
void SelectionSort(vector<int>& nums) {
    int n = nums.size();
    // 外循环：未排序区间为 [i, n-1]
    for (int i = 0; i < n - 1; i++) {
        // 内循环：找到未排序区间内的最小元素
        int k = i;
        for (int j = i + 1; j < n; j++) {
            if (nums[j] < nums[k])
                k = j; // 记录最小元素的索引
        }
        // 将该最小元素与未排序区间的首个元素交换
        swap(nums[i], nums[k]);
    }
}

/* 插入排序
* 将未排序的元素插入到有序的队列种
*/
void InsertionSort(vector<int>& nums) {
    // 外循环：已排序区间为 [0, i-1]
    for (int i = 1; i < nums.size(); i++) {
        int base = nums[i], j = i - 1;
        // 内循环：从已排序队列的尾部开始，大于当前值则往后移动一位，为base挪空间
        while (j >= 0 && nums[j] > base) {
            nums[j + 1] = nums[j]; // 将 nums[j] 向右移动一位
            j--;
        }
        nums[j + 1] = base; // 将 base 赋值到正确位置
    }
}

/*
* 归并排序
*/
void Merge(vector<int>& a, int left, int mid, int right) {
    vector<int> temp;                   //临时数组用于存储排序时的数
    temp.resize(right - left + 1);
    int i = left;                                 //分成两块 i指向左边的数字 j指向右边的数字 
    int j = mid + 1;
    int k = 0;                                    //k用于存储数字到临时数组

    while (i <= mid && j <= right) {
        if (a[i] < a[j])    	                  //永远都是 i 和 j 指向的数进行比较
            temp[k++] = a[i++];                   //谁小，谁就先放到临时数组中
        else
            temp[k++] = a[j++];
    }

    while (i <= mid)                             //如果左边还有数没放上去，就依次放上去
        temp[k++] = a[i++];
    while (j <= right)                           //如果是右边还有同上
        temp[k++] = a[j++];

    for (int m = left, n = 0; m <= right; m++, n++)//读取临时数组中的数
        a[m] = temp[n];
}


void Merge_Sort(vector<int>& a, int left, int right) {
    if (left == right)
        return;

    int mid = (left + right) / 2;
    //递归拆分成较小规模子序列排序 
    Merge_Sort(a, left, mid);
    Merge_Sort(a, mid + 1, right);
    Merge(a, left, mid, right);      //合并较小规模问题解
}

void MergeSort(vector<int>& nums)
{
    Merge_Sort(nums, 0, nums.size() - 1);
}

/* 哨兵划分 */
int partition(vector<int>& nums, int left, int right) {
    // 以 nums[left] 为基准数
    int i = left, j = right;
    while (i < j) {
        while (i < j && nums[j] >= nums[left])
            j--;                // 从右向左找首个小于基准数的元素
        while (i < j && nums[i] <= nums[left])
            i++;                // 从左向右找首个大于基准数的元素
        swap(nums[i], nums[j]); // 交换这两个元素
    }
    swap(nums[i], nums[left]);  // 将基准数交换至两子数组的分界线
    return i;                   // 返回基准数的索引
}


void quickSort(vector<int>& nums, int left, int right) {
    // 子数组长度为 1 时终止递归
    if (left >= right)
        return;
    // 哨兵划分
    int pivot = partition(nums, left, right);
    // 递归左子数组、右子数组
    quickSort(nums, left, pivot - 1);
    quickSort(nums, pivot + 1, right);
}

/* 快速排序 */
void QuickSort(vector<int>& nums)
{
    quickSort(nums, 0, nums.size() - 1);
}

/* 调整以 start 为根的子树为大根堆，[start, end] 为堆的有效区间 */
void HeapAdjust(vector<int>& arr, int start, int end)
{
    //tmp保存父节点的值，start保存父节点应该在的索引
    int tmp = arr[start];
    int i = 2 * start + 1; // start 的左孩子
    while (i <= end)
    {
        // 取左右孩子中较大者
        if (i < end && arr[i] < arr[i + 1])
            i++;
        if (arr[i] > tmp)
        {
            arr[start] = arr[i];
            start = i;
            //找左孩子节点
            i = 2 * i + 1; // 继续向下调整
        }
        else
        {
            break;
        }
    }
    arr[start] = tmp;
}

/* 堆排序（升序，使用大根堆） */
void HeapSort(vector<int>& arr)
{
    int len = arr.size();
    // 从最后一个非叶子结点向上，逐步建立大根堆 
    //(len - 1 - 1) / 2计算的是最后一个元素的父节点
    for (int i = (len - 1 - 1) / 2; i >= 0; i--)
        HeapAdjust(arr, i, len - 1);

    // 反复将堆顶（最大值）交换到末尾，再调整剩余部分
    for (int i = 0; i < len - 1; i++)
    {
        swap(arr[0], arr[len - 1 - i]);
        HeapAdjust(arr, 0, len - 1 - i - 1);
    }
}
