#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

struct Point {
    double x, y;
};
double CalcDistance(const Point& p1, const Point& p2) {
    return std::sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

bool is_boundary_point(const Point& p, const vector<Point>& points) {
    int n = points.size();
    double max_distance = 0;
    for (int i = 0; i < n; i++) {
        double distance = CalcDistance(p, points[i]);
        if (distance > max_distance) {
            max_distance = distance;
        }
    }
    return max_distance >= 1e-6;
}



int main() {
    vector<Point> points = { {1, 1}, {3, 1}, {3, 3}, {1, 3}, {2, 2} };
    for (const auto& p : points) {
        if (is_boundary_point(p, points)) {
            cout << "(" << p.x << ", " << p.y << ") is a boundary point." << endl;
        }
    }
    return 0;
}
