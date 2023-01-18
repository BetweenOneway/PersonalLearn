#include <Windows.h>
#include <stdio.h>
#include "math.h"
#include "BSpline.h"

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

int main()
{
    testOrigin();
    testMine();
    system("pause");
    return 0;
}
