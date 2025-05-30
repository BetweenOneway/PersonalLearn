﻿#pragma once
#include <math.h>
#include "Vector3.h"

class Quaternion
{
public:
    Quaternion() = default;
    Quaternion(float real, const Vector3& i);
    Quaternion(float _w, float _x, float _y, float _z);
    //转换成单位四元数
    void identity()
    {
        w = 1.0f;
        x = y = z = 0.0f;
    }

    //绕X轴旋转
    void setToRotateAboutX(float theta);
    //绕Y轴旋转
    void setToRotateAboutY(float theta);
    //绕Z轴旋转
    void setToRotateAboutZ(float theta);
    //绕axis轴旋转theta角度
    void setToRotateAboutAxis(const Vector3& axis,float theta);

    //从四元数提取旋转角和旋转轴
    float getRotationAngle()const;
    Vector3 getRotationAxis() const;

	Quaternion operator*(const Quaternion &a)const;
    Vector3 operator*(const Vector3& v)const;
	Quaternion& operator*=(const Quaternion &a);
	//让四元数的模等于1
	void normalize();

    static inline Quaternion FromAxisAngle(const Vector3& axis, float angle)
    {
        return Quaternion(cos(angle / 2), axis * sin(angle / 2));
    }
public:
    float w, x, y, z;
};
//单位四元数
extern const Quaternion kQuaternionIdentity;
//点乘
extern float dotProduct(Quaternion &a, const Quaternion &b);
//计算共轭
extern Quaternion conjugate(const Quaternion &q);
//计算四元数的幂
Quaternion pow(const Quaternion &q, float exponent);
