#include <iostream>
using namespace std;
#include "Matrix3x3.h"

void printVector(const Vector3& toPrint)
{
    cout << toPrint.getX() << toPrint.getY() << toPrint.getZ() << endl;
}
void printMatrix3x3(Matrix3x3& toPrint)
{

}

void testReflect()
{
	Matrix3x3 m;
	Vector3 a(10, 20, 30);

	m.SetupReflect(1);
	Vector3 b = a*m;
	printVector(b);

	//垂直于XY平面的向量
	Vector3 n(0,0,1);
	m.SetupReflect(n);
}

void testScale()
{
	Vector3 a(10, 20, 30);
	Matrix3x3 m;
	//X轴放大一倍；Y轴放大2倍；Z轴放大3倍
	Vector3 s(1, 2, 3);
	m.SetupScale(s);
	Vector3 b = a*m;
	printVector(b);
}

void testProject()
{
	//投影到XY平面
	//垂直于XY平面的向量
	Vector3 n(0,0,1);
	Matrix3x3 m;
	m.SetupProject(n);
}
void testRotate()
{
    Vector3 a(10, 0, 0), b;
    Matrix3x3 M;
    //绕Z轴旋转90°  
    M.setRotate(3, kPiOver2);
    b = a * M;
    printVector(b);

    //绕Z轴旋转180°
    M.setRotate(3, kPi);
    b = a * M;
    printVector(b);
}
int main()
{
    return 0;
}
