#include <iostream>
using namespace std;
#include "testLine.h"
#include "testRay.h"
#include "testQuaternion.h"

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

int main()
{
    
    Quaternion();
    system("pause");
    return 0;
}
