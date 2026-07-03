#include <iostream>
using namespace std;
#include "Oper3DFile.h"
#include "MeshDefined.h"
#include "Mesh.h"
#include "testMesh.h"

// ====================================================================
// TriangulateCap — 耳切法（Ear Clipping）封口三角化
// ====================================================================
void TriangulateCap(
    const std::vector<VFVECTOR3>& contour,
    unsigned baseIndex,
    bool reverseWinding,
    std::vector<VNVECTOR3UI>& outTriangles)
{
    int n = (int)contour.size();
    if (n < 3)
        return;

    // --- 1. 计算轮廓所在平面（Newell 方法） ---
    VFVECTOR3 normal(0.0f, 0.0f, 0.0f);
    for (int i = 0; i < n; i++)
    {
        const VFVECTOR3& curr = contour[i];
        const VFVECTOR3& next = contour[(i + 1) % n];
        normal.x += (curr.y - next.y) * (curr.z + next.z);
        normal.y += (curr.z - next.z) * (curr.x + next.x);
        normal.z += (curr.x - next.x) * (curr.y + next.y);
    }
    normal.Normalize();

    // --- 2. 选投影轴（丢弃法线分量最大的轴，保留两个分量做 2D 坐标）---
    int dropAxis = 0; // 0=X, 1=Y, 2=Z
    float ax = std::abs(normal.x);
    float ay = std::abs(normal.y);
    float az = std::abs(normal.z);
    if (ay > ax && ay > az)
        dropAxis = 1;
    else if (az > ax)
        dropAxis = 2;

    int uAxis = (dropAxis == 0) ? 1 : 0;
    int vAxis = (dropAxis <= 1) ? 2 : 1;

    // 投影到 2D
    std::vector<VFVector2> poly2D(n);
    for (int i = 0; i < n; i++)
    {
        poly2D[i].x = contour[i][uAxis];
        poly2D[i].y = contour[i][vAxis];
    }

    // --- 3. 判断 2D 多边形绕序 ---
    float signedArea = 0.0f;
    for (int i = 0; i < n; i++)
    {
        const VFVector2& a = poly2D[i];
        const VFVector2& b = poly2D[(i + 1) % n];
        signedArea += a.x * b.y - b.x * a.y;
    }
    bool isCCW = (signedArea > 0.0f);
    // convexSign: 对于 CCW 多边形，凸内角 cross > 0；对于 CW 多边形，凸内角 cross < 0
    float convexSign = isCCW ? 1.0f : -1.0f;

    // --- 4. 耳切法主循环 ---
    // 剩余顶点索引链表
    std::vector<int> indices(n);
    for (int i = 0; i < n; i++)
        indices[i] = i;

    // 辅助：判断点 p 是否在三角形 (a,b,c) 内部（2D，含边界）
    auto PointInTriangle = [](const VFVector2& p, const VFVector2& a,
        const VFVector2& b, const VFVector2& c) -> bool
    {
        // 用三边同侧法
        auto Cross2 = [](const VFVector2& v1, const VFVector2& v2) -> float {
            return v1.x * v2.y - v1.y * v2.x;
        };

        VFVector2 ab(b.x - a.x, b.y - a.y);
        VFVector2 bc(c.x - b.x, c.y - b.y);
        VFVector2 ca(a.x - c.x, a.y - c.y);

        VFVector2 ap(p.x - a.x, p.y - a.y);
        VFVector2 bp(p.x - b.x, p.y - b.y);
        VFVector2 cp(p.x - c.x, p.y - c.y);

        float c1 = Cross2(ab, ap);
        float c2 = Cross2(bc, bp);
        float c3 = Cross2(ca, cp);

        // 如果 p 在三角形内部（或边上），三个 cross 同号或为 0
        return (c1 >= 0.0f && c2 >= 0.0f && c3 >= 0.0f) ||
            (c1 <= 0.0f && c2 <= 0.0f && c3 <= 0.0f);
    };

    while (indices.size() > 3)
    {
        int size = (int)indices.size();
        bool earFound = false;

        for (int i = 0; i < size; i++)
        {
            int prev = indices[(i - 1 + size) % size];
            int curr = indices[i];
            int next = indices[(i + 1) % size];

            const VFVector2& a = poly2D[prev];
            const VFVector2& b = poly2D[curr];
            const VFVector2& c = poly2D[next];

            // 判断是否为凸顶点（非反射角）
            float cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
            if (cross * convexSign < 0.0f)
                continue; // 反射角，不可能是耳

            // 检查三角形内是否包含其他顶点
            bool isEar = true;
            for (int j = 0; j < size; j++)
            {
                int pIdx = indices[j];
                if (pIdx == prev || pIdx == curr || pIdx == next)
                    continue;

                if (PointInTriangle(poly2D[pIdx], a, b, c))
                {
                    isEar = false;
                    break;
                }
            }

            if (isEar)
            {
                // 找到耳，输出三角形
                if (reverseWinding)
                    outTriangles.push_back(VNVECTOR3UI(
                        baseIndex + (unsigned)curr,
                        baseIndex + (unsigned)prev,
                        baseIndex + (unsigned)next));
                else
                    outTriangles.push_back(VNVECTOR3UI(
                        baseIndex + (unsigned)prev,
                        baseIndex + (unsigned)curr,
                        baseIndex + (unsigned)next));

                // 移除当前顶点
                indices.erase(indices.begin() + i);
                earFound = true;
                break;
            }
        }

        if (!earFound)
            break; // 退化多边形，终止
    }

    // --- 5. 最后三个顶点 ---
    if (indices.size() == 3)
    {
        if (reverseWinding)
            outTriangles.push_back(VNVECTOR3UI(
                baseIndex + (unsigned)indices[1],
                baseIndex + (unsigned)indices[0],
                baseIndex + (unsigned)indices[2]));
        else
            outTriangles.push_back(VNVECTOR3UI(
                baseIndex + (unsigned)indices[0],
                baseIndex + (unsigned)indices[1],
                baseIndex + (unsigned)indices[2]));
    }
}

