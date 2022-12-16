#include "Ray.h"

float Ray::GetUnitsLenth(const Vector3& point) const {
    return direction * (point - origin);
}
