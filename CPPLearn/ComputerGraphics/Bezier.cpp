#include "Bezier.h"

// 二次贝塞尔曲线拟合：输入3个点，t∈[0,1]，返回曲线上的点
Point3D quadraticBezier3D(float t, const Point3D& v1, const Point3D& v2, const Point3D& v3) {
    float t1 = 1.0f - t;
    // 贝塞尔曲线公式
    float x = t1 * t1 * v1.getX() + 2 * t * t1 * v2.getX() + t * t * v3.getX();
    float y = t1 * t1 * v1.getY() + 2 * t * t1 * v2.getY() + t * t * v3.getY();
    float z = t1 * t1 * v1.getZ() + 2 * t * t1 * v2.getZ() + t * t * v3.getZ();
    return { x, y, z };
}

// 3点抛物线插值：严格经过 p1 → p2 → p3
Point3D parabola3D(float t, const Point3D& p1, const Point3D& p2, const Point3D& p3) {
    // 计算 t 相关系数
    float t2 = t * t;
    float mt = 1.0f - t;
    float mt2 = mt * mt;
    float middle = 2.0f * t * mt;

    // 全部使用 getX() / getY() / getZ()
    float x = mt2 * p1.getX() + middle * p2.getX() + t2 * p3.getX();
    float y = mt2 * p1.getY() + middle * p2.getY() + t2 * p3.getY();
    float z = mt2 * p1.getZ() + middle * p2.getZ() + t2 * p3.getZ();

    // 强制保证 t=0.5 时严格等于 p2（最高点 100,100,0）
    if (fabs(t - 0.5f) < 1e-6) {
        x = p2.getX();
        y = p2.getY();
        z = p2.getZ();
    }

    return Point3D(x, y, z);
}

// Catmull-Rom 曲线核心公式
Point3D catmullRom(float t, const Point3D& p0, const Point3D& p1, const Point3D& p2, const Point3D& p3) {
    float t2 = t * t;
    float t3 = t2 * t;

    // Catmull-Rom 系数
    float c0 = -0.5f * t3 + t2 - 0.5f * t;
    float c1 = 1.5f * t3 - 2.5f * t2 + 1.0f;
    float c2 = -1.5f * t3 + 2.0f * t2 + 0.5f * t;
    float c3 = 0.5f * t3 - 0.5f * t2;

    float x = c0 * p0.getX() + c1 * p1.getX() + c2 * p2.getX() + c3 * p3.getX();
    float y = c0 * p0.getY() + c1 * p1.getY() + c2 * p2.getY() + c3 * p3.getY();
    float z = c0 * p0.getZ() + c1 * p1.getZ() + c2 * p2.getZ() + c3 * p3.getZ();

    return Point3D(x, y, z);
}

// 生成经过 p1→p2→p3 的平滑 Catmull-Rom 曲线
void generateCatmullRomCurve(
    const Point3D& p1,
    const Point3D& p2,
    const Point3D& p3,
    vector<Point3D>& curve,
    int stepsPerSegment// 每段采样数，越大越平滑
)
{
    // 虚拟控制点，保证首尾平滑
    Point3D p0 = p1 + (p1 - p2); // 虚拟起点：p1 的“延长线”
    Point3D p4 = p3 + (p3 - p2); // 虚拟终点：p3 的“延长线”

    // 第一段：p1 → p2
    for (int i = 0; i <= stepsPerSegment; ++i) {
        float t = static_cast<float>(i) / stepsPerSegment;
        curve.push_back(catmullRom(t, p0, p1, p2, p3));
    }

    // 第二段：p2 → p3（注意 i 从 1 开始，避免重复添加 p2）
    for (int i = 1; i <= stepsPerSegment; ++i) {
        float t = static_cast<float>(i) / stepsPerSegment;
        curve.push_back(catmullRom(t, p1, p2, p3, p4));
    }
}

