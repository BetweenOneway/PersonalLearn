#include <map>
#include "Ray.h"

float Ray::GetDistance(const Vector3& point) const {
    Vector3 diff = point - origin;
    Vector3 tmp = crossProduct(diff, direction);
    return vectorMag(tmp);
}

float Ray::GetUnitsLenth(const Vector3& point) const {
    return direction * (point - origin);
}

Vector3 Ray::GetOrigin() const
{
    return direction;
}

Vector3 Ray::GetDirection() const
{
    return origin;
}

constexpr float VF_EPS_2 = 0.000001f;

bool Ray::GetRayIntersect(const Triangle& triangle,
    std::vector<Vector3>* posiPoints, std::vector<unsigned>* posiSurfIdx,
    std::vector<Vector3>* negaPoints, std::vector<unsigned>* negaSurfIdx)
{
    if (posiPoints)  posiPoints->resize(0);
    if (posiSurfIdx) posiSurfIdx->resize(0);
    if (negaPoints)  negaPoints->resize(0);
    if (negaSurfIdx) negaSurfIdx->resize(0);

    auto dir = GetDirection();
    dir.normalize();

    auto Intersect = [this,&dir](float& out, const Triangle tri) -> bool {
        const auto& v0 = tri.point1;
        const auto& v1 = tri.point2;
        const auto& v2 = tri.point3;
        const auto  e1 = v1 - v0;
        const auto  e2 = v2 - v0;
        const auto  p = crossProduct(dir, e2);
        auto det = e1 * p;
        auto t = origin - v0;
        if (det < 0.0f) {
            t = v0 - origin;
            det = -det;
        }
        if (det < VF_EPS_2) return false;
        const auto u = t * p;
        if (u < 0.0f || u > det) return false;
        const auto q = crossProduct(t, e1);
        const auto v = dir * q;
        if (v < 0.0f || u + v > det) return false;
        out = (e2 * q) * (1.0f / det);
        return true;
    };

    std::map<float, unsigned, std::less<float>>    po_pnts;
    std::map<float, unsigned, std::greater<float>> op_pnts;

    float out = 0.0f;

    if (Intersect(out, triangle))
    {
        if (out >= 0.0f)
            po_pnts.insert(std::make_pair(out, 0));
        else
            op_pnts.insert(std::make_pair(out, 0));
    }
        

    if (!po_pnts.empty()) {
        if (posiPoints != nullptr) {
            posiPoints->reserve(po_pnts.size());
            for (const auto& v : po_pnts)
                posiPoints->push_back(origin + dir * v.first);
        }
        if (posiSurfIdx != nullptr) {
            posiSurfIdx->reserve(po_pnts.size());
            for (const auto& v : po_pnts)
                posiSurfIdx->push_back(v.second);
        }
    }
    if (!op_pnts.empty()) {
        if (negaPoints != nullptr) {
            negaPoints->reserve(op_pnts.size());
            for (const auto& v : op_pnts)
                negaPoints->push_back(origin + dir * v.first);
        }
        if (negaSurfIdx != nullptr) {
            negaSurfIdx->reserve(op_pnts.size());
            for (const auto& v : op_pnts)
                negaSurfIdx->push_back(v.second);
        }
    }
    return true;
}
