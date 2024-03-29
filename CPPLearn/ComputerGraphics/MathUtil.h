#pragma once
#include <math.h>

const float kPi = 3.1415926f;
const float k2Pi = kPi * 2.0f;
const float kPiOver2 = kPi / 2.0f;

float safeAcos(float x);
void sinCos(float& returnSin, float& returnCos, float theta);

