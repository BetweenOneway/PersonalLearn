#include <opencv2\opencv.hpp>
#include <vector>
#include <opencv2/core.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui.hpp>
#include <iostream>
using namespace cv;
using namespace std;

Mat polyfit(vector<Point2f>& in_point, int n);

int main()
{
    //数据输入
    Point2f in[13] = { Point2f(-26.6147,-19.0311),Point2f(-24.6571,-9.99788),Point2f(-22.6353,-2.0917),
        Point2f(-22.1313,6.11005),Point2f(-13.9657,9.71913),Point2f(-6.47999,13.7619),Point2f(3.12224,14.7553),
        Point2f(7.7737,8.43965),Point2f(14.6792,11.4277),Point2f(17.425,3.66914),Point2f(20.327,-4.6183),Point2f(24.4481,-13.3736),Point2f(28.367,-18.9913) };

    vector<Point2f> in_point(begin(in), end(in));

    //n:多项式阶次
    int n = 9;
    Mat mat_k = polyfit(in_point, n);


    //计算结果可视化
    Mat out(150, 500, CV_8UC3, Scalar::all(0));

    //画出拟合曲线
    //for (int i = in[0].x; i < in[size(in) - 1].x; ++i)
    //{
    //    Point2d ipt;
    //    ipt.x = i;
    //    ipt.y = 0;
    //    for (int j = 0; j < n + 1; ++j)
    //    {
    //        ipt.y += mat_k.at<double>(j, 0) * pow(i, j);
    //    }
    //    circle(out, ipt, 1, Scalar(255, 255, 255), -1, 16);
    //}

    //画出原始散点
    for (int i = 0; i < size(in); ++i)
    {
        Point2f ipt = in[i];
        circle(out, ipt, 3, Scalar(0, 0, 255), -1, 16);
    }

    imshow("9次拟合", out);
    waitKey(0);
    //system("pause");
    return 0;
}

Mat polyfit(vector<Point2f>& in_point, int n)
{
    int size = in_point.size();
    //所求未知数个数
    int x_num = n + 1;
    //构造矩阵U和Y
    Mat mat_u(size, x_num, CV_64F);
    Mat mat_y(size, 1, CV_64F);

    for (int i = 0; i < mat_u.rows; ++i)
        for (int j = 0; j < mat_u.cols; ++j)
        {
            mat_u.at<double>(i, j) = pow(in_point[i].x, j);
        }

    for (int i = 0; i < mat_y.rows; ++i)
    {
        mat_y.at<double>(i, 0) = in_point[i].y;
    }

    //矩阵运算，获得系数矩阵K
    Mat mat_k(x_num, 1, CV_64F);
    mat_k = (mat_u.t() * mat_u).inv() * mat_u.t() * mat_y;
    cout << mat_k << endl;
    return mat_k;
}


int main1(int argc, char** argv)
{
    //if (argc != 2)
    //{
    //    cout << " Usage: " << argv[0] << " ImageToLoadAndDisplay" << endl;
    //    return -1;
    //}
    Mat image;
    image = imread("C:\\Users\\wangwei\\Desktop\\rumi.jpeg", IMREAD_COLOR); // Read the file
    if (image.empty()) // Check for invalid input
    {
        cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    namedWindow("Display window", WINDOW_AUTOSIZE); // Create a window for display.
    imshow("Display window", image); // Show our image inside it.
    waitKey(0); // Wait for a keystroke in the window
    return 0;
}
