#pragma once
#include "ComputerGraphics.h"

namespace CALC_BOUNDARY {
    void CalcBoundaryMethod1(std::vector<Point3D>& cloud_boundary, const std::vector<Point3D>& cloud, int resolution);
    void CalcBoundaryMethod2(std::vector<Point3D>& cloud_boundary, const std::vector<Point3D>& cloud, int resolution);
}
