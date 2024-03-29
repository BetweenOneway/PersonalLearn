#pragma once
#include "Vector3.h"
#include "Ray.h"

namespace COMMON_FUNCTIONS {
    bool PMIntersectTri(float& t, const Ray& ray, const Vector3& v0, const Vector3& v1, const Vector3& v2);
}
