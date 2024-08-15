#include <iostream>
using namespace std;
#include "testAlgo.h"
#include "Algo.h"
namespace TEST_ALGO {
    void testAlgo()
    {
        //不相交
        //Ray ray({ 0.0f,0.0f,0.0f }, { 0.0f,0.0f,1.0f });
        //Vector3 point0(1.0f, 2.0f, 0.0f);
        //Vector3 point1(0.0f, 0.0f, 0.0f);
        //Vector3 point2(2.0f, 0.0f, 0.0f);
        Ray ray({ 0.0f,0.0f,0.0f }, { 2.0f,2.0f,1.0f });
        Vector3 point0(1.0f, 2.0f, 0.0f);
        Vector3 point1(0.0f, 0.0f, 0.0f);
        Vector3 point2(2.0f, 0.0f, 0.0f);

        float t = 0.0f;
        if (PMIntersectTri(t, ray, point0, point1, point2))
        {
            cout << "Intersect" << endl;
        }
        else
        {
            cout << "Not Intersect" << endl;
        }
    }
}
