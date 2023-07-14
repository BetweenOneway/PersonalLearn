#include <iostream>
#include "LeastSquareMethod.h"

using namespace std;

int main()
{
    float x[5] = {1, 2, 3, 4, 5};
    float y[5] = {7, 35, 103, 229, 431};

    vector<float> X(x, x + sizeof(x) / sizeof(float));
    vector<float> Y(y, y + sizeof(y) / sizeof(float));

    Eigen::VectorXf result(FitterLeastSquareMethod(X, Y, 3));

    cout << "\nThe coefficients vector is: \n" << endl;
    for (size_t i = 0; i < result.size(); ++i)
        cout << "theta_" << i << ": " << result[i] << endl;

    system("pause");
    return 0;
}
