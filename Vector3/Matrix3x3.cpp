#include "Matrix3x3.h"
#include "MathUtil.h"
#include <assert.h>

void Matrix3x3::SetupReflect(Vector3& n)
{
	assert(fabs(n*n-1.0f)<0.01f);
	float ax = -2.0f*n.getX();
	float ay = -2.0f*n.getY();
	float az = -2.0f*n.getZ();
}

void Matrix3x3::SetupReflect(int axis)
{
	switch (axis)
	{
	case 1:
		m11 = -1.0f; m12 = 0.0f; m13 = 0.0f;
		m21 = 0.0f; m22 = 1.0f; m23 = 0.0f;
		m31 = 0.0f; m32 = 0.0f; m33 = 1.0f;
		break;
	case 2:
		m11 = 1.0f; m12 = 0.0f; m13 = 0.0f;
		m21 = 0.0f; m22 = -1.0f; m23 = 0.0f;
		m31 = 0.0f; m32 = 0.0f; m33 = 1.0f;
		break;
	case 3:
		m11 = 1.0f; m12 = 0.0f; m13 = 0.0f;
		m21 = 0.0f; m22 = 1.0f; m23 = 0.0f;
		m31 = 0.0f; m32 = 0.0f; m33 = -1.0f;
		break;
	}
}

//n垂直于投影平面的向量
void Matrix3x3::SetupProject(Vector3& n)
{
	assert(fabs(n*n-1.0f)<0.01);
	m11 = 1.0f - n.getX()*n.getX();
	m22 = 1.0f - n.getY()*n.getY();
	m33 = 1.0f - n.getZ()*n.getZ();

	m12 = m21 = -n.getX()*n.getY();
	m13 = m31 = -n.getX()*n.getZ();
	m23 = m32 = -n.getY()*n.getZ();
}

/*生成沿XYZ轴的缩放矩阵
s中保存的是三个轴的缩放系数  
*/
void Matrix3x3::SetupScale(const Vector3& s)
{
	m11 = s.getX(); m12 = 0.0f; m13 = 0.0f;
	m21 = 0.0f; m22 = s.getY(); m23 = 0.0f;
	m31 = 0.0f; m32 = 0.0f; m33 = s.getZ();
}

/*生成旋转矩阵
*  axis表示绕哪个轴旋转 1:x;2:y;3:z
* theta表示弧度
*/
void Matrix3x3::setRotate(int axis, float theta)
{
	float s, c;
	sinCos(s, c, theta);
    switch (axis)
    {
    case 1:
        m11 = 1.0f; m12 = 0.0f; m13 = 0.0f;
        m21 = 0.0f; m22 = c; m23 = s;
        m31 = 0.0f; m32 = -s; m33 = c;
        break;
    case 2:
        m11 = c; m12 = 0.0f; m13 = -s;
        m21 = 0.0f; m22 = 1.0f; m23 = 0.0f;
        m31 = s; m32 = 0.0f; m33 = c;
        break;
    case 3:
        m11 = c; m12 = s; m13 = 0.0f;
        m21 = -s; m22 = c; m23 = 0.0f;
        m31 = 0.0f; m32 = 0.0f; m33 = 1.0f;
        break;
    }
}

Matrix3x3 operator*(const Matrix3x3& loper,const Matrix3x3& roper)
{
	Matrix3x3 r;
	r.m11 = loper.m11*roper.m11 + loper.m12*roper.m21 + loper.m13*roper.m31;
	r.m12 = loper.m11*roper.m12 + loper.m12*roper.m22 + loper.m13*roper.m32;
	r.m13 = loper.m11*roper.m13 + loper.m12*roper.m23 + loper.m13*roper.m33;

	r.m21 = loper.m21*roper.m11 + loper.m22*roper.m21 + loper.m23*roper.m31;
	r.m22 = loper.m21*roper.m12 + loper.m22*roper.m22 + loper.m23*roper.m32;
	r.m23 = loper.m21*roper.m13 + loper.m22*roper.m23 + loper.m23*roper.m33;

	r.m31 = loper.m31*roper.m11 + loper.m32*roper.m21 + loper.m33*roper.m31;
	r.m32 = loper.m31*roper.m12 + loper.m32*roper.m22 + loper.m33*roper.m32;
	r.m33 = loper.m31*roper.m13 + loper.m32*roper.m23 + loper.m33*roper.m33;

	return r;
}

Matrix3x3& operator*=(Matrix3x3& loper, const Matrix3x3& roper)
{
	loper = loper*roper;
	return loper;
}

//行向量要左乘 vABC
Vector3 operator*(Vector3& loper, const Matrix3x3& roper)
{
	return Vector3(
		loper.getX()*roper.m11 + loper.getY()*roper.m21+loper.getZ()*roper.m31,
		loper.getX()*roper.m12 + loper.getY()*roper.m22 + loper.getZ()*roper.m32,
		loper.getX()*roper.m13 + loper.getY()*roper.m23 + loper.getZ()*roper.m33
	);
}

Vector3 operator*=(Vector3& loper, const Matrix3x3& roper)
{
	loper = loper*roper;
	return loper;
}

//列向量要右乘 CBAv
Vector3 operator*(const Matrix3x3& loper,Vector3& roper)
{
	return Vector3(
		loper.m11*roper.getX() + loper.m12*roper.getY() + loper.m13*roper.getZ(),
		loper.m21*roper.getX() + loper.m22*roper.getY() + loper.m23*roper.getZ(),
		loper.m31*roper.getX() + loper.m32*roper.getY() + loper.m33*roper.getZ()
		);
}
