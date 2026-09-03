#include "Graph.h"
#include <iostream>
#include <stack>
#include <queue>

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
