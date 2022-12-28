#pragma once
#include "Vector3.h"

class Quaternion
{
public:
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
public:
    float w, x, y, z;
};
//单位四元数
extern const Quaternion kQuaternionIdentity;
