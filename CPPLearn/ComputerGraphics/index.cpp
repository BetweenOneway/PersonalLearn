#include <iomanip>
#include <iostream>
using namespace std;

#include "testLine.h"
#include "testRay.h"
#include "testQuaternion.h"
#include "testVectorMatrix.h"
#include "testPlane.h"
#include "LSM.h"

#include "ComputerGraphics.h"
#include "CalcBoundary.h"
#include "testCommonFunctions.h"
#include "testAlgo.h"
#include "Curvature.h"
#include "testLocation.h"
#include "Type.h"
#include <stdio.h>

void testLine()
{
    //testBezier();
    //testSpline();
    testCurve();
}

void Ray()
{
    //testGetUnitLengthAndDistance();
    //testDir();
    testRayProject();
}

void Quaternion()
{
    verifyRotateDirection();
}

void Vector()
{
    testDotCross();
}

void TestPlane()
{
    TEST_PLANE::testGetDistance();
}

void Learn()
{
    //CURVE_FITTING::LSM();
    CURVE_FITTING::MyTest();
}

void CalcBoundary()
{
    std::vector<Point3D> verts;
    std::vector<Point3D> resultVerts;
    ReadOBJFile(verts, "../ComputerGraphics/input/local_attMesh.obj");
    //Plane zPlane;
    Plane zPlane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f, 0.0f, 0.0f));
    zPlane.projectPoints(verts);
    WriteOBJFile(verts, "../ComputerGraphics/output/input.obj");

    CALC_BOUNDARY::CalcBoundaryMethod1(resultVerts,verts,30);

    resultVerts.clear();
    CALC_BOUNDARY::CalcBoundaryMethod2(resultVerts, verts, 10*10);

    resultVerts.clear();
    CALC_BOUNDARY::ConvexHullMethod1(resultVerts, verts);

    CALC_BOUNDARY::ConvexHullMethod1();
    // 有问题 生成不了
    //CALC_BOUNDARY::BallConcaveMethod();
}

void CommonFunctions()
{
    testPMIntersectTri();
}

void testDot()
{
    Point3D dir1(0,1,0);
    Point3D dir2(1,1,0);
    Point3D dir3(-1, 1, 0);

    //1
    std::cout << dir1.AbsDot(dir2) << std::endl;
    //1
    std::cout << dir2.AbsDot(dir1) << std::endl;
    //1
    std::cout<<dir1.AbsDot(dir3)<<std::endl;
}

void testAlgo()
{
    TEST_ALGO::testAlgo();
}

void testCurvature()
{
    NS_CURVATURE::CalcCurvatureMethod1();
    //会报错
    //NS_CURVATURE::CalcCurvatureMethod2();
    NS_CURVATURE::CalcCurvatureMethod3();
}

void testLocation()
{
    TEST_LOCATION::testLocationTransform();
}

void testOper3DFile()
{
    int way = 0;
    if(way == 0)
    {
        float num = 127.0f;
        float num1 = 127.12344f;
        cout << showpoint<< left << setw(7) << num << endl;
        cout << fixed << setprecision(4) << num1 << endl;

        //ofstream ofs;
        //ofs.open("./output/output.txt", std::ios::out);
        //
        //{
        //    float num2 = -12.34f;
        //    ofs << fixed << setprecision(6) << num1 <<"f, "<<num2 << endl;

        //    
        //    //ofs << fixed << setprecision(6) << num2 <<"f" << endl;
        //}
        //ofs.close();

        float a = 12.3;

        double b = 45.56;

        printf("%06.2f\n", b);
        printf("%f %.3f %lf %.3lf\n", a, a, b, b);

        std::vector<Point3D> verts;
        std::vector<Surf> surfs;
        //这里地址的.指的是该文件所在目录
        ReadOBJFile(verts, surfs, "./input/4.18.obj");

        ofstream ofs;
        ofs.open("./output/output.txt", std::ios::out);

        for (auto& vert : verts)
        {
            ofs << fixed << setprecision(6) << vert.getX() << "f, " << vert.getY()<< "f, " <<vert.getZ()<<"f)" << endl;
        }

        ofs << endl;
        for (auto& surf : surfs)
        {
            ofs <<surf.x << ", " << surf.y << ", " << surf.z << ")" << endl;
        }

        ofs.close();
    }
    else if (1 == way)
    {
        std::vector<Point3D> verts;
        std::vector<Surf> surfs;
        //这里地址的.指的是该文件所在目录
        ReadSTLFile(verts, surfs, "./input/4.18.obj");
    }
}

int main()
{
    //testOper3DFile();
    //TestPlane();
    //testDot();
    //Vector();
    //Quaternion();
    Ray();
    //testLine();
    //Plane();
    //Learn();
    //CalcBoundary();
    //CommonFunctions();
    //testAlgo();
    //testCurvature();
    //testLocation();
    system("pause");
    return 0;
}
