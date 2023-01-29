#pragma once

#include "Point.h"

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
