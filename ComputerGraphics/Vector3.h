#pragma once
#include <vector>
using namespace std;

class Vector3
{
public:
    Vector3();
    Vector3(const Vector3& src) :x(src.x), y(src.y), z(src.z) {};
    Vector3(float nx, float ny, float nz) :x(nx), y(ny), z(nz) {}
    void Clear();
    float Magnitude() const;
    friend float vectorMag(const Vector3& a);
    friend Vector3 operator*(float k, const Vector3& v);
	friend float distance(const Vector3& start,const Vector3& end);
	friend Vector3 crossProduct(const Vector3& loper, const Vector3& roper);
    Vector3 Cross(const Vector3& v) const;

    Vector3 operator-()const { return Vector3(-x, -y, -z); }
    const Vector3 operator*(const float a) const;
    Vector3 operator*=(float a);
    const Vector3 operator/(const float a) const;
    const Vector3 operator+(const Vector3& loper) const;
    Vector3 operator+=(const Vector3& loper);
    const Vector3 operator-(const Vector3& roper) const;
    Vector3 operator-=(const Vector3& loper);
    void normalize();
	float operator*(const Vector3& roper) const;
    float AbsDot(const Vector3& v) const;
    bool operator==(const Vector3& roper) const;
    bool operator!=(const Vector3& roper) const;

    bool IsParallel(const Vector3& v) const;
	float getX() const { return x; }
	float getY() const { return y; }
	float getZ() const { return z; }
public:
    //static const Vector3 ZERO;
private:
    float x, y, z;
};

//const Vector3 Vector3::ZERO = Vector3(0.0f, 0.0f, 0.0f);
