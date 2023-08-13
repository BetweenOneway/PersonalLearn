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

void Bezier()
{
    //testBezier();
    testSpline();
}

void Ray()
{
    testGetUnitLengthAndDistance();
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
    ReadOBJFile(verts, "../testData/local_attMesh.obj");
    //Plane zPlane;
    Plane zPlane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f, 0.0f, 0.0f));
    zPlane.projectPoints(verts);
    WriteOBJFile(verts, "./input.obj");
    CALC_BOUNDARY::CalcBoundaryMethod1(resultVerts,verts,30);

    resultVerts.clear();
    CALC_BOUNDARY::CalcBoundaryMethod2(resultVerts, verts, 10*10);
}

int main()
{
    //Vector();
    //Quaternion();
    //Ray();
    //Bezier();
    //Plane();
    //Learn();
    CalcBoundary();
    system("pause");
    return 0;
}
