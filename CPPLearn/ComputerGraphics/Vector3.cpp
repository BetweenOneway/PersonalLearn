#include <math.h>
#include "Vector3.h"
#include "common.h"

Vector3::Vector3()
{
    x = y = z = 0.0f;
}

void Vector3::Clear()
{
    x = y = z = 0.0f;
}

const Vector3 Vector3::operator*(const float a)const
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

const Vector3 Vector3::operator/(const float a)const
{
    //因为计算机中乘法比除法快
    float base = 1.0f / a;
    return Vector3(x * base, y * base, z * base);
}

float Vector3::Magnitude() const
{
    return vectorMag(*this);
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
const Vector3 Vector3::operator+(const Vector3& roper) const
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

const Vector3 Vector3::operator-(const Vector3& roper) const
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
bool Vector3::operator==(const Vector3& roper) const
{
    return (x == roper.getX() && y == roper.getY() && z == roper.getZ());
}

bool Vector3::operator!=(const Vector3& roper) const
{
    return !(*this==roper);
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
float Vector3::operator*(const Vector3& roper) const
{
	return x*roper.x + y*roper.y + z*roper.z;
}

//| x1 * x2 | +| y1 * y2 | +| z1 * z2 |
float Vector3::AbsDot(const Vector3& v) const 
{
    return fabs(x * v.x) + fabs(y * v.y) + fabs(z * v.z);
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

Vector3 Vector3::Cross(const Vector3& v) const
{
    return crossProduct(*this, v);
}

bool Vector3::IsParallel(const Vector3& v) const
{
    return vf_equal_real(this->x * v.y, this->y * v.x)
        && vf_equal_real(this->y * v.z, this->z * v.y)
        && vf_equal_real(this->x * v.z, this->z * v.x);
}

