#include <math.h>
#include "Plane.h"
#include "Vector3.h"
#include "common.h"


Plane::Plane()
{
    normal = Vector3(0.0f, 0.0f, 0.0f);
    d = 0.0;
}

Plane::Plane(const Plane& rhs)
{
    normal = rhs.normal;
    d = rhs.d;
    pos = rhs.pos;
}

Plane::Plane(const Vector3 & rkNormal, float fConstant)
{
    normal = rkNormal;
    normal.normalize();
    d = -fConstant;
    pos = this->projectPoint(Vector3(0.0f,0.0f,0.0f));
}

Plane::Plane(float a, float b, float c, float _d)
    : normal(a, b, c), d(_d)
{
    normal.normalize();
    pos = this->projectPoint(Vector3(0.0f, 0.0f, 0.0f));
}

Plane::Plane(const Vector3& rkNormal, const Vector3& rkPoint)
{
    redefine(rkNormal, rkPoint);
}

Plane::Plane(const Vector3& rkPoint0, const Vector3& rkPoint1, const Vector3& rkPoint2)
{
    redefine(rkPoint0, rkPoint1, rkPoint2);
}

//计算点到平面的距离
inline float Plane::getDistance(const Vector3& rkPoint) const
{
    return normal*rkPoint + d;
}

inline float Plane::getAbsDistance(const Vector3& rkPoint) const
{
    return fabsf(getDistance(rkPoint));
}

Plane::Side Plane::getSide(const Vector3& rkPoint) const
{
    float fDistance = getDistance(rkPoint);

    if (fDistance < 0.0)
        return Plane::NEGATIVE_SIDE;

    if (fDistance > 0.0)
        return Plane::POSITIVE_SIDE;

    return Plane::NO_SIDE;
}


Plane::Side Plane::getSide(const Vector3& centre, const Vector3& halfSize) const
{
    // Calculate the distance between box centre and the plane
    float dist = getDistance(centre);

    // Calculate the maximise allows absolute distance for
    // the distance between box centre and plane
    float maxAbsDist = normal.AbsDot(halfSize);

    if (dist < -maxAbsDist)
        return Plane::NEGATIVE_SIDE;

    if (dist > +maxAbsDist)
        return Plane::POSITIVE_SIDE;

    return Plane::BOTH_SIDE;
}


float Plane::normalise(void)
{
    float fLength = normal.Magnitude();

    // Will also work for zero-sized vectors, but will change nothing
    if (fLength > 0.000001f)
    {
        float fInvLength = 1.0f / fLength;
        normal *= fInvLength;
        d *= fInvLength;
    }

    return fLength;
}

Vector3 Plane::origin() const
{
    return normal * -d;
}

Vector3 Plane::position() const
{
    return pos;
}

bool Plane::isOn(const Vector3& p) const
{
    auto dist = this->getDistance(p);
    return vf_appro_zero(dist) ? true : false;
}

bool Plane::isOn(const std::vector<Vector3>& arc) const
{
    for (const auto& p : arc)
    {
        if (!isOn(p))
            return false;
    }
    return true;
}

bool Plane::isParallel(const std::vector<Vector3>& arc) const
{
    if (!isSameSide(arc))
        return false;
    for (size_t i = 1; i < arc.size(); i++)
    {
        auto preDist = this->getDistance(arc[i - 1]);
        auto curDist = this->getDistance(arc[i]);
        if (!vf_equal_real(preDist, curDist))
            return false;
    }
    return true;
}

bool Plane::isSameSide(const std::vector<Vector3>& points) const
{
    auto org = origin();
    auto originToP = points[0] - org;
    float initDotValue = originToP*(normal);
    for (const auto& p : points)
    {
        originToP = p - org;
        auto dotVal = originToP*(normal);
        if (vf_appro_zero(initDotValue))
        {
            if (!vf_appro_zero(dotVal))
                return false;
        }
        else
        {
            if (vf_appro_zero(dotVal) || initDotValue * dotVal < 0)
                return false;
        }
    }
    return true;
}

bool Plane::isParallel(const Vector3& vec) const
{
    return vf_appro_zero(vec*(normal)) ? true : false;
}

bool Plane::isParallel(const Plane& plane) const
{
    return this->normal.IsParallel(plane.normal) ? true : false;
}

bool Plane::isVertical(const Plane& plane) const
{
    return this->isParallel(plane.normal);
}


void Plane::redefine(const Vector3& rkNormal, const Vector3& rkPoint)
{
    normal = rkNormal;
    normal.normalize();
    d = -normal *(rkPoint);
    pos = rkPoint;
}


void Plane::redefine(const Vector3& rkPoint0, const Vector3& rkPoint1,
    const Vector3& rkPoint2)
{
    Vector3 kEdge1 = rkPoint1 - rkPoint0;
    Vector3 kEdge2 = rkPoint2 - rkPoint0;
    normal = kEdge1.Cross(kEdge2);
    normal.normalize();
    d = -normal*(rkPoint0);
    pos = (rkPoint0 + rkPoint1 + rkPoint2) / 3.f;
}


Vector3 Plane::projectPoint(const Vector3& p) const
{
    Vector3 dotInPlane = -d * normal;
    Vector3 dif = dotInPlane - p;
    dif = dif*(normal) * normal;
    return p + dif;
}

void Plane::projectPoints(std::vector<Vector3>& points) const
{
    for (auto& p : points)
        p = this->projectPoint(p);
}

void Plane::projectArc(const std::vector<Vector3>& arc, std::vector<Vector3>& projectArc) const
{
    for (auto& p : arc)
    {
        projectArc.emplace_back(this->projectPoint(p));
    }
}

Vector3 Plane::mirrorPoint(const Vector3& p) const
{
    auto projectPoint = this->projectPoint(p);
    return projectPoint + (projectPoint - p);
}
