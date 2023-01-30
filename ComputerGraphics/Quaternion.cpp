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

Quaternion Quaternion::operator*(const Quaternion &a)const
{
	Quaternion result;

	result.w = w*a.w - x*a.x - y*a.y - z*a.z;
	result.x = w*a.x + x*a.w + z*a.y - y*a.z;
	result.y = w*a.y + y*a.w + w*a.z - z*a.x;
	result.z = w*a.z + z*a.w + y*a.x - x*a.y;
	return result;
}

Quaternion& Quaternion::operator*=(const Quaternion &a)
{
	*this = *this * a;
	return *this;
}

void Quaternion::normalize()
{
	float mag = (float)sqrt(w*w+x*x+y*y+z*z);
	if (mag > 0.0f)
	{
		float oneOverMag = 1.0f / mag;
		w = w*oneOverMag;
		x = x*oneOverMag;
		y *= oneOverMag;
		z *= oneOverMag;
	}
	else
	{
		identity();
	}
}

float dotProduct(Quaternion &a, const Quaternion &b)
{
	return a.w*b.w + a.x*b.x + a.y*b.y + a.z*b.z;
}

Quaternion conjugate(const Quaternion &q)
{
	Quaternion result;
	result.w = q.w;
	result.x = -q.x;
	result.y = -q.y;
	result.z = -q.z;

	return result;
}

Quaternion pow(const Quaternion &q, float exponent)
{
	if (fabs(q.w)>0.9999f)
	{
		return q;
	}
	float alpha = acos(q.w);
	float newAlpha = exponent * alpha;

	Quaternion result;
	result.w = cos(newAlpha);
	float mult = sin(newAlpha) / sin(alpha);
	result.x = q.x*mult;
	result.y = q.y*mult;
	result.z = q.z*mult;

	return result;
}
