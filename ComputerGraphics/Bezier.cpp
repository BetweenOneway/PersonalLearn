#include "Bezier.h"

/*
* 二阶Bezier曲线（三个控制点）（非插值）
*/
void Bezier2(const Point3D& point1, const Point3D& point2, const Point3D& point3, int numVerts,vector<Point3D>& resultVerts)
{
    float step = 1.0f / numVerts;
    for (int index = 0; index <= numVerts; index++)
    {
        float t = step + index * step;

        resultVerts.push_back( pow(1.0f - t, 2) * point1 + 2.0f * t * (1.0f - t) * point2 + pow(t, 2) * point3);
    }
}
