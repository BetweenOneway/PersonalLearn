#include "Graph.h"
#include <iostream>
using namespace std;

// 栈迭代版 DFS
void dfsIterative(int start, vector<vector<int>>& adj, vector<bool>& visited)
{
    stack<int> st;
    st.push(start);

    while (!st.empty())
    {
        int node = st.top();
        st.pop();

        if (visited[node]) continue;
        visited[node] = true;
        cout << node << " ";

        // 逆序压栈，保证遍历顺序和递归版一致(可选)
        for (auto it = adj[node].rbegin(); it != adj[node].rend(); ++it)
        {
            if (!visited[*it])
            {
                st.push(*it);
            }
        }
    }
}

// 队列 BFS
void bfs(int start, vector<vector<int>>& adj, vector<bool>& visited)
{
    queue<int> q;
    q.push(start);
    visited[start] = true;

    while (!q.empty())
    {
        int node = q.front();
        q.pop();
        cout << node << " ";

        for (int neighbor : adj[node])
        {
            if (!visited[neighbor])
            {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}

/*
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
