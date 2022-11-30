#pragma once
#include "Vector3.h"

const float kPi = 3.1415926f;
const float k2Pi = kPi * 2.0f;
const float kPiOver2 = kPi / 2.0f;

class Matrix3x3
{
public:
	float m11, m12, m13;
	float m21, m22, m23;
	float m31, m32, m33;

	//axis = 1 X轴 axis = 2 Y轴 axis = 3 Z轴
	//theta rotate degree
	void setRotate(int axis, float theta);
};
Matrix3x3 operator*(const Matrix3x3& loper, const Matrix3x3& roper);
Matrix3x3& operator*=(Matrix3x3& loper, const Matrix3x3& roper);
Vector3 operator*(Vector3& loper, const Matrix3x3& roper);
Vector3 operator*(const Matrix3x3& loper, Vector3& roper);
