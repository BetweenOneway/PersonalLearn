#include <Windows.h>
#include <stdio.h>
#include "math.h"
#include "BSpline.h"
#include "Spline.h"

#include <cstdio>
#include <iostream>

using namespace std;
using namespace SplineSpace;

int testOrigin()
{
    int num = 8;
    double x[8] = { 9.59,60.81,105.57,161.59,120.5,100.1,50.0,10.0 };
    double y[8] = { 61.97,107.13,56.56,105.27,120.5,150.0,110.0,180.0 };
    double z[8] = { 10.0,20.0,30.0,40.0,30.0,20.0,10.0,10.0 };
    

    CPosition3D* testpt = new CPosition3D[num];
    for (int i = 0; i < num; i++)
    {
        testpt[i] = CPosition3D(x[i], y[i],z[i]);
    }

    int* Intnum = new int[num - 1];
    for (int i = 0; i < num - 1; i++) {
        Intnum[i] = 10;                 //  每一个样条曲线内插入10个点
    }

    int num2 = num;
    CBSpline bspline;
    bspline.TwoOrderBSplineInterpolatePt(testpt, num2, Intnum);        //  二次B样条曲线
    //bspline.ThreeOrderBSplineInterpolatePt(testpt,num2,Intnum);    //  三次B样条曲线

    //bspline.TwoOrderBSplineSmooth(testpt,num2);      //  二次B样条平滑
    //bspline.ThreeOrderBSplineSmooth(testpt,num2);    //  三次B样条平滑
    delete[] Intnum;


    FILE* fp_m_x = fopen("./Bspline_test_x.obj", "wt");

    for (int i = 0; i < num2; i++) {
        fprintf(fp_m_x, "v %lf %lf %lf\n", testpt[i].x, testpt[i].y, testpt[i].z);
    }
    fclose(fp_m_x);

    return 0;
}

void testMine()
{
    int num = 3;
    double x[3] = { 12.8443232,0.0120483264,-12.3474464 };
    double y[3] = { -2.34144878,3.16588783,-2.63052559 };
    double z[3] = { 9.64562798,3.19460821,9.64634514 };

    CPosition3D* testpt = new CPosition3D[num];
    for (int i = 0; i < num; i++)
    {
        testpt[i] = CPosition3D(x[i], y[i], z[i]);
    }

    int* Intnum = new int[num - 1];
    for (int i = 0; i < num - 1; i++) {
        Intnum[i] = 10;                 //  每一个样条曲线内插入10个点
    }

    int num2 = num;
    CBSpline bspline;
    bspline.TwoOrderBSplineInterpolatePt(testpt, num2, Intnum);        //  二次B样条曲线
    //bspline.ThreeOrderBSplineInterpolatePt(testpt,num2,Intnum);    //  三次B样条曲线

    //bspline.TwoOrderBSplineSmooth(testpt,num2);      //  二次B样条平滑
    //bspline.ThreeOrderBSplineSmooth(testpt,num2);    //  三次B样条平滑
    delete[] Intnum;


    FILE* fp_m_x = fopen("./mine_test.obj", "wt");

    for (int i = 0; i < num2; i++) {
        fprintf(fp_m_x, "v %lf %lf %lf\n", testpt[i].x, testpt[i].y, testpt[i].z);
    }
    fclose(fp_m_x);

    return;
}

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

    double x0[5] = { -19.0400581,-12.7959490,-0.210696936,13.3248987,19.5304508 };
    double y0[5] = { -19.3465519,3.17271829,4.98585033,-3.31531453,-22.0727749 };
    double x[119];	//插值点
    double y[119];
    double leftBound = 0, RightBound = 0;	//边界导数

    Spline sp(x0, y0, 5, GivenSecondOrder, leftBound, RightBound);
    double range = 19.5304508 + 19.0400581;
    double step = range / 119;
    for (int i = 0; i < 119; i++)
    {
        x[i] = x0[0] + step * i;
    }
    sp.MultiPointInterp(x, 119, y);			//求x的插值结果y

    FILE* fp_m_x = fopen("./spline.obj", "wt");
    for (int i = 0; i < 119; i++)
    {
        fprintf(fp_m_x, "v %lf %lf 0.0\n", x[i], y[i]);
    }
    fclose(fp_m_x);

}
int main()
{
    //testOrigin();
    //testMine();
    testSpline();
    system("pause");
    return 0;
}
