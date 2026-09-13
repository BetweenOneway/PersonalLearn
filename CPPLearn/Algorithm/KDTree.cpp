#include "KDTree.h"
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <limits>
#include <queue>

// 计算两点之间的平方距离
double squaredDistance(const Point& a, const Point& b) {
    double dist = 0.0;
    for (size_t i = 0; i < a.coords.size(); ++i) {
        double diff = a.coords[i] - b.coords[i];
        dist += diff * diff;
    }
    return dist;
}

// 构建KD树
Node* buildKDTree(std::vector<Point>& points, int depth) {
    if (points.empty()) return nullptr;

    int k = points[0].coords.size();  // 维度
    int axis = depth % k;             // 选择分割轴

    // 按当前轴排序
    std::sort(points.begin(), points.end(),
              [axis](const Point& a, const Point& b) {
                  return a.coords[axis] < b.coords[axis];
              });

    // 选择中位数作为节点
    size_t median = points.size() / 2;
    Node* node = new Node(points[median], axis);

    // 递归构建左右子树
    std::vector<Point> leftPoints(points.begin(), points.begin() + median);
    std::vector<Point> rightPoints(points.begin() + median + 1, points.end());

    node->left = buildKDTree(leftPoints, depth + 1);
    node->right = buildKDTree(rightPoints, depth + 1);

    return node;
}

// 最近邻搜索
void nearestNeighborSearch(Node* node, const Point& target,
                          Point& bestPoint, double& bestDist) {
    if (node == nullptr) return;

    // 计算点距离 更新当前最佳点
    double dist = squaredDistance(node->point, target);
    if (dist < bestDist) {
        bestDist = dist;
        bestPoint = node->point;
    }

    // 确定搜索方向
    Node* nearSubtree = nullptr;
    Node* farSubtree = nullptr;

    if (target.coords[node->axis] < node->point.coords[node->axis]) {
        nearSubtree = node->left;
        farSubtree = node->right;
    }
    else {
        nearSubtree = node->right;
        farSubtree = node->left;
    }

    // 先搜索近侧子树
    nearestNeighborSearch(nearSubtree, target, bestPoint, bestDist);

    // 检查是否需要搜索远侧子树
    double axisDist = target.coords[node->axis] - node->point.coords[node->axis];
    if (axisDist * axisDist < bestDist) {
        nearestNeighborSearch(farSubtree, target, bestPoint, bestDist);
    }
}

// 查找最近点索引
std::vector<int> findNearestIndicesWithKDTree(std::vector<Point>& group1,
                                             const std::vector<Point>& group2) {
    std::vector<int> result;
    result.reserve(group2.size());

    // 构建KD树
    Node* root = buildKDTree(group1, 0);

    // 为每个目标点查找最近邻
    for (const auto& target : group2) {
        Point bestPoint(target.coords, -1);
        double bestDist = std::numeric_limits<double>::max();

        nearestNeighborSearch(root, target, bestPoint, bestDist);
        result.push_back(bestPoint.index);
    }

    // 释放KD树内存（实际应用中需要实现）
    // ...

    return result;
}


