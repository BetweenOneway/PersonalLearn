#pragma once
#include "Point.h"
#include <vector>
using namespace std;
void Bezier2(const Point3D& point1, const Point3D& point2, const Point3D& point3, int numVerts, vector<Point3D>& resultVerts);
void Bezier3(const Point3D& point1, const Point3D& point2, const Point3D& point3, const Point3D& point4, int numVerts, vector<Point3D>& resultVerts);
