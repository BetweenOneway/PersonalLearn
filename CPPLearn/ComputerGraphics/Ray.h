#pragma once
#include "Vector3.h"
#include "Triangle.h"

class Ray
{
public:
    Ray() :origin({ 0.0f,0.0f,0.0f }), direction({ 0.0f,0.0f,1.0f }) {}
    Ray(const Vector3& inputOrigin, const Vector3& inputDirection) :origin(inputOrigin), direction(inputDirection) {}
    float GetUnitsLenth(const Vector3& point) const;
    float GetDistance(const Vector3& point) const;
    
    Vector3 GetOrigin() const;
    Vector3 GetDirection() const;
    Vector3 GetPoint(float t) const;
    //点point投影到射线上
    Vector3 ProjectPoint(const Vector3& point) const;
    //点point投影到与射线垂直的射线上
    Vector3 VerticalVector(const Vector3& point) const;
    bool GetRayIntersect(const Triangle& triangle,
    std::vector<Vector3>* posiPoints, std::vector<unsigned>* posiSurfIdx,
    std::vector<Vector3>* negaPoints, std::vector<unsigned>* negaSurfIdx);
private:
    Vector3 origin;
    Vector3 direction;
};
