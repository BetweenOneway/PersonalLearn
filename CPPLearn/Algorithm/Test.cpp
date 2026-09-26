#include <iostream>
using namespace std;

#include "KDTree.h"
#include "Sort.h"
#include "Other.h"

int TestKDTree() {
    // 示例：生成2D随机测试数据
    int dim = 2;  // 维度
    std::vector<Point> group1;
    std::vector<Point> group2;

    // 生成10000个随机点
    for (int i = 0; i < 10000; ++i) {
        std::vector<double> coords(dim);
        for (int j = 0; j < dim; ++j) {
            coords[j] = rand() % 10000 / 100.0;
        }
        group1.emplace_back(coords, i);
    }

    // 生成100个随机点
    for (int i = 0; i < 100; ++i) {
        std::vector<double> coords(dim);
        for (int j = 0; j < dim; ++j) {
            coords[j] = rand() % 10000 / 100.0;
        }
        group2.emplace_back(coords, i);
    }

    // 查找最近点索引
    // 以group1构造KD树，然后用group2在group1中找最近的点
    std::vector<int> nearestIndices = findNearestIndicesWithKDTree(group1, group2);

    // 输出结果（这里只输出前10个作为示例）
    for (int i = 0; i < 10 && i < nearestIndices.size(); ++i) {
        std::cout << "点 " << i << " 的最近点索引: " << nearestIndices[i] << std::endl;
    }

    return 0;
}

int TestQuickSort()
{
    vector<int> toSortNums{ 3,2,1 };
    QuickSort(toSortNums);

    for (auto& num : toSortNums)
    {
        cout << num<<" ";
    }
    return 0;
}

int TestSigleNumber()
{
    vector<int> nums{1,1,1,2,3,3,3};
    cout << OTHER::singleNumber(nums)<<endl;
    return 0;
}
