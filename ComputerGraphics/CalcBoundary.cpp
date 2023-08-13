#include "CalcBoundary.h"
#include <vector>
#include <algorithm>

namespace CALC_BOUNDARY {

    void CalcBoundaryMethod1(std::vector<Point3D>& cloud_boundary, const std::vector<Point3D>& cloud, int resolution)
    {
        Point3D px_min = *std::min_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });
        Point3D px_max = *std::max_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });

        float delta_x = (px_max.getX() - px_min.getX()) / resolution;
        float min_y = INT_MAX, max_y = -INT_MAX;
        std::vector<int> indexs_x(2 * resolution + 2);
        std::vector<std::pair<float, float>> minmax_x(resolution + 1, { INT_MAX,-INT_MAX });
        for (size_t i = 0; i < cloud.size(); ++i)
        {
            int id = (cloud[i].getX() - px_min.getX()) / delta_x;
            if (cloud[i].getY() < minmax_x[id].first)
            {
                minmax_x[id].first = cloud[i].getY();
                indexs_x[id] = i;
            }
            else if (cloud[i].getY() > minmax_x[id].second)
            {
                minmax_x[id].second = cloud[i].getY();
                indexs_x[id + resolution + 1] = i;
            }
        }

        for (auto& index : indexs_x)
        {
            cloud_boundary.push_back(cloud.at(index));
        }
        WriteOBJFile(cloud_boundary, "./output/xBoundary.obj");

        Point3D py_min = *std::min_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getY() < pt2.getY(); });
        Point3D py_max = *std::max_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getY() < pt2.getY(); });

        float delta_y = (py_max.getY() - py_min.getY()) / resolution;
        float min_x = INT_MAX, max_x = -INT_MAX;
        std::vector<int> indexs_y(2 * resolution + 2);
        std::vector<std::pair<float, float>> minmax_y(resolution + 1, { INT_MAX,-INT_MAX });
        for (size_t i = 0; i < cloud.size(); ++i)
        {
            int id = (cloud[i].getY() - py_min.getY()) / delta_y;
            if (cloud[i].getX() < minmax_y[id].first)
            {
                minmax_y[id].first = cloud[i].getX();
                indexs_y[id] = i;
            }
            else if (cloud[i].getX() > minmax_y[id].second)
            {
                minmax_y[id].second = cloud[i].getX();
                indexs_y[id + resolution + 1] = i;
            }
        }

        for (auto& index : indexs_y)
        {
            cloud_boundary.push_back(cloud.at(index));
        }
        WriteOBJFile(cloud_boundary, "./output/yBoundary.obj");
        //pcl::PointCloud<Point3D>::Ptr cloud_xboundary(new pcl::PointCloud<Point3D>);
        //pcl::copyPointCloud(*cloud, indexs_x, *cloud_xboundary);
        //pcl::PointCloud<Point3D>::Ptr cloud_yboundary(new pcl::PointCloud<Point3D>);
        //pcl::copyPointCloud(*cloud, indexs_y, *cloud_yboundary);
        //*cloud_boundary = *cloud_xboundary + *cloud_yboundary;
    }


    void CalcBoundaryMethod2(std::vector<Point3D>& cloud_boundary, const std::vector<Point3D>& cloud, int resolution)
    {
        Point3D px_min = *std::min_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });
        Point3D px_max = *std::max_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });
        Point3D py_min = *std::min_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getY() < pt2.getY(); });
        Point3D py_max = *std::max_element(cloud.begin(), cloud.end(), [](Point3D pt1, Point3D pt2) {return pt1.getY() < pt2.getY(); });
        float x_min = px_min.getX(), x_max = px_max.getX(), y_min = py_min.getY(), y_max = py_max.getY();

        float L = sqrt((x_max - x_min) * (y_max - y_min) / resolution);
        int x_num = (x_max - x_min) / L + 1;
        int y_num = (y_max - y_min) / L + 1;

        std::vector<std::vector<std::vector<Point3D>>> uv(x_num + 1, std::vector<std::vector<Point3D>>(y_num + 1));
        //for (int i = 0; i <= x_num; ++i)
        //{
        //    for (int j = 0; j <= y_num; ++j)
        //    {
        //        Point3D ptcloud;
        //        uv[i][j] = ptcloud;
        //    }
        //}
        for (int i = 0; i < cloud.size(); ++i)
        {
            int x_id = (cloud[i].getX() - x_min) / L;
            int y_id = (cloud[i].getY() - y_min) / L;
            uv[x_id][y_id].push_back(cloud[i]);
        }

        std::vector<std::vector<bool>> boundary_index(x_num + 1, std::vector<bool>(y_num + 1, false));
        for (int i = 0; i <= x_num; ++i)
        {
            if (uv[i][0].size())
                boundary_index[i][0] = true;
            if (uv[i][y_num].size())
                boundary_index[i][y_num] = true;
        }
        for (int i = 0; i <= y_num; ++i)
        {
            if (uv[0][i].size())
                boundary_index[0][i] = true;
            if (uv[x_num][i].size())
                boundary_index[x_num][i] = true;
        }
        for (int i = 1; i < x_num - 1; ++i)
        {
            for (int j = 1; j < y_num - 1; ++j)
            {
                if (uv[i][j].size())
                {
                    if (!uv[i - 1][j - 1].size() || !uv[i][j - 1].size() || !uv[i + 1][j - 1].size() || !uv[i][j - 1].size() ||
                        !uv[i + 1][j - 1].size() || !uv[i + 1][j].size() || !uv[i + 1][j + 1].size() || !uv[i][j + 1].size())
                        boundary_index[i][j] = true;
                }
            }
        }
        auto compute3DCentroid = [](Point3D& center, const std::vector<Point3D>& ptCloud)
        {
            float x = 0.0f, y = 0.0f, z = 0.0f;
            for (auto& vert : ptCloud)
            {
                x += vert.getX();
                y += vert.getY();
                z += vert.getZ();
            }
            x = x / ptCloud.size();
            y = y / ptCloud.size();
            z = z / ptCloud.size();

            center = Point3D(x, y, z);
        };

        for (int i = 0; i <= x_num; ++i)
        {
            for (int j = 0; j <= y_num; ++j)
            {
                if (boundary_index[i][j])
                {
                    std::vector<Point3D> ptcloud;
                    ptcloud = uv[i][j];
                    Point3D cloud_centroid;
                    compute3DCentroid( cloud_centroid,ptcloud);
                    cloud_boundary.push_back(Point3D(cloud_centroid.getX(), cloud_centroid.getY(), cloud_centroid.getZ()));
                }
            }
        }
        WriteOBJFile(cloud_boundary,"./output/cloud_boundary.obj");
    }
}
