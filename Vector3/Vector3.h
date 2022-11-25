#pragma once
class Vector3
{
public:
    Vector3();
    Vector3(const Vector3& src) :x(src.x), y(src.y), z(src.z) {};
    Vector3(float nx, float ny, float nz) :x(nx), y(ny), z(nz) {}
    void Clear();
    friend float vectorMag(const Vector3& a);
    friend Vector3 operator*(float k, const Vector3& v);
    Vector3 operator-()const { return Vector3(-x, -y, -z); }
    Vector3 operator*(float a) const;
    Vector3 operator*=(float a);
    Vector3 operator/(float a) const;
    Vector3 operator*(float a);
    Vector3 operator+(const Vector3& loper) const;
    Vector3 operator+=(const Vector3& loper);
    Vector3 operator-(const Vector3& roper) const;
    Vector3 operator-=(const Vector3& loper);
    void normalize();
private:
    float x, y, z;
};
