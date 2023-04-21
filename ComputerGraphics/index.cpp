#include <iostream>
using namespace std;
#include "testLine.h"
#include "testRay.h"
#include "testQuaternion.h"
#include "testVectorMatrix.h"

void Bezier()
{
    //testBezier();
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

int main()
{
    //Vector();
    //Quaternion();
    Ray();
    system("pause");
    return 0;
}
