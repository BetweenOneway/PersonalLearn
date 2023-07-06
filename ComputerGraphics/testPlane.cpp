#include "iostream"
using namespace std;

#include "Plane.h"
#include "testPlane.h"

namespace TEST_PLANE {
    void testGetDistance()
    {
        Plane plane(Vector3(0.0f, 0.0f, 1.0f), Vector3(0.0f,0.0f,0.0f));
        float dist1 = plane.getDistance(Vector3(1.0f, 1.0f, 0.0f));
        float dist2 = plane.getDistance(Vector3(-1.0f, -1.0f, 0.0f));
        cout << dist1 << " " << dist2 << endl;
    }
}
