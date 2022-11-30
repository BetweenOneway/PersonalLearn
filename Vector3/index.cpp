#include <iostream>
using namespace std;
#include "Matrix3x3.h"

void printVector(Vector3& toPrint)
{
    cout << toPrint.getX() << toPrint.getY() << toPrint.getZ() << endl;
}
void printMatrix3x3(Matrix3x3& toPrint)
{

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
int main()
{
    return 0;
}
