#include <iostream>
using namespace std;
#include "testLine.h"
#include "testRay.h"
#include "testQuaternion.h"
#include "testVectorMatrix.h"
#include "testPlane.h"
#include "LSM.h"

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

void Learn()
{
    LSM();
}
int main()
{
    //Vector();
    //Quaternion();
    //Ray();
    //Bezier();
    //Plane();
    Learn();
    system("pause");
    return 0;
}
