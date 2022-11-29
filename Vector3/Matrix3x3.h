#pragma once
#include "Vector3.h"

class Matrix3x3
{
public:
	float m11, m12, m13;
	float m21, m22, m23;
	float m31, m32, m33;

	//axis = 1 X÷· axis = 2 Y÷· axis = 3 Z÷·
	//theta rotate degree
	void setRotate(int axis, float theta);
};