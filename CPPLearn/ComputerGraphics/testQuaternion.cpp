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
    float theta = 45.0f;
    //Y轴
    Vector3 axisY(0,1,0);
    Vector3 axisZ(0, 0, 1.0f);
    //旋转方向是逆时针 右手定则
    q.setToRotateAboutAxis(axisZ,(theta) / 180.0f * kPi);

    Vector3 dest = (q * src);
    //dest.normalize();
    cout << dest.getX()<<","<<dest.getY()<<","<<dest.getZ() << endl;

    Quaternion qTest = Quaternion::FromAxisAngle(Vector3(0.0f,0.0f,1.0f), (45) / 180.0f * kPi);
    Vector3 dest1 = (qTest * src);
    cout << dest1.getX() << "," << dest1.getY() << "," << dest1.getZ() << endl;
}
