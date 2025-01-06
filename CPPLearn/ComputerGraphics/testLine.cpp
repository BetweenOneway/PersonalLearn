#include <Windows.h>
#include <stdio.h>
#include "Point.h"
#include "math.h"
#include "BSpline.h"
#include "Spline.h"
#include <algorithm>
#include "Oper3DFile.h"

using namespace std;
using namespace SplineSpace;

#include "Bezier.h"

void testSpline()
{
    //double x0[5] = { 1,2,4,5,6 };		//已知的数据点
    //double y0[5] = { 1,3,4,2,5 };

    //double x[4] = { 1.5,2.5,3.5,4.5 };	//插值点
    //double y[4];
    //double leftBound = 0, RightBound = 0;	//边界导数

    //Spline sp(x0, y0, 5, GivenSecondOrder, leftBound, RightBound);
    //sp.MultiPointInterp(x, 4, y);			//求x的插值结果y
    //for (int i = 0; i < 4; i++)
    //{
    //    cout << "x=" << x[i] << "=>" << y[i] << endl;
    //}

    //double x0[3] = { -12.3474464,0.0120483264,12.8443232};		//已知的数据点
    //double y0[3] = { -2.63052559,3.16588783,-2.34144878 };

    std::vector<Point3D> verts;
    ReadOBJFile(verts, "D:/test/C11253/gumLineCenterOnPlane.obj");
    const int num = verts.size();

    double* x0 = new double[num];
    double* y0 = new double[num];
    for (int i = 0; i < num; i++)
    {
        x0[i] = verts.at(i).getX();
        y0[i] = verts.at(i).getY();
    }

    constexpr int insertNum = 119;
    double x[insertNum];	//插值点
    double y[insertNum];
    double leftBound = 0, RightBound = 0;	//边界导数

    Spline sp(x0, y0, num, GivenSecondOrder, leftBound, RightBound);
    double range = *max_element(x0, x0 + num) - *min_element(x0, x0 + num);
    double step = range / insertNum;
    for (int i = 0; i < insertNum; i++)
    {
        x[i] = x0[0] + step * i;
    }
    sp.MultiPointInterp(x, insertNum, y);			//求x的插值结果y

    FILE* fp_m_x = fopen("D:/test/C11253/spline.obj", "wt");
    for (int i = 0; i < insertNum; i++)
    {
        fprintf(fp_m_x, "v %lf %lf 0.0\n", x[i], y[i]);
    }
    fclose(fp_m_x);

    delete[] x0;
    delete[] y0;
}

void testBezier()
{
    //Point3D p1(-10, -10, 10);
    //Point3D p2(-5,0, 3);
    //Point3D p3(0, 0, 0);

    Point3D p1(1, 10, 0);
    Point3D p2(10, 10, 0);
    Point3D p3(10, 1, 0);
    Point3D p4(20, 1, 0);
    vector<Point3D> result;
    //Bezier2(p1, p2, p3, 100, result);
    Bezier3(p1, p2, p3, p4, 100, result);
    WriteOBJFile(result, "./output/Bezier.obj");
}

#include "Curve.h"

void testCurve()
{
    Point3D p1(-10, 10, 0);
    Point3D p2(-1, 1, 0);
    Point3D p3(1, 1, 0);
    Point3D p4(10, 10, 0);
    std::vector<Point3D> originVerts{p1,p2,p3,p4};
    vector<Point3D> result;
    createCurve(originVerts, result);
    WriteOBJFile(result, "./output/curve.obj");
}
