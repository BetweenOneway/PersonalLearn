#include <iostream>
#include <vector>
#include <cmath>
#include "../ThirdParty/eigen/Eigen/Dense"

namespace NS_CURVATURE {
    struct Point {
        double x, y;
    };

    double computeCurvature(const Point& prev, const Point& curr, const Point& next) {
        // 一阶导数 (中心差分)
        double dx = (next.x - prev.x) / 2.0;
        double dy = (next.y - prev.y) / 2.0;

        // 二阶导数 (中心差分)
        double d2x = next.x - 2 * curr.x + prev.x;
        double d2y = next.y - 2 * curr.y + prev.y;

        // 计算分子和分母
        double numerator = dx * d2y - dy * d2x;
        double denominator = std::pow(dx * dx + dy * dy, 1.5);

        // 处理分母为零的情况
        if (std::abs(denominator) < 1e-6) {
            return 0.0; // 无曲率或直线
        }
        return numerator / denominator;
    }

    std::vector<double> computeCurvature(const std::vector<Point>& points) {
        size_t n = points.size();
        std::vector<double> curvature(n, 0.0);

        // 计算一阶导数
        std::vector<double> dx_dt(n), dy_dt(n);
        for (size_t i = 1; i < n - 1; ++i) {
            dx_dt[i] = (points[i + 1].x - points[i - 1].x) / 2.0;
            dy_dt[i] = (points[i + 1].y - points[i - 1].y) / 2.0;
        }
        // 边界处理
        dx_dt[0] = points[1].x - points[0].x;
        dy_dt[0] = points[1].y - points[0].y;
        dx_dt[n - 1] = points[n - 1].x - points[n - 2].x;
        dy_dt[n - 1] = points[n - 1].y - points[n - 2].y;

        // 计算二阶导数
        std::vector<double> d2x_dt2(n), d2y_dt2(n);
        for (size_t i = 1; i < n - 1; ++i) {
            d2x_dt2[i] = points[i + 1].x - 2 * points[i].x + points[i - 1].x;
            d2y_dt2[i] = points[i + 1].y - 2 * points[i].y + points[i - 1].y;
        }
        // 边界处理
        d2x_dt2[0] = d2x_dt2[1];
        d2y_dt2[0] = d2y_dt2[1];
        d2x_dt2[n - 1] = d2x_dt2[n - 2];
        d2y_dt2[n - 1] = d2y_dt2[n - 2];

        // 计算曲率
        for (size_t i = 0; i < n; ++i) {
            double numerator = std::abs(dx_dt[i] * d2y_dt2[i] - dy_dt[i] * d2x_dt2[i]);
            double denominator = std::pow(dx_dt[i] * dx_dt[i] + dy_dt[i] * dy_dt[i], 1.5);
            if (denominator > 1e-6) { // 避免除零错误
                curvature[i] = numerator / denominator;
            }
            else {
                curvature[i] = 0.0; // 或者设置为一个合适的值
            }
        }

        return curvature;
    }

    double calculateCurvatureByCircleFitting(const std::vector<Point>& points, int index) {
        if (points.size() < 3 || index < 1 || index >= points.size() - 1) {
            return 0.0;
        }

        // 获取三个点
        auto p0 = points[index - 1];
        auto p1 = points[index];
        auto p2 = points[index + 1];

        // 计算三点确定的圆的半径
        double x1 = p0.x, y1 = p0.y;
        double x2 = p1.x, y2 = p1.y;
        double x3 = p2.x, y3 = p2.y;

        double a = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
        double b = (x1 * x1 + y1 * y1) * (y3 - y2) + (x2 * x2 + y2 * y2) * (y1 - y3) + (x3 * x3 + y3 * y3) * (y2 - y1);
        double c = (x1 * x1 + y1 * y1) * (x2 - x3) + (x2 * x2 + y2 * y2) * (x3 - x1) + (x3 * x3 + y3 * y3) * (x1 - x2);

        double D = 2 * (x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2);

        if (std::abs(D) < 1e-10) {
            return 0.0; // 三点共线，曲率为0
        }

        // 圆心坐标
        double centerX = -b / D;
        double centerY = -c / D;

        // 计算半径
        double radius = std::sqrt(std::pow(x1 - centerX, 2) + std::pow(y1 - centerY, 2));

        // 曲率 = 1/半径
        return 1.0 / radius;
    }

    int CalcCurvatureMethod1() {
        // 示例点集
        std::vector<Point> points = {
            {-2, 1.5},
            {-1, 1},
            {0, 0},
            {1, 1},
            {2, 2}
        };

        std::vector<double> curvatures = computeCurvature(points);

        for (size_t i = 0; i < curvatures.size(); ++i) {
            std::cout << "Point " << i << " curvature: " << curvatures[i] << std::endl;
        }

        return 0;
    }
    int CalcCurvatureMethod3() {
        // 示例点集
        std::vector<Point> points = {
            {-2, 1.5},
            {-1, 1},
            {0, 0},
            {1, 1},
            {2, 2}
        };


        for (size_t i = 1; i < points.size()-1; ++i) {
            std::cout << "Point " << i << " curvature: " << calculateCurvatureByCircleFitting(points,i) << std::endl;
        }

        return 0;
    }

    // 拟合圆并返回圆心和半径
    void fitCircle(const std::vector<Point>& points, double& xc, double& yc, double& radius) {
        Eigen::MatrixXd A(points.size(), 3);
        Eigen::VectorXd b(points.size());

        for (size_t i = 0; i < points.size(); ++i) {
            A(i, 0) = points[i].x;
            A(i, 1) = points[i].y;
            A(i, 2) = 1.0;
            b(i) = points[i].x * points[i].x + points[i].y * points[i].y;
        }

        Eigen::Vector3d params = A.colPivHouseholderQr().solve(b);

        xc = params(0) / 2.0;
        yc = params(1) / 2.0;
        radius = std::sqrt(params(2) + xc * xc + yc * yc);
    }

    std::vector<double> computeCurvatureCircleFitting(const std::vector<Point>& points, size_t window_size = 3) {
        size_t n = points.size();
        std::vector<double> curvatures(n, 0.0);

        for (size_t i = 0; i < n; ++i) {
            size_t start = std::max<size_t>(0, i - window_size / 2);
            size_t end = std::min<size_t>(n, i + window_size / 2 + 1);
            std::vector<Point> local_points(points.begin() + start, points.begin() + end);

            double xc, yc, radius;
            fitCircle(local_points, xc, yc, radius);

            curvatures[i] = (radius > 0) ? 1.0 / radius : 0.0;
        }

        return curvatures;
    }

    int CalcCurvatureMethod2() {
        // 示例点集
        std::vector<Point> points = {
            {0, 0},
            {1, 0.5},
            {2, 1},
            {3, 1.5},
            {4, 2}
        };

        std::vector<double> curvatures = computeCurvatureCircleFitting(points);

        for (size_t i = 0; i < curvatures.size(); ++i) {
            std::cout << "Point " << i << " curvature: " << curvatures[i] << std::endl;
        }

        return 0;
    }
}
