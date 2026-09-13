#pragma once
#include <vector>
using namespace std;

struct Point {
    //依次对应 X轴,Y轴,Z轴......
    std::vector<double> coords;
    int index;  // 保存原始索引

    Point(const std::vector<double>& c, int idx) : coords(c), index(idx) {}
};

// KD树节点
struct Node {
    Point point;
    Node* left;
    Node* right;
    int axis;  // 分割轴

    Node(const Point& p, int a) : point(p), left(nullptr), right(nullptr), axis(a) {}
};

std::vector<int> findNearestIndicesWithKDTree(std::vector<Point>& group1,
                                             const std::vector<Point>& group2);
