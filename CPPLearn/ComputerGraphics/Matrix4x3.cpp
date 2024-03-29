#include "Matrix4x3.h"

Matrix3x3& Matrix4x3::getMatrix3x3()
{
	return M3x3;
}
Matrix4x3 operator*(const Matrix4x3& loper, const Matrix4x3& roper)
{
	//loper.tx*roper.m11;
    return Matrix4x3();
}
void Matrix4x3::zeroTranslation()
{
	tx = ty = tz = 0.0f;
}

void Matrix4x3::setTranslation(const Vector3 &d)
{
	tx = d.getX();
	ty = d.getY();
	tz = d.getZ();
}

void Matrix4x3::setupTranslation(const Vector3& d)
{
	M3x3.m11 = 1.0f;
	M3x3.m12 = 0.0f;
	M3x3.m13 = 0.0f;

	M3x3.m21 = 0.0f;
	M3x3.m22 = 1.0f;
	M3x3.m23 = 0.0f;

	M3x3.m31 = 0.0f;
	M3x3.m32 = 0.0f;
	M3x3.m33 = 1.0f;

	tx = d.getX();
	ty = d.getY();
	tz = d.getZ();
}

Vector3 Matrix4x3::getTranslation()
{
	return Vector3(tx, ty, tz);
} 

//axis = 1 X轴 axis = 2 Y轴 axis = 3 Z轴
//theta rotate degree
void Matrix4x3::setRotate(int axis, float theta)
{
	M3x3.setRotate(axis, theta);
	tx = ty = tz = 0.0f;
}

void Matrix4x3::SetupScale(const Vector3& vec)
{
	M3x3.SetupScale(vec);
	tx = ty = tz = 0.0f;
}

//n垂直于投影平面(经过原点)的向量
void Matrix4x3::SetupProject(Vector3& n)
{
	M3x3.SetupProject(n);
	tx = ty = tz = 0.0f;
}

//设置x/y/z=k平面的镜像
void Matrix4x3::SetupReflect(int axis,int k)
{
	M3x3.SetupReflect(axis);
	switch (axis)
	{
	case 1:
		tx = 2.0f * k;
		ty = 0.0f;
		tz = 0.0f;
		break;
	case 2:
		tx = 0.0f;
		ty = 2.0f * k;
		tz = 0.0f;
		break;
	case 3:
		tx = 0.0f;
		ty = 0.0f;
		tz = 2.0f * k;
		break;
	}
}
//n为垂直于镜像平面的向量
void Matrix4x3::SetupReflect(Vector3& n)
{
	M3x3.SetupReflect(n);
	tx = ty = tz = 0.0f;
}
//axis指坐标轴，s&t表示切变幅度
void Matrix4x3::SetupShear(int axis, float s, float t)
{
	M3x3.SetupShear(axis, s, t);
	tx = ty = tz = 0.0f;
}
//求矩阵行列式
float determinant();
//计算矩阵的逆
Matrix3x3 inverse();
