#pragma once
#include "../ThirdParty/eigen/Eigen/Dense"

using namespace Eigen;

Affine3d computeTransformation(const Matrix<double, 3, 3>& sourcePoints, const Matrix<double, 3, 3>& targetPoints);
