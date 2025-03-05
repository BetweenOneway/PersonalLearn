#include <iostream>
#include "Location.h"


// 计算刚体变换矩阵
Affine3d computeTransformation(const Matrix<double, 3, 3>& sourcePoints, const Matrix<double, 3, 3>& targetPoints) {
    // 计算质心
    Vector3d centroidSource = sourcePoints.rowwise().mean();
    Vector3d centroidTarget = targetPoints.rowwise().mean();

    // 去质心化
    Matrix<double, 3, 3> centeredSource = sourcePoints.colwise() - centroidSource;
    Matrix<double, 3, 3> centeredTarget = targetPoints.colwise() - centroidTarget;

    // 构建协方差矩阵
    Matrix3d H = centeredSource * centeredTarget.transpose();

    // SVD 分解
    JacobiSVD<Matrix3d> svd(H, ComputeFullU | ComputeFullV);
    Matrix3d U = svd.matrixU();
    Matrix3d V = svd.matrixV();

    // 计算旋转矩阵
    Matrix3d R = V * U.transpose();

    // 确保旋转矩阵是正交的
    if (R.determinant() < 0) {
        V.col(2) *= -1;
        R = V * U.transpose();
    }

    // 计算平移向量
    Vector3d t = centroidTarget - R * centroidSource;

    // 构建变换矩阵
    Affine3d transform;
    transform.linear() = R;
    transform.translation() = t;

    return transform;
}


