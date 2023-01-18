#pragma once
//#include "position.h"

typedef struct tagPosition
{
    double  x;
    double  y;
    tagPosition(double _x, double _y) { x = _x; y = _y; }
    tagPosition() {};
    bool operator==(const tagPosition& pt) { return (x == pt.x && y == pt.y); }
} CPosition2D;

typedef struct tagPosition3D
{
    double  x;
    double  y;
    double z;
    tagPosition3D(double _x, double _y, double __z = 0.0f)
    {
        x = _x;
        y = _y;
        z = __z;
    }
    tagPosition3D(const CPosition2D& p2D)
    {
        x = p2D.x;
        y = p2D.y;
        z = 0.0f;
    }
    tagPosition3D(const CPosition2D* p2D)
    {
        x = p2D->x;
        y = p2D->y;
        z = 0.0f;
    }
    tagPosition3D() {};
    bool operator==(const tagPosition3D& pt) {
        return (x == pt.x && y == pt.y && z==pt.z);
    }
} CPosition3D;

class CBSpline
{
public:
    CBSpline(void);
    ~CBSpline(void);

    void TwoOrderBSplineSmooth(CPosition3D* pt, int Num);
    void TwoOrderBSplineInterpolatePt(CPosition3D*& pt, int& Num, int* InsertNum);
    double F02(double t);
    double F12(double t);
    double F22(double t);

    void ThreeOrderBSplineSmooth(CPosition3D* pt, int Num);
    void ThreeOrderBSplineInterpolatePt(CPosition3D*& pt, int& Num, int* InsertNum);
    double F03(double t);
    double F13(double t);
    double F23(double t);
    double F33(double t);
};
