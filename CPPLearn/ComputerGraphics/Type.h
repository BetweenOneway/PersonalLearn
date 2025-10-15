#pragma once
template< class T >
struct VNVector3
{
    T  x;
    T  y;
    T  z;
    VNVector3() {}
    VNVector3(T ix, T iy, T iz) : x(ix), y(iy), z(iz) {}
    const T& operator[](unsigned i) const { return  ((T*)(&x))[i]; }
    T& operator[](unsigned i) { return  ((T*)(&x))[i]; }
    const T* Ptr() const { return &x; }
    T* Ptr() { return &x; }

    VNVector3< T > operator +(const VNVector3< T >& v) const { return VNVector3< T >(x + v.x, y + v.y, z + v.z); }
    VNVector3< T > operator -(const VNVector3< T >& v) const { return VNVector3< T >(x - v.x, y - v.y, z - v.z); }
    VNVector3< T > operator +() const { return *this; };
    VNVector3< T > operator -() const { return VNVector3< T >(-x, -y, -z); }
    VNVector3< T > operator *(T v) const { return VNVector3< T >(x * v, y * v, z * v); }
    VNVector3< T > operator /(T v) const { return VNVector3< T >(x / v, y / v, z / v); }

    bool operator==(const VNVector3<T>& src) const { return x == src.x && y == src.y && z == src.z; }
    bool operator!=(const VNVector3<T>& src) const { return x != src.x || y != src.y || z != src.z; }
};

typedef VNVector3< unsigned int> Surf;
