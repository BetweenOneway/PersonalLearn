#include <iostream>
using namespace std;
#include "Matrix3x3.h"
#include "Ray.h"

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

void testDotCross()
{
    Vector3 dir1(4, 2, 0);
    Vector3 dir2(0, 2, 0);
    cout << "dot = " << dir1 * dir2 << endl;
    cout << "Cross product m:" << vectorMag(crossProduct(dir1, dir2)) << endl;

    dir1 = Vector3(1, 0, 0);
    dir2 = Vector3(0, -1, 0);
    float dot = dir1 * dir2;
    double theta = dot / (vectorMag(dir1) * vectorMag(dir2));
    double theta1 = acos(theta) * 180.f / kPi;
    cout << theta1 << endl;

    float dot2 = dir1 * dir2;
    theta = dot2 / (vectorMag(dir1) * vectorMag(dir2));
    theta1 = acos(theta) * 180.f / kPi;
    cout << theta1 << endl;
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

void testRay()
{
    Ray ray({ 3.0f,4.0f,5.0f }, { 0.0f,0.0f,-1.0f });
    Vector3 postiveDot(1.0f, 2.0f, 8.0f);
    Vector3 negativeDot(1.0f, 1.0f, -3.0f);
    cout << ray.GetUnitsLenth(postiveDot) << endl;
    cout << ray.GetUnitsLenth(negativeDot) << endl;
}

void testRay2()
{
    //Ray ray({31.6467190f,-29.206f,8.6169f}, {0.9826f,0.1853f,-0.0f});
    //Vector3 postiveDot(37.5767f, -27.4426f, 6.01461f);
    //Vector3 negativeDot(26.552f,-31.056f,10.0874f);
    ////>0
    //cout << ray.GetUnitsLenth(postiveDot) << endl;
    ////<0
    //cout << ray.GetUnitsLenth(negativeDot) << endl;

   /* Ray ray({-15.6635f,0.9091f,10.746f}, {0.6884f,-0.30377f,0.6587f});
    Vector3 dot(0.0f, 0.0f, 0.0f);
    cout << ray.GetUnitsLenth(dot) << endl;*/

    Ray ray({ 0.7178,11.6021,1.5157 }, { 0.3230,0.9317,1.5157 });
    Vector3 dot(0.0f, 0.0f, 0.0f);

    cout << ray.GetUnitsLenth(dot) << endl;

    Vector3 dot1(0.0f, 15.0f, 0.0f);
    cout << ray.GetUnitsLenth(dot1) << endl;
}

void testRayIntersect()
{
    Ray ray({ 0.0f,0.0f,0.0f }, { 1.0f,0.0f,0.0f });
    std::vector<Vector3> posiPoints;
    std::vector<unsigned> posiSurfIdx;
    std::vector<Vector3> negaPoints;
    std::vector<unsigned> negaSurfIdx;
    ray.GetRayIntersect({ {0.0f,3.0f,0.0f},{-3.0f,-2.0f,0.0f},{3.0f,-2.0f,0.0f} }, &posiPoints, &posiSurfIdx, &negaPoints, &negaSurfIdx);

    if (posiPoints.empty())
    {

    }
}
