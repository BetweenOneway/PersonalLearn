#include <math.h>
#include "Vector3.h"


Vector3::Vector3()
{
    x = y = z = 0.0f;
}

void Vector3::Clear()
{
    x = y = z = 0.0f;
}

Vector3 Vector3::operator*(float a)const
{
    return Vector3(x * a, y * a, z * a);
}

Vector3 Vector3::operator*=(float a)
{
    x = x * a;
    y = y * a;
    z = z * a;
    return *this;
}

Vector3 Vector3::operator/(float a)const
{
    //因为计算机中乘法比除法快
    float base = 1.0f / a;
    return Vector3(x * base, y * base, z * base);
}

Vector3 Vector3::operator*(float a)
{
    float base = 1.0f / a;
    x = x * base;
    y = y * base;
    z = z * base;
    return *this;
}

//计算向量的模（也就是长度）
float vectorMag(const Vector3& a)
{
    return sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}
//2*v3
Vector3 operator*(float k, const Vector3& v)
{
    return Vector3(v.x * k, v.y * k, v.z * k);
}
Vector3 Vector3::operator+(const Vector3& roper) const
{
    return Vector3(x + roper.x, y + roper.y, z + roper.z);
}
Vector3 Vector3::operator+=(const Vector3& roper)
{
    x += roper.x;
    y += roper.y;
    z += roper.z;
    return *this;
}

Vector3 Vector3::operator-(const Vector3& roper) const
{
    return Vector3(x - roper.x, y - roper.y, z - roper.z);
}

Vector3 Vector3::operator-=(const Vector3& roper)
{
    x -= roper.x;
    y -= roper.y;
    z -= roper.z;
    return *this;
}
//标准化
void Vector3::normalize()
{
    float magSq = x * x + y * y + z * z;
    if (magSq > 0.0f)
    {
        float base = 1.0f / sqrt(magSq);
        x *= base;
        y *= base;
        z *= base;
    }
}
//向量点乘
float Vector3::operator*(const Vector3& roper)
{
	return x*roper.x + y*roper.y + z*roper.z;
}

//计算两点之间的距离
float distance(const Vector3& start, const Vector3& end)
{
	float dx = start.x - end.x;
	float dy = start.y - end.y;
	float dz = start.z - end.z;

	return sqrt(dx*dx+dy*dy+dz*dz);
}
//向量差乘
Vector3 crossProduct(const Vector3& loper, const Vector3& roper)
{
	return Vector3(loper.y*roper.z - loper.z*roper.y,
		loper.z*roper.x - loper.x*roper.z,
		loper.x*roper.y - loper.y*roper.x);
}

int main()
{
	return 0;
}