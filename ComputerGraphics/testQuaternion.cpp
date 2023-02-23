#include "testQuaternion.h"
#include "Vector3.h"
#include "Quaternion.h"
#include "MathUtil.h"
#include <iostream>
using namespace std;

void verifyRotateDirection()
{
    Vector3 src(1, 0, 0);

    Quaternion q;
    float theta = 180.0f;
    //Y轴
    Vector3 axis(0,1,0);
    
    q.setToRotateAboutAxis(axis,(theta) / 180.0f * kPi);

    Vector3 dest = (q * src);
    //dest.normalize();
    cout << dest.getX()<<","<<dest.getY()<<","<<dest.getZ() << endl;
}
