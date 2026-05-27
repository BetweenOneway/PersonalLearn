#pragma once
#include "Point.h"
#include <vector>
using namespace std;
void Bezier2(const Point3D& point1, const Point3D& point2, const Point3D& point3, int numVerts, vector<Point3D>& resultVerts);
void Bezier3(const Point3D& point1, const Point3D& point2, const Point3D& point3, const Point3D& point4, int numVerts, vector<Point3D>& resultVerts);
void generateCatmullRomCurve(
    const Point3D& p1,
    const Point3D& p2,
    const Point3D& p3,
    vector<Point3D>& curve,
    int stepsPerSegment = 50  // 每段采样数，越大越平滑
);

std::vector<Point3D> generateSmoothCurve(
    const Point3D& p1,
    const Point3D& p2,
    const Point3D& p3,
    int totalPoints,       // 你想要的总点数（13/20/100 都行）
    float tension = 0.0f   // 张力 0~1，0最弯，1最直
);