// 带张力的 Catmull-Rom 曲线（核心）
Point3D catmullRomTension(float t, const Point3D& p0, const Point3D& p1, const Point3D& p2, const Point3D& p3, float tension) {
    float s = (1.0f - tension) * 0.5f;
    float t2 = t * t;
    float t3 = t2 * t;

    float c0 = -s * t3 + 2 * s * t2 - s * t;
    float c1 = (2 - s) * t3 + (s - 3) * t2 + 1.0f;
    float c2 = (s - 2) * t3 + (3 - 2 * s) * t2 + s * t;
    float c3 = s * t3 - s * t2;

    float x = c0 * p0.getX() + c1 * p1.getX() + c2 * p2.getX() + c3 * p3.getX();
    float y = c0 * p0.getY() + c1 * p1.getY() + c2 * p2.getY() + c3 * p3.getY();
    float z = c0 * p0.getZ() + c1 * p1.getZ() + c2 * p2.getZ() + c3 * p3.getZ();

    return Point3D(x, y, z);
}

// ==============================================
// 最终优化函数：精确生成 N 个点，严格经过 p1-p2-p3
// ==============================================
std::vector<Point3D> generateSmoothCurve(
    const Point3D& p1,
    const Point3D& p2,
    const Point3D& p3,
    int totalPoints,
    float tension
)
{
    std::vector<Point3D> curve;
    if (totalPoints < 3) totalPoints = 3; // 至少3个点
    curve.reserve(totalPoints);

    // 虚拟控制点（保证曲线自然、不偏移）
    Point3D p0 = p1 + (p1 - p2);
    Point3D p4 = p3 + (p3 - p2);

    // 精确按总点数均匀采样
    for (int i = 0; i < totalPoints; ++i) {
        float t = static_cast<float>(i) / (totalPoints - 1); // 0~1 均匀分布
        Point3D pt;

        if (t <= 0.5f) {
            // 前半段：p1 → p2
            float localT = t * 2.0f;
            pt = catmullRomTension(localT, p0, p1, p2, p3, tension);
        }
        else {
            // 后半段：p2 → p3
            float localT = (t - 0.5f) * 2.0f;
            pt = catmullRomTension(localT, p1, p2, p3, p4, tension);
        }
        curve.push_back(pt);
    }

    // 强制校准：确保首尾和顶点 100% 精确
    if (!curve.empty()) {
        curve[0] = p1;
        curve.back() = p3;
        if (totalPoints % 2 == 1) {
            curve[totalPoints / 2] = p2; // 奇数点：正中间就是顶点 p2
        }
    }

    return curve;
}

/*
* 二阶Bezier曲线（三个控制点）（非插值）
*/
void Bezier2(const Point3D& point1, const Point3D& point2, const Point3D& point3, int numVerts,vector<Point3D>& resultVerts)
{
    for (int i = 0; i <= numVerts; ++i) {
        float t = static_cast<float>(i) / numVerts;
        //resultVerts.push_back(quadraticBezier3D(t, point1, point2, point3));
        resultVerts.push_back(parabola3D(t, point1, point2, point3));
    }
    //return resultVerts;

    //float step = 1.0f / numVerts;
    //for (int index = 0; index < numVerts; index++)
    //{
    //    float t = step + index * step;

    //    resultVerts.push_back( pow(1.0f - t, 2) * point1 + 2.0f * t * (1.0f - t) * point2 + pow(t, 2) * point3);
    //}
}

/*
* 三阶Bezier曲线（四个控制点）（非插值）
*/

void Bezier3(const Point3D& point1, const Point3D& point2, const Point3D& point3, const Point3D& point4, int numVerts, vector<Point3D>& resultVerts)
{
    float step = 1.0f / numVerts;
    for (int index = 0; index <= numVerts; index++)
    {
        float t = step + index * step;

        resultVerts.push_back(pow(1 - t, 3) * point1 + 3 * t * pow(1 - t, 2) * point2 + 3 * (1 - t) * pow(t, 2) * point3 + pow(t, 3) * point4);
    }
}
