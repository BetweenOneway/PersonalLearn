#pragma once
#include "Vector3.h"

constexpr float VF_EPS = 0.0001f;
constexpr float VF_EPS_2 = 0.000001f;
//inline bool ApproZero( float r ) { return r > -VF_EPS && r < VF_EPS ; } // 是否约等于零
inline constexpr bool vf_appro_zero(float r, float dThreshold = VF_EPS) { return r >= -dThreshold && r <= dThreshold; } // 是否约等于零

inline constexpr bool vf_appro_zero_2(float  r) { return vf_appro_zero(r, VF_EPS_2); } // 是否约等于零

inline constexpr bool vf_equal_real(float r1, float r2, float dThreshold = VF_EPS) { return vf_appro_zero(r1 - r2, dThreshold); }


