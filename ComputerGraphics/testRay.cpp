#include "testRay.h"
#include <iostream>
using namespace std;
void testGetUnitLengthAndDistance()
{
    Ray ray({ 0.0f,0.0f,0.0f }, {1.0f,0.0f,0.0f});
    Vector3 point(2.0f, 0.0f, 0.0f);
    Vector3 point1()

    cout << ray.GetDistance(point) << endl; //0
    cout << ray.GetUnitsLenth(point) << endl;//2
}
