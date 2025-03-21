﻿#pragma once
#include "Vector3.h"
#include "MathUtil.h"

#ifndef __MATRIX3x3_H__
#define __MATRIX3x3_H__


class Matrix3x3
{
public:
	float m11, m12, m13;
	float m21, m22, m23;
	float m31, m32, m33;

	//axis = 1 X轴 axis = 2 Y轴 axis = 3 Z轴
	//theta rotate degree
	void setRotate(int axis, float theta);
	void SetupScale(const Vector3& vec);
	//n垂直于投影平面(经过原点)的向量
	void SetupProject(Vector3& n);
	//设置标准轴的镜像
	void SetupReflect(int axis);
	//n为垂直于镜像平面的向量
	void SetupReflect(Vector3& n);
	//axis指坐标轴，s&t表示切变幅度
	void SetupShear(int axis,float s,float t);
	//求矩阵行列式
	float determinant();
	//计算矩阵的逆
	Matrix3x3 inverse();
};
Matrix3x3 operator*(const Matrix3x3& loper, const Matrix3x3& roper);
Matrix3x3& operator*=(Matrix3x3& loper, const Matrix3x3& roper);
Vector3 operator*(Vector3& loper, const Matrix3x3& roper);
Vector3 operator*(const Matrix3x3& loper, Vector3& roper);

#endif
