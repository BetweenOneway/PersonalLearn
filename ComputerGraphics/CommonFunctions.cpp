#include "CommonFunctions.h"

namespace COMMON_FUNCTIONS {
    bool PMIntersectTri(float& t, const Ray& ray, const Vector3& v0, const Vector3& v1, const Vector3& v2)
    {
        float u, v;
        const Vector3& orig = ray.GetOrigin();
        const Vector3& dir = ray.GetDirection();
        // E1
        Vector3 E1 = v1 - v0;
        // E2
        Vector3 E2 = v2 - v0;
        // P
        Vector3 P = dir.Cross(E2);
        // determinant
        float det = E1*(P);
        // keep det > 0, modify T accordingly
        Vector3 T;
        if (det > 0)
            T = ray.GetOrigin() - v0;
        else
        {
            T = v0 - orig;
            det = -det;
        }

        // If determinant is near zero, ray lies in plane of triangle
        if (det < 0.000001f)
            return false;

        // Calculate u and make sure u <= 1
        u = T*(P);
        if (u < -0.000001f || u > det + 0.000001f)
            return false;
        // Q
        Vector3 Q = T.Cross(E1);
        // Calculate v and make sure u + v <= 1
        v = dir*(Q);
        if (v < -0.000001f || u + v > det + 0.000001f)
            return false;

        // Calculate t, scale parameters, ray intersects triangle
        t = E2*(Q);
        float fInvDet = 1.0f / det;
        t *= fInvDet;
        u *= fInvDet;
        v *= fInvDet;

        return true;
    }
}
