#include <iostream>
#include <vector>
using namespace std;

void enter(vector<pair<double, double>>& x)  //录入信息
{
    do {
        static int n = 0;
        cout << "是否输入第" << n + 1 << "组数据,Y继续输入，N退出输入数据" << endl;
        string u;
        cin >> u;
        if (u == "Y")
        {
            n++;
            double dx;        //中间变量,x
            double dy;        //中间变量y值
            cout << "请输入x，y值，中间用空格隔开" << endl;
            cin >> dx;
            cin >> dy;
            x.push_back(make_pair(dx, dy));
        }
        else if (u == "N")
        {
            break;
        }
        else
        {
            cout << "请输入正确的选择" << endl;
        }
    } while (1);
}

vector<double> l_x;      //记录拉格朗系数

double L_end(double t, vector<pair<double, double>> x)          //t为需要计算的坐标,x为输入进去的已知离散坐标
{
    double y = 0;                //记录最后所求的x对应的值
    int i = 0;
    if (l_x.empty())
    {
        for (vector<pair<double, double>>::iterator it = x.begin(); it < x.end(); it++)
        {
            l_x.push_back(1);          //拉格朗系数初始化
            int i1 = 0;
            for (vector<pair<double, double>>::iterator it1 = x.begin(); it1 < x.end(); it1++)
            {
                if (i1 != i)
                {
                    double i_first = x[i].first;
                    double i1_first = x[i1].first;

                    l_x[i] = l_x[i] * ((t - i1_first) / (i_first - i1_first));
                }
                i1++;
            }
            i++;
        }
    }
    int i2 = 0;
    for (vector<double>::iterator it2 = l_x.begin(); it2 < l_x.end(); it2++)
    {
        double l_x_ = l_x[i2];
        double i2_second = x[i2].second;
        y = y + l_x_ * i2_second;
        i2++;
    }

    return y;
}

double Lagrange(double t, vector<pair<double, double>> x)
{
    double base1 = (((t-x[1].first)*(t-x[2].first))/((x[0].first-x[1].first)*(x[0].first-x[2].first)))*x[0].second;
    double base2 = (((t-x[0].first)*(t-x[1].first))/((x[1].first-x[0].first)*(x[1].first-x[2].first)))*x[1].second;
    double base3 = (((t-x[0].first)*(t-x[1].first))/((x[2].first-x[0].first)*(x[2].first-x[1].first)))*x[2].second;
    return base1 + base2 + base3;
}

void test()
{
    vector<pair<double, double>> originPoints{ {12.8443232,-2.34144878},{0.0120483264,3.16588783},{-12.3474464,-2.63052559} };
    double xRange = 12.8443232 + 12.3474464;
    double zRange = 9.64562798 - 3.19460821;
    int numVerts = 60;
    FILE* fp_m_x = fopen("./Lagrange.obj", "wt");

    for (int i = 0; i < numVerts; i++)
    {
        double x = -12.3474464 + i * (xRange / numVerts);
        double y = Lagrange(x, originPoints);

        fprintf(fp_m_x, "v %lf %lf 0.0\n", x, y);
    }

    fclose(fp_m_x);
}

int test2()
{
    double x[4], y[4], t;
    for (int i = 0; i <= 3; i++)
    {
        cout << "input x" << i << "=";
        cin >> x[i];
        cout << "input y" << i << "=";
        cin >> y[i];

    }
    cout << "input x=";
    cin >> t;
    //输入x0-x3,y0-y3,x


    double l1[4], l2[4];             //定义基函数分母和分子
    for (int i = 0; i <= 3; i++)
    {
        l1[i] = l2[i] = 1;          //初始化分母,分子为1
    }

    double l[4];
    for (int i = 0; i <= 3; i++)
    {
        for (int j = 0; j <= 3; j++)
        {
            if (i == j)
                continue;
            l1[i] *= t - x[j];     //计算基函数分子
            l2[i] *= x[i] - x[j];  //计算基函数分母
        }
        l[i] = l1[i] / l2[i];
    }

    double p = 0;
    for (int i = 0; i <= 3; i++)
    {
        p += y[i] * l[i];              //计算P(x)
    }

    cout << "P(" << t << ")=" << p << endl;

    return 0;
}
