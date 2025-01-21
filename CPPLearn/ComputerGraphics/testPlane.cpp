#include "iostream"
using namespace std;


#include "testPlane.h"

namespace TEST_PLANE {
    void testGetDistance()
    {
        Plane plane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f,0.0f,0.0f));
        float dist1 = plane.getDistance(Vector3(1.0f, 1.0f, 1.0f));//1
        float dist2 = plane.getDistance(Vector3(-1.0f, -1.0f, -1.0f));//-1
        float dist3 = plane.getDistance(Vector3(1.0f, 2.0f, 5.0f));//5

        cout << dist1 << " " << dist2 << endl;
    }

    void testPrintPlane(const Plane& plane)
    {

    }
}
