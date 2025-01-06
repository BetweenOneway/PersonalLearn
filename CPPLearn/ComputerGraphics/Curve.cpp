#include "Curve.h"

//三次贝塞尔曲线  
float bezier3funcX(float uu, std::vector<Point3D> controlP) {
    float part0 = controlP[0].getX() * uu * uu * uu;
    float part1 = 3 * controlP[1].getX() * uu * uu * (1 - uu);
    float part2 = 3 * controlP[2].getX() * uu * (1 - uu) * (1 - uu);
    float part3 = controlP[3].getX() * (1 - uu) * (1 - uu) * (1 - uu);
    return part0 + part1 + part2 + part3;
}
float bezier3funcY(float uu, std::vector<Point3D> controlP) {
    float part0 = controlP[0].getY() * uu * uu * uu;
    float part1 = 3 * controlP[1].getY() * uu * uu * (1 - uu);
    float part2 = 3 * controlP[2].getY() * uu * (1 - uu) * (1 - uu);
    float part3 = controlP[3].getY() * (1 - uu) * (1 - uu) * (1 - uu);
    return part0 + part1 + part2 + part3;
}

void createCurve(const std::vector<Point3D> originPoint,vector<Point3D>& curvePoint)
{
    //控制点收缩系数 ，经调试0.6较好
    float scale = 0.6;
    std::vector<Point3D> midpoints;
    int originCount = originPoint.size();
    midpoints.resize(originCount);
    //生成中点       
    for (int i = 0; i < originCount; i++) {
        int nexti = (i + 1) % originCount;
        float x = (originPoint[i].getX() + originPoint[nexti].getX()) / 2.0;
        float y = (originPoint[i].getY() + originPoint[nexti].getY()) / 2.0;
        midpoints[i] = Point3D(x, y,0.0f);
    }

    //平移中点
    std::vector<Point3D> extrapoints(2 * originCount);
    for (int i = 0; i < originCount; i++) {
        int nexti = (i + 1) % originCount;
        int backi = (i + originCount - 1) % originCount;
        Point3D midinmid;
        midinmid.setX((midpoints[i].getX() + midpoints[backi].getX()) / 2.0);
        midinmid.setY((midpoints[i].getY() + midpoints[backi].getY()) / 2.0);
        int offsetx = originPoint[i].getX() - midinmid.getX();
        int offsety = originPoint[i].getY() - midinmid.getY();
        int extraindex = 2 * i;
        extrapoints[extraindex].setX(midpoints[backi].getX() + offsetx);
        extrapoints[extraindex].setY(midpoints[backi].getY() + offsety);
        //朝 originPoint[i]方向收缩   
        int addx = (extrapoints[extraindex].getX() - originPoint[i].getX()) * scale;
        int addy = (extrapoints[extraindex].getY() - originPoint[i].getY()) * scale;
        extrapoints[extraindex].setX(originPoint[i].getX() + addx);
        extrapoints[extraindex].setY(originPoint[i].getY() + addy);

        int extranexti = (extraindex + 1) % (2 * originCount);
        extrapoints[extranexti].setX(midpoints[i].getX() + offsetx);
        extrapoints[extranexti].setY(midpoints[i].getY() + offsety);
        //朝 originPoint[i]方向收缩   
        addx = (extrapoints[extranexti].getX() - originPoint[i].getX()) * scale;
        addy = (extrapoints[extranexti].getY() - originPoint[i].getY()) * scale;
        extrapoints[extranexti].setX(originPoint[i].getX() + addx);
        extrapoints[extranexti].setY(originPoint[i].getY() + addy);

    }

    std::vector<Point3D> controlPoint(4);
    //生成4控制点，产生贝塞尔曲线  
    for (int i = 0; i < originCount; i++) {
        controlPoint[0] = originPoint[i];
        int extraindex = 2 * i;
        controlPoint[1] = extrapoints[extraindex + 1];
        int extranexti = (extraindex + 2) % (2 * originCount);
        controlPoint[2] = extrapoints[extranexti];
        int nexti = (i + 1) % originCount;
        controlPoint[3] = originPoint[nexti];
        float u = 1;
        while (u >= 0) {
            int px = bezier3funcX(u, controlPoint);
            int py = bezier3funcY(u, controlPoint);
            //u的步长决定曲线的疏密  
            u -= 0.005;
            Point3D tempP(px, py,0.0f);
            //存入曲线点   
            curvePoint.push_back(tempP);
        }
    }
}

