#include <iostream>
#include "LeastSquareMethod.h"
#include "LSM.h"
using namespace std;

#include "Point.h"
#include "Oper3DFile.h"

namespace CURVE_FITTING
{
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

bool MyTest()
{
    //多项式阶数
    const int order = 2;
    const int numParams = order + 1;

    Eigen::MatrixXf matrix33(numParams, numParams);
    Eigen::Vector3f vectorY;

    vectorY = Eigen::Vector3f::Zero();

    
    //std::vector<Point3D> verts{ {0.0f,1.1f,0.0f},{1.0f,0.0f,0.0f},{2.0f,0.9f,0.0f}};
    //std::vector<Point3D> verts{ {-5.0f,-10.0f,0.0f},{-3.0f,0.0f,0.0f},{0.0f,10.0f,0.0f},{3.0f,0.0f,0.0f},{5.0f,-10.0f,0.0f} };
    //样本数据
    std::vector<Point3D> verts;
    ReadOBJFile(verts, "D:/test/C11253/gumLineCenterOnPlane.obj");


    for (int j = 0; j <= order; j++)
    {
        std::vector<float> params(numParams);
        float Y = 0.0f;
        for (int i = 0; i < verts.size(); i++)
        {
            float base = 2 * pow(verts.at(i).getX(), order - j);
            for (int n = order; n >= 0; n--)
            {
                params.at(order - n) += base * pow(verts.at(i).getX(), n);
            }
            vectorY[j] += base * verts.at(i).getY();
        }
        for (int i = 0; i < params.size(); i++)
        {
            matrix33(j,i) = params.at(i);
        }
        
    }
    cout << "Matrix 3*3:\n" << matrix33 << endl;
    cout << "Y :\n" << vectorY << endl;
   
    Eigen::Vector3f params = matrix33.colPivHouseholderQr().solve(vectorY);
    //Eigen::Vector3f params = matrix33.bdcSvd(Eigen::ComputeThinU | Eigen::ComputeThinV).solve(vectorY);
    cout << "params:\n" << params << endl;

    auto GetY = [&order,&params](float x)->float {
        float y = 0.0f;
        for (int i = order; i >= 0; i--)
        {
            int index = order - i;
            y += params[index]*pow(x, i);
        }
        //y = params[0] * pow(x, 2) + params[1] * x + params[2];
        return y;
    };
    std::vector<Point3D> resultVerts;
    for (float x = verts.front().getX()-5.0f; x < verts.back().getX(); x += 0.1f)
    {
        float y = GetY(x);
        resultVerts.push_back(Point3D{ x,y,0.0f });
    }
    WriteOBJFile(resultVerts, "d:/test/C11253/resultVerts-2.obj");



    return true;
}
}
