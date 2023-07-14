#include <iostream>
#include "LeastSquareMethod.h"
#include "LSM.h"
using namespace std;

#include "Point.h"
#include "Oper3DFile.h"

int LSM()
{
    std::vector<Point3D> verts;
    ReadOBJFile(verts, "D:/test/C11253/gumLineCenterOnPlane.obj");
    const int num = verts.size();

    vector<float> X;
    vector<float> Y;
    for (int i = 0; i < num; i++)
    {
        auto& vert = verts.at(i);
        X.push_back(vert.getX());
        Y.push_back(vert.getY());
    }

    Eigen::VectorXf result(FitterLeastSquareMethod(X, Y, 3));

    cout << "\nThe coefficients vector is: \n" << endl;
    for (size_t i = 0; i < result.size(); ++i)
        cout << "theta_" << i << ": " << result[i] << endl;

    auto GetY = [&result](float x)->float {
        float y = 0.0f;
        for (int i = 0; i < result.size(); i++)
        {
            y = result[i] * pow(x, i);
        }
        return y;
    };
    std::vector<Point3D> resultVerts;
    for (float x = verts.at(0).getX(); x < verts.back().getX(); x += 0.1f)
    {
        float y = GetY(x);
        resultVerts.push_back(Point3D{ x,y,0.0f });
    }

    WriteOBJFile(resultVerts, "d:/test/C11253/resultVerts.obj");
    return 0;
}
