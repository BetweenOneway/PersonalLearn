#include "Graph.h"

/*
* 785
* 对图中节点染色，相邻点颜色不同，只用两种颜色即可的图称为二分图
* 给定一个图，判断其是否可以二分
*/
bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    if (n == 0) {
        return true;
    }
    vector<int> color(n, 0);
    queue<int> q;
    for (int i = 0; i < n; ++i) {
        if (!color[i]) {
            q.push(i);
            color[i] = 1;
        }
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            for (const int& j : graph[node]) {
                if (color[j] == 0) {
                    q.push(j);
                    color[j] = color[node] == 2 ? 1 : 2;
                }
                else if (color[node] == color[j]) {
                    return false;
                }
            }
        }
    }
    return true;
}