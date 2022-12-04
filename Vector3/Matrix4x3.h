#pragma once
#include "Matrix3x3.h"
class Matrix4x3
{
public:
	void zeroTranslation();
	void setTranslation(const Vector3 &d);
	void setupTranslation(const Vector3& d);
	Vector3 getTranslation();

	//axis = 1 X�� axis = 2 Y�� axis = 3 Z��
	//theta rotate degree
	void setRotate(int axis, float theta);
	void SetupScale(const Vector3& vec);
	//n��ֱ��ͶӰƽ��(����ԭ��)������
	void SetupProject(Vector3& n);
	//���ñ�׼��ľ���
	void SetupReflect(int axis,int k);
	//nΪ��ֱ�ھ���ƽ�������
	void SetupReflect(Vector3& n);
	//axisָ�����ᣬs&t��ʾ�б����
	void SetupShear(int axis, float s, float t);
	//���������ʽ
	float determinant();
	//����������
	Matrix3x3 inverse();

	Matrix3x3& getMatrix3x3();
private:
	Matrix3x3 M3x3;
	float tx, ty, tz;

};

Matrix4x3 operator*(const Matrix4x3& loper, const Matrix4x3& roper);