#include "CalcBoundary.h"
#include <vector>
#include <algorithm>

#include "BallConcave.h"

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

    void ConvexHullMethod1Sub(std::vector<Point3D>& result,const std::vector<Point3D>& verts, const Point3D& minXPoint, const Point3D& maxXPoint)
    {
        if (verts.size() <= 1)
        {
            return;
        }
        int t=0, R, Rmax, tmax;
        std::vector<Point3D> ResultPack;
        Point3D point = verts.front();
        R = minXPoint.getX() * maxXPoint.getY() + point.getX()*minXPoint.getY()+maxXPoint.getX()* point.getY() - point.getX() * maxXPoint.getY() - maxXPoint.getX() * minXPoint.getY() - minXPoint.getX() * point.getY();
        Rmax = R;
        tmax = 1;
        for (int i = 1; i < verts.size(); i++)
        {
            point = verts.at(i);
            R = minXPoint.getX() * maxXPoint.getY() + point.getX() * minXPoint.getY() + maxXPoint.getX() * point.getY() - point.getX() * maxXPoint.getY() - maxXPoint.getX() * minXPoint.getY() - minXPoint.getX() * point.getY();
            if (R >= 0)
            {
                t++;
                ResultPack.push_back(point);
            }
            if (R > Rmax)
            {
                Rmax = R;
                tmax = i;
            }
        }
        if (Rmax <= 0)
        {
            for (int i = 0; i < ResultPack.size(); i++)
            {
                point = ResultPack.at(i);
                R = minXPoint.getX() * maxXPoint.getY() + point.getX() * minXPoint.getY() + maxXPoint.getX() * point.getY() - point.getX() * maxXPoint.getY() - maxXPoint.getX() * minXPoint.getY() - minXPoint.getX() * point.getY();
                if (R == 0 && !((point.getX() == maxXPoint.getX() && point.getY() == maxXPoint.getY())
                    || (point.getX() == minXPoint.getX() && point.getY() == minXPoint.getY())))
                {
                    result.push_back(point);
                }
            }
            return;
        }
        else
        {
            result.push_back(verts.at(tmax));
            if (ResultPack.size() == 0)
                return;
        }
        ConvexHullMethod1Sub(result,ResultPack, minXPoint, verts.at(tmax));
        ConvexHullMethod1Sub(result,ResultPack, verts.at(tmax), maxXPoint);
    }
    /*
    * 分治法
    * 计算确实能得到一圈点，但是点集很密，边缘不是一条单一的线
    */

    void ConvexHullMethod1(std::vector<Point3D>& result,const std::vector<Point3D>& verts)
    {
        Point3D minXPoint = *std::min_element(verts.begin(), verts.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });
        Point3D maxXPoint = *std::max_element(verts.begin(), verts.end(), [](Point3D pt1, Point3D pt2) {return pt1.getX() < pt2.getX(); });
        ConvexHullMethod1Sub(result,verts, minXPoint, maxXPoint);
        ConvexHullMethod1Sub(result,verts, maxXPoint, minXPoint);

        if (result.size() >= 0)
        {
            WriteOBJFile(result,"../ComputerGraphics/output/ConvexHullMethod1Result.obj");
        }
    }

    float g_result[1000][2];

    /*getResult()实现功能：以坐标P0(x1,y1)和Pn(x2,y2)为直线，找出pack里面里这条直线最远的点Pmax
    *并找出直线P0Pmax和PmaxPn的上包，进行递归。
    *注：Pack[0][0]存放点的个数，pack[1]开始存放点的坐标。
    *全局变量g_result[][]用来存放凸包上的点，即最终所要的答案。同样g_result[0][0]存放的是已找到的点的个数。
    **/
    void getResult(float Pack[240][2], float x1, float y1, float x2, float y2)
    {
        int i, t, tmax;
        float x3, y3, R, Rmax;
        float ResultPack[1000][2];
        ResultPack[0][0] = 0;
        if (Pack[0][0] <= 1)
            return;
        x3 = Pack[1][0];
        y3 = Pack[1][1];
        R = x1 * y2 + x3 * y1 + x2 * y3 - x3 * y2 - x2 * y1 - x1 * y3;
        Rmax = R;
        tmax = 1;
        for (i = 2; i <= Pack[0][0]; i++)
        {
            x3 = Pack[i][0];
            y3 = Pack[i][1];
            R = x1 * y2 + x3 * y1 + x2 * y3 - x3 * y2 - x2 * y1 - x1 * y3;
            if (R >= 0)
            {
                t = ++ResultPack[0][0];
                ResultPack[t][0] = x3;
                ResultPack[t][1] = y3;
            }
            if (R > Rmax)
            {
                Rmax = R;
                tmax = i;
            }
        }
        if (Rmax <= 0)
        {
            for (i = 1; i < ResultPack[0][0]; i++)
            {
                x3 = ResultPack[i][0];
                y3 = ResultPack[i][1];
                R = x1 * y2 + x3 * y1 + x2 * y3 - x3 * y2 - x2 * y1 - x1 * y3;
                if (R == 0 && !((x3 == x2 && y3 == y2) || (x3 == x1 && y3 == y1)))
                {
                    t = ++g_result[0][0];
                    g_result[t][0] = ResultPack[i][0];
                    g_result[t][1] = ResultPack[i][1];
                }
            }
            return;
        }
        else
        {
            t = ++g_result[0][0];
            g_result[t][0] = Pack[tmax][0];
            g_result[t][1] = Pack[tmax][1];
            if (ResultPack[0][0] == 0)
                return;
        }
        getResult(ResultPack, x1, y1, Pack[tmax][0], Pack[tmax][1]);
        getResult(ResultPack, Pack[tmax][0], Pack[tmax][1], x2, y2);
    }

    void ConvexHullMethod1()
    {
        std::vector<Point3D> verts;
        std::vector<Point3D> resultVerts;
        ReadOBJFile(verts, "../ComputerGraphics/input/local_attMesh.obj");
        //Plane zPlane;
        Plane zPlane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f, 0.0f, 0.0f));
        zPlane.projectPoints(verts);

        float Point[1000][2];//Point存所有点。
        int i = 1;
        float x1, y1, x2, y2, x3, y3;
        g_result[0][0] = 0; Point[0][0] = 0;//Point的第一行第一列元素存放包里面有几个点。初始化为0。

        for (auto& vert : verts)
        {
            Point[i][0] = vert.getX();
            Point[i][1] = vert.getY();
            i++;
        }

        Point[0][0] = verts.size();
        x1 = Point[1][0];
        y1 = Point[1][1];
        x2 = x1;
        y2 = y1;
        for (i = 2; i <= Point[0][0]; i++)
        {
            x3 = Point[i][0];
            y3 = Point[i][1];
            if (x3 < x1)
            {
                x1 = x3;
                y1 = y3;
            }
            else if (x3 > x2)
            {
                x2 = x3;
                y2 = y3;
            }
        }
        g_result[1][0] = x1;
        g_result[1][1] = y1;
        g_result[2][0] = x2;
        g_result[2][1] = y2;
        g_result[0][0] += 2;
        getResult(Point, x1, y1, x2, y2);
        getResult(Point, x2, y2, x1, y1);

        printf("\n\n构成凸包的点有：\n");
        for (i = 1; i <= g_result[0][0]; i++)
        {
            resultVerts.push_back({ g_result[i][0], g_result[i][1],0.0f });
        }
        WriteOBJFile(resultVerts, "../ComputerGraphics/output/test1.obj");
    }

    void BallConcaveMethod()
    {
        std::vector<Point3D> verts;
        std::vector<Point3D> resultVerts;
        ReadOBJFile(verts, "../ComputerGraphics/input/local_attMesh.obj");
        //Plane zPlane;
        Plane zPlane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f, 0.0f, 0.0f));
        zPlane.projectPoints(verts);

        WriteOBJFile(verts, "../ComputerGraphics/output/BallConcaveMethod_input.obj");

        BallConcave ballConcave(verts);

        double R = ballConcave.GetRecomandedR();
        resultVerts = ballConcave.GetConcave_Ball(R);
        WriteOBJFile(resultVerts, "../ComputerGraphics/output/BallConcaveMethod_output.obj");
    }
}
