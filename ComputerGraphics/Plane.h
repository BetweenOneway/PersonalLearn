#pragma once

#include "Vector3.h"
/** \addtogroup Core
*  @{
*/
/** \addtogroup Math
*  @{
*/
/** Defines a plane in 3D space.
@remarks
A plane is defined in 3D space by the equation
Ax + By + Cz + D = 0
@par
This equates to a vector (the normal of the plane, whose x, y
and z components equate to the coefficients A, B and C
respectively), and a constant (D) which is the distance along
the normal you have to go to move the plane back to the origin.
*/

struct VFLine;

class Plane
{
public:
    /** Default constructor - sets everything to 0.
    */
    Plane();
    Plane(const Plane& rhs);
    /** Construct a plane through a normal, and a distance to move the plane along the normal.*/
    Plane(const Vector3& rkNormal, float fConstant);
    /** Construct a plane using the 4 constants directly **/
    Plane(float a, float b, float c, float d);
    Plane(const Vector3& rkNormal, const Vector3& rkPoint);
    Plane(const Vector3& rkPoint0, const Vector3& rkPoint1, const Vector3& rkPoint2);

    /** The "positive side" of the plane is the half space to which the
    plane normal points. The "negative side" is the other half
    space. The flag "no side" indicates the plane itself.
    */
    enum Side
    {
        NO_SIDE,
        POSITIVE_SIDE,
        NEGATIVE_SIDE,
        BOTH_SIDE
    };

public:
    Side getSide(const Vector3& rkPoint) const;

    /** Returns which side of the plane that the given box lies on.
    The box is defined as centre/half-size pairs for effectively.
    @param centre The centre of the box.
    @param halfSize The half-size of the box.
    @returns
    POSITIVE_SIDE if the box complete lies on the "positive side" of the plane,
    NEGATIVE_SIDE if the box complete lies on the "negative side" of the plane,
    and BOTH_SIDE if the box intersects the plane.
    */
    Side getSide(const Vector3& centre, const Vector3& halfSize) const;

    /** This is a pseudodistance. The sign of the return value is
    positive if the point is on the positive side of the plane,
    negative if the point is on the negative side, and zero if the
    point is on the plane.
    @par
    The absolute value of the return value is the true distance only
    when the plane normal is a unit length vector.
    */
    float getDistance(const Vector3& rkPoint) const;

    float getAbsDistance(const Vector3& rkPoint) const;

    /** Redefine this plane based on 3 points. */
    void redefine(const Vector3& rkPoint0, const Vector3& rkPoint1,
        const Vector3& rkPoint2);

    /** Redefine this plane based on a normal and a point. */
    void redefine(const Vector3& rkNormal, const Vector3& rkPoint);

    Vector3 projectPoint(const Vector3& p) const;
    void projectPoints(std::vector<Vector3>& points) const;
    void projectArc(const std::vector<Vector3>& arc, std::vector<Vector3>& projectArc) const;
    //获取镜像点
    Vector3 mirrorPoint(const Vector3& p) const;

    /// Comparison operator
    bool operator==(const Plane& rhs) const
    {
        return (rhs.d == d && rhs.normal == normal);
    }
    bool operator!=(const Plane& rhs) const
    {
        return (rhs.d != d && rhs.normal != normal);
    }

    /** Normalises the plane.
    @remarks
    This method normalises the plane's normal and the length scale of d
    is as well.
    @note
    This function will not crash for zero-sized vectors, but there
    will be no changes made to their components.
    @returns The previous length of the plane's normal.
    */
    float normalise(void);

    //获取坐标系原点到平面的投影点
    Vector3 origin() const;

    //获取构建平面时的初始位置点
    Vector3 position() const;

    //点是否在平面上
    bool isOn(const Vector3& p) const;

    //曲面顶点是否都在平面上
    bool isOn(const std::vector<Vector3>& arc) const;

    //曲线是否平行于平面(在平面上视为平行)
    bool isParallel(const std::vector<Vector3>& arc) const;

    //点集合是否在同一侧, 如果同时在平面上,视为在同一侧
    bool isSameSide(const std::vector<Vector3>& points) const;

    //是否和向量平行
    bool isParallel(const Vector3& vec) const;

    //是否和平面平行(如果重合视为平行)
    bool isParallel(const Plane& plane) const;

    //是否和平面垂直
    bool isVertical(const Plane& plane) const;

public:
    Vector3 normal;
    float    d;	            // d: 表示原点到平面的距离，正负号表示过原点O的法线，和平面的交点V，
                            //	  如果向量 dir = O-V 和法线方向一致，则d的符号是正号；否则d的符号为负，即d是负数。
    Vector3 pos;             // 记录点法式平面的位置点     
};

