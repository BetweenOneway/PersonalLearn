#include <Windows.h>
#include <stdio.h>
#include "math.h"
#include "BSpline.h"
#include "Spline.h"

#include <cstdio>
#include <iostream>
#include <algorithm>

using namespace std;
using namespace SplineSpace;

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

    constexpr int num = 6;

    //double x0[num] = { -10.0f,-5.0f,-3.0f,-1.0f,3.0f,5.0f,10.0f};
    //double y0[num] = { -10.0f,0.0f,0.0f,0.0f,0.0f,0.0f,-10.0f };

    double x0[num] = { -10.0f,-5.0f,-4.0f,-2.0f,0.0f,5.0f };
    double y0[num] = { -10.0f,0.0f,0.0f,0.0f,0.0f,0.0f };
    //double x0[num] = { -12.0f,-10.0f,0.0f,10.0f,12.0f };
    //double y0[num] = { -12.0f,-10.0f,0.0f,-10.0f,-12.0f };

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

    FILE* fp_m_x = fopen("./spline.obj", "wt");
    for (int i = 0; i < insertNum; i++)
    {
        fprintf(fp_m_x, "v %lf %lf 0.0\n", x[i], y[i]);
    }
    fclose(fp_m_x);

}
