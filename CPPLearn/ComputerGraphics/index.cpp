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

void testLine()
{
    //testBezier();
    //testSpline();
    testCurve();
}

void Ray()
{
    //testGetUnitLengthAndDistance();
    testDir();
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
int main()
{
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
    system("pause");
    return 0;
}
