#include <iostream>
#include "Location.h"

namespace TEST_LOCATION {
    int testLocationTransform() {
        // 定义源坐标系中的三个点
        Matrix<double, 3, 3> sourcePoints;
        sourcePoints << 0, 1, 0,
            0, 0, 1,
            0, 0, 0;

        // 定义目标坐标系中的三个对应点
        Matrix<double, 3, 3> targetPoints;
        targetPoints << 1, 1, 1,
            0, 1, 1,
            0, 0, 1;

        // 计算变换矩阵
        Affine3d transform = computeTransformation(sourcePoints, targetPoints);

        std::cout << "Rotation matrix:\n" << transform.linear() << std::endl;
        std::cout << "Translation vector:\n" << transform.translation() << std::endl;

        // 测试变换一个点
        Vector3d p(0, 1, 0);
        Vector3d p_transformed = transform * p;
        std::cout << "Original point: " << p.transpose() << std::endl;
        std::cout << "Transformed point: " << p_transformed.transpose() << std::endl;

        return 0;
    }
}
