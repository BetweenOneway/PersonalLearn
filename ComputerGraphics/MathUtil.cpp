#include "MathUtil.h"

float safeAcos(float x)
{
    if (x <= -1.0f)
    {
        return kPi;
    }
    if (x >= 1.0f)
    {
        return 0.0f;
    }
    return acos(x);
}

void sinCos(float& returnSin, float& returnCos, float theta)
{
    returnSin = sin(theta);
    returnCos = cos(theta);
}
