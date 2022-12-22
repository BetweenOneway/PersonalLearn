#include <iostream>
using namespace std;
#include "Matrix3x3.h"
#include "Ray.h"

void printVector(const Vector3& toPrint)
{
    cout << toPrint.getX() << toPrint.getY() << toPrint.getZ() << endl;
}

void printMatrix3x3(Matrix3x3& toPrint)
{

}

//测试切变
void testShear()
{
	Vector3 a(10, 20, 30);
	Matrix3x3 m;

	m.SetupShear(1, 1, 2);
	Vector3 b = a*m;
	printVector(b);
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
	b = a*m;

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

void testDeterminant()
{
	Matrix3x3 m;
	float detM = m.determinant();

}

void testDotCross()
{
    Vector3 dir1(4,2, 0);
    Vector3 dir2(0,2,0);
    cout << "dot = "<<dir1 * dir2 << endl;
    cout << "Cross product m:" << vectorMag(crossProduct(dir1, dir2)) << endl;;
}

void testRay()
{
    Ray ray({3.0f,4.0f,5.0f} ,{0.0f,0.0f,-1.0f});
    Vector3 postiveDot(1.0f, 2.0f, 8.0f);
    Vector3 negativeDot(1.0f, 1.0f, -3.0f);
    cout << ray.GetUnitsLenth(postiveDot) << endl;
    cout << ray.GetUnitsLenth(negativeDot) << endl;
}

void testRay2()
{
    Ray ray({31.6467190f,-29.206f,8.6169f}, {0.9826f,0.1853f,-0.0f});
    Vector3 postiveDot(37.5767f, -27.4426f, 6.01461f);
    Vector3 negativeDot(26.552f,-31.056f,10.0874f);
    //>0
    cout << ray.GetUnitsLenth(postiveDot) << endl;
    //<0
    cout << ray.GetUnitsLenth(negativeDot) << endl;
}

int main()
{
    testRay2();
    system("pause");
    return 0;
}
