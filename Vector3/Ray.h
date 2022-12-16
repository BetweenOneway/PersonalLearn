#pragma once
#include "Vector3.h"

class Ray
{
public:
    Ray() :origin({ 0.0f,0.0f,0.0f }), direction({ 0.0f,0.0f,1.0f }) {}
    Ray(const Vector3& inputOrigin, const Vector3& inputDirection) :origin(inputOrigin), direction(inputDirection) {}
    float GetUnitsLenth(const Vector3& point) const;
private:
    Vector3 origin;
    Vector3 direction;
};
