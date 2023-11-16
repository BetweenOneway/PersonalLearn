#include <iostream>
using namespace std;
#include "CommonFunctions.h"

void testPMIntersectTri()
{
    Vector3 v1{2.0f,0.0f,0.0f};
    Vector3 v2{0.0f,2.0f,0.0f};
    Vector3 v3{ -2.0f,0.0f,0.0f };
    Ray ray{ {0.0f,1.0f,1.0f},{0.0f,0.0f,1.0f} };
    float dist;

    if (COMMON_FUNCTIONS::PMIntersectTri(dist, ray, v1, v2, v3))
    {
        cout << "dist:" << dist << endl;
    }
    else
    {
        cout << "PMIntersectTri false" << endl;
    }
}
