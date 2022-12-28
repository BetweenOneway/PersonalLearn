#include "Quaternion.h"
#include <math.h>
#include "MathUtil.h"

const Quaternion kQuaternionIdentity = { 1.0f,0.0f,0.0f,0.0f };

void Quaternion::setToRotateAboutX(float theta)
{
    float thetaOver2 = theta * 0.5f;
    w = cos(thetaOver2);
    x = sin(thetaOver2);
    y = 0.0f;
    z = 0.0f;
}

void Quaternion::setToRotateAboutY(float theta)
{
    float thetaOver2 = theta * 0.5f;
    w = cos(thetaOver2);
    x = 0.0f;
    y = sin(thetaOver2);
    z = 0.0f;
}

void Quaternion::setToRotateAboutZ(float theta)
{
    float thetaOver2 = theta * 0.5f;
    w = cos(thetaOver2);
    x = 0.0f;
    y = 0.0f;
    z = sin(thetaOver2);
}

void Quaternion::setToRotateAboutAxis(const Vector3& axis, float theta)
{
    //assert(fabs(vectorMag(axis) - 1.0f) < 0.01f);
    float thetaOver2 = theta * 0.5f;
    float sinThetaOver2 = sin(thetaOver2);

    w = cos(thetaOver2);
    x = axis.getX() * sinThetaOver2;
    y = axis.getY() * sinThetaOver2;
    z = axis.getZ() * sinThetaOver2;

}

float Quaternion::getRotationAngle()const
{
    float thetaOver2 = safeAcos(w);
    return thetaOver2 * 2.0f;
}

Vector3 Quaternion::getRotationAxis() const
{
    //(sinx)^2 + (cosx)^2 = 1
    float sinThetaOver2Sq = 1.0f - w * w;
    float sinThetaOver2 = sqrt(sinThetaOver2Sq);
    float oneOverSinThetaOver2 = 1.0 / sinThetaOver2;

    return Vector3(x* oneOverSinThetaOver2,y* oneOverSinThetaOver2,z* oneOverSinThetaOver2);
}
