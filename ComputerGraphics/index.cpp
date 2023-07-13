#include <iostream>
using namespace std;
#include "testLine.h"
#include "testRay.h"
#include "testQuaternion.h"
#include "testVectorMatrix.h"
#include "testPlane.h"

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

void Plane()
{
    TEST_PLANE::testGetDistance();
}
int main()
{
    //Vector();
    //Quaternion();
    //Ray();
    Bezier();
    //Plane();
    system("pause");
    return 0;
}