// ====================================================================
    // BuildClosedMeshFromTwoContours
    // 用上下两条轮廓构建封闭网格，支持任意多边形（凸/凹）
    // ====================================================================
bool BuildClosedMeshFromTwoContours(
    const std::vector<Vector3>& upper,
    const std::vector<Vector3>& lower,
    Mesh& outMesh)
{
    //int n = (int)upper.size();
    //if (n < 3 || (int)lower.size() != n)
    //    return false;

    //outMesh.Clear();

    //// 1. 合并顶点：upper[0..n-1], lower[n..2n-1]
    //outMesh.GetVertices().reserve(2 * n);
    //for (int i = 0; i < n; i++)
    //    outMesh.GetVertices().push_back(upper[i]);
    //for (int i = 0; i < n; i++)
    //    outMesh.GetVertices().push_back(lower[i]);

    //// 2. 侧面三角形带（最短对角线法）
    //outMesh.GetSurfs().reserve(2 * n + 2 * (n - 2)); // 侧面 + 顶底封口
    //for (int i = 0; i < n; i++)
    //{
    //    unsigned u0 = (unsigned)i;
    //    unsigned u1 = (unsigned)((i + 1) % n);
    //    unsigned l0 = (unsigned)(n + i);
    //    unsigned l1 = (unsigned)(n + (i + 1) % n);

    //    // 比较两条对角线，选较短的方向剖分四边形
    //    double diag1 = outMesh.GetVertices()[u0].distance(outMesh.GetVertices()[l1]); // u0 -> l1
    //    double diag2 = outMesh.GetVertices()[u1].Distance(outMesh.GetVertices()[l0]); // u1 -> l0

    //    if (diag1 < diag2)
    //    {
    //        outMesh.GetSurfs().push_back(VNVECTOR3UI(u0, l0, u1));
    //        outMesh.GetSurfs().push_back(VNVECTOR3UI(u1, l0, l1));
    //    }
    //    else
    //    {
    //        outMesh.GetSurfs().push_back(VNVECTOR3UI(u0, l0, l1));
    //        outMesh.GetSurfs().push_back(VNVECTOR3UI(u0, l1, u1));
    //    }
    //}

    //// 3. 顶面封口（upper 轮廓，baseIndex = 0，法线方向正常）
    //TriangulateCap(upper, 0, false, outMesh.GetSurfs());

    //// 4. 底面封口（lower 轮廓，baseIndex = n，翻转绕序以保持法线一致）
    //TriangulateCap(lower, (unsigned)n, true, outMesh.GetSurfs());

    return true;
}

void testConstructMesh()
{
    std::vector<VFVECTOR3> upperVerts;
    std::vector<VFVECTOR3> lowerVerts;

    //Mesh outMesh;

    //BuildClosedMeshFromTwoContours(upperVerts,lowerVerts,outMesh);
    
}
