#include <iostream>
using namespace std;
#include "testVectorMatrix.h"
#include "Matrix3x3.h"

void printVector(const Vector3& toPrint)
{
    cout << "(" << toPrint.getX() << "," << toPrint.getY() << "," << toPrint.getZ() << ")" << endl;
}

void printMatrix3x3(Matrix3x3& toPrint)
{

}

void testVectorAddAndNormal()
{
    Vector3 result = (Vector3{ -1,1,0 } + Vector3{ 0,1,0 } + Vector3{ 1,1,0 });
    result.normalize();
    printVector(result);
}
//测试切变
void testShear()
{
    Vector3 a(10, 20, 30);
    Matrix3x3 m;

    m.SetupShear(1, 1, 2);
    Vector3 b = a * m;
    printVector(b);
}

void testReflect()
{
    Matrix3x3 m;
    Vector3 a(10, 20, 30);

    m.SetupReflect(1);
    Vector3 b = a * m;
    printVector(b);

    //垂直于XY平面的向量
    Vector3 n(0, 0, 1);
    m.SetupReflect(n);
    b = a * m;

}

void testScale()
{
    Vector3 a(10, 20, 30);
    Matrix3x3 m;
    //X轴放大一倍；Y轴放大2倍；Z轴放大3倍
    Vector3 s(1, 2, 3);
    m.SetupScale(s);
    Vector3 b = a * m;
    printVector(b);
}

void testProject()
{
    //投影到XY平面
    //垂直于XY平面的向量
    Vector3 n(0, 0, 1);
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

//求两个向量的夹角的时候，两个向量是不是单位向量对结果没有影响
void testDotCross()
{
    Vector3 dir1(4, 2, 0);
    Vector3 dir2(0, 2, 0);
    cout << "dot = " << dir1 * dir2 << endl;//4
    cout << "Cross product m:" << vectorMag(crossProduct(dir1, dir2)) << endl;//8

    dir1 = Vector3(1, 0, 0);
    dir2 = Vector3(0, -1, 0);
    float dot = dir1 * dir2;
    double theta = dot / (vectorMag(dir1) * vectorMag(dir2));
    double theta1 = acos(theta) * 180.f / kPi;
    cout << theta1 << endl;//90

    dir1 = Vector3(2, 0, 0);
    dir2 = Vector3(0, -4, 0);
    float dot2 = dir1 * dir2;
    theta = dot2 / (vectorMag(dir1) * vectorMag(dir2));
    theta1 = acos(theta) * 180.f / kPi;
    cout << theta1 << endl;//90
}

void testCrossProduct()
{
    Vector3 dir1(1, 0, 0);
    Vector3 dir2(0, -1, 0);
    Vector3 result1 = crossProduct(dir1, dir2);
    float mag1 = vectorMag(result1);
    Vector3 result2 = crossProduct(dir2, dir1);
    float mag2 = vectorMag(result2);
    cout << "mag1=" << mag1 << ";mag2=" << mag2 << endl;

}

