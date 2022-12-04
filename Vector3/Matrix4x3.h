#pragma once
#include "Matrix3x3.h"
class Matrix4x3
{
public:
	void zeroTranslation();
	void setTranslation(const Vector3 &d);
	void setupTranslation(const Vector3& d);
	Vector3 getTranslation();

	//axis = 1 X轴 axis = 2 Y轴 axis = 3 Z轴
	//theta rotate degree
	void setRotate(int axis, float theta);
	void SetupScale(const Vector3& vec);
	//n垂直于投影平面(经过原点)的向量
	void SetupProject(Vector3& n);
	//设置标准轴的镜像
	void SetupReflect(int axis,int k);
	//n为垂直于镜像平面的向量
	void SetupReflect(Vector3& n);
	//axis指坐标轴，s&t表示切变幅度
	void SetupShear(int axis, float s, float t);
	//求矩阵行列式
	float determinant();
	//计算矩阵的逆
	Matrix3x3 inverse();

	Matrix3x3& getMatrix3x3();
private:
	Matrix3x3 M3x3;
	float tx, ty, tz;

};

Matrix4x3 operator*(const Matrix4x3& loper, const Matrix4x3& roper);