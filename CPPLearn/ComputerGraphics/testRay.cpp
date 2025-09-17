#include "testRay.h"
#include <iostream>
using namespace std;
#include "Oper3DFile.h"

void PrintRay(std::vector<Vector3>& verts, const Ray& ray) {
    for (int i = -10; i < 10; i++)
    {
        verts.push_back(ray.GetPoint(i));
    }
};

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

void testGetUnitLengthAndDistance()
{
    Ray ray({ 0.0f,0.0f,0.0f }, {1.0f,0.0f,0.0f});
    Vector3 point(2.0f, 0.0f, 0.0f);
    Vector3 point1(-2.0f, 0.0f, 0.0f);
    Vector3 point2(-3.0f, 4.0f, 0.0f);
    Vector3 point3(0.0f, 3.0f, 0.0f);
    Vector3 point4(3.0f, 4.0f, 0.0f);

    cout << ray.GetDistance(point) << endl; //0
    cout << ray.GetUnitsLenth(point) << endl;//2

    cout << ray.GetDistance(point1) << endl;//0
    cout << ray.GetUnitsLenth(point1) << endl;//-2

    cout << ray.GetDistance(point2) << endl;//4
    cout << ray.GetUnitsLenth(point2) << endl;//-3

    cout << ray.GetDistance(point3) << endl;//3
    cout << ray.GetUnitsLenth(point3) << endl;//0

    cout << ray.GetDistance(point4) << endl;//4
    cout << ray.GetUnitsLenth(point4) << endl;//3
}

void testDir()
{
    Vector3 x(1.0f, 0.0f, 0.0f);
    Vector3 y(0.0f, 1.0f, 0.0f);

    Vector3 dir = x + y;
    dir.normalize();

    Ray ray({ 0.0f,0.0f,0.0f }, dir);

    std::vector<Vector3> rayVerts;
    PrintRay(rayVerts, ray);

    WriteOBJFile(rayVerts, "./output/rayVerts.obj");

    /// <summary>
    /// 第二段射线
    /// </summary>
    rayVerts.clear();
    Vector3 negY(0.0f, -1.0f, 0.0f);
    Vector3 dir1 = dir + negY;
    dir1.normalize();
    Ray ray1({ 0.0f,0.0f,0.0f }, dir1);
    PrintRay(rayVerts, ray1);

    WriteOBJFile(rayVerts, "./output/rayVerts1.obj");
}

void testRayProject()
{
    Ray ray({ 0.0f,0.0f,0.0f }, { 1.0f,0.0f,0.0f });
    Vector3 vert1(3.0f, 4.0f, 0.0f);

    Vector3 projectVert = ray.ProjectPoint(vert1);//(3,0,0)
    cout << "("<<projectVert.getX()<<","<< projectVert.getY()<<","<< projectVert.getZ()<<")" << endl;

    Vector3 verticalVert = ray.VerticalVector(vert1);////(0,4,0)

    cout << "(" << verticalVert.getX() << "," << verticalVert.getY() << "," << verticalVert.getZ() << ")" << endl;
}
