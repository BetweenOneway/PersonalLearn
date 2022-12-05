#pragma once
#include "Vector3.h"
class RotationMatrix
{
public:
	float m11, m12, m13;
	float m21, m22, m23;
	float m31, m32, m33;

	//初始化成单位矩阵
	void identity();

	//将向量从惯性坐标系转到物体坐标系
	Vector3 inertialToObject(const Vector3& v)const;
	//物体坐标系转到惯性坐标系
};