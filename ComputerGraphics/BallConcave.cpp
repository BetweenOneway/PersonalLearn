#include <algorithm>
#include <math.h>
#include "BallConcave.h"


class Point2dInfo
{
public:
    Point3D Point;
    int Index;
    double DistanceTo;
    Point2dInfo() = default;
    Point2dInfo(Point3D p, int i, double dis)
    {
        Point = p;
        Index = i;
        DistanceTo = dis;
    }
    int CompareTo(Point2dInfo other)
    {
        return DistanceTo > other.DistanceTo ? 1 : DistanceTo == other.DistanceTo ? 0: -1;
    }
};


BallConcave::BallConcave(std::vector<Point3D> list)
{
    points = list;
    std::sort(points.begin(), points.end(), [](Point3D& point1, Point3D& point2)->bool {
        return (point1.getY() < point2.getY() ? true : point1.getY() == point2.getY()&& point1.getX() < point2.getX() ? true : false);
        });
    flags.resize(points.size());
    for (int i = 0; i < flags.size(); i++)
        flags[i] = false;
    InitDistanceMap();
    InitNearestList();
}

void BallConcave::InitNearestList()
{
    rNeigbourList.resize(points.size());
    for (int i = 0; i < points.size(); i++)
    {
        rNeigbourList[i] = GetSortedNeighbours(i);
    }
}

void BallConcave::InitDistanceMap()
{
    distanceMap.resize(points.size());
    for (int i = 0; i < points.size(); i++)
    {
        distanceMap[i].resize(points.size());
        for (int j = 0; j < points.size(); j++)
        {
            distanceMap[i][j] = GetDistance(points[i], points[j]);
        }
    }
}

double BallConcave::GetRecomandedR()
{
    double r = std::numeric_limits<double>::min();
    for (int i = 0; i < points.size(); i++)
    {
        if (distanceMap[i][rNeigbourList[i][1]] > r)
            r = distanceMap[i][rNeigbourList[i][1]];
    }
    return r;
}

double BallConcave::GetMinEdgeLength()
{
    double min = std::numeric_limits<double>::max();
    for (int i = 0; i < points.size(); i++)
    {
        for (int j = 0; j < points.size(); j++)
        {
            if (i < j)
            {
                if (distanceMap[i][j] < min)
                    min = distanceMap[i][j];
            }
        }
    }
    return min;
}

std::vector<Point3D> BallConcave::GetConcave_Ball(double radius)
{
    std::vector<Point3D> ret;
    std::vector<std::vector<int>> adjs = GetInRNeighbourList(2 * radius);
    ret.push_back(points[0]);
    //flags[0] = true;
    int i = 0, j = -1, prev = -1;
    while (true)
    {
        j = GetNextPoint_BallPivoting(prev, i, adjs[i], radius);
        if (j == -1)
            break;
        Point3D p = GetCircleCenter(points[i], points[j], radius);
        ret.push_back(points[j]);
        flags[j] = true;
        prev = i;
        i = j;
    }
    return ret;
}

std::vector<Point3D> BallConcave::GetConcave_Edge(double radius)
{
    std::vector<Point3D> ret;
    std::vector<std::vector<int>> adjs = GetInRNeighbourList(2 * radius);
    ret.push_back(points[0]);
    int i = 0, j = -1, prev = -1;
    while (true)
    {
        j = GetNextPoint_EdgePivoting(prev, i, adjs[i], radius);
        if (j == -1)
            break;
        //Point3D p = BallConcave.GetCircleCenter(points[i], points[j], radius);
        ret.push_back(points[j]);
        flags[j] = true;
        prev = i;
        i = j;
    }
    return ret;
}

bool BallConcave::CheckValid(std::vector<std::vector<int>>& adjs)
{
    for (int i = 0; i < adjs.size(); i++)
    {
        if (adjs[i].size() < 2)
        {
            return false;
        }
    }
    return true;
}

bool BallConcave::CompareAngel(Point3D a, Point3D b, Point3D m_origin, Point3D m_dreference)
{
    Point3D da(a.getX() - m_origin.getX(), a.getY() - m_origin.getY(),0.0f);
    Point3D db(b.getX() - m_origin.getX(), b.getY() - m_origin.getY(),0.0f);
    double detb = GetCross(m_dreference, db);

    // nothing is less than zero degrees
    if (detb == 0 && db.getX() * m_dreference.getX() + db.getY() * m_dreference.getY() >= 0) return false;

    double deta = GetCross(m_dreference, da);

    // zero degrees is less than anything else
    if (deta == 0 && da.getX() * m_dreference.getX() + da.getY() * m_dreference.getY() >= 0) return true;

    if (deta * detb >= 0) {
        // both on same side of reference, compare to each other
        return GetCross(da, db) > 0;
    }

    // vectors "less than" zero degrees are actually large, near 2 pi
    return deta > 0;
}

int BallConcave::GetNextPoint_EdgePivoting(int prev, int current, std::vector<int> list, double radius)
{
    if (list.size() == 2 && prev != -1)
    {
        return list[0] + list[1] - prev;
    }
    Point3D dp;
    if (prev == -1)
        dp = Point3D(1, 0,0.0f);
    else
        dp = points[prev] - points[current];
    int min = -1;
    for (int j = 0; j < list.size(); j++)
    {
        if (!flags[list[j]])
        {
            if (min == -1)
            {
                min = list[j];
            }
            else
            {
                Point3D t = points[list[j]];
                if (CompareAngel(points[min], t, points[current], dp) && GetDistance(t, points[current]) < radius)
                {
                    min = list[j];
                }
            }
        }
    }
    //main.ShowMessage("seek P" + points[min].Index);
    return min;
}
int BallConcave::GetNextPoint_BallPivoting(int prev, int current, std::vector<int> list, double radius)
{
    SortAdjListByAngel(list, prev, current);
    for (int j = 0; j < list.size(); j++)
    {
        if (flags[list[j]])
            continue;
        int adjIndex = list[j];
        Point3D xianp = points[adjIndex];
        Point3D rightCirleCenter = GetCircleCenter(points[current], xianp, radius);
        if (!HasPointsInCircle(list, rightCirleCenter, radius, adjIndex))
        {
            //main.DrawCircleWithXian(rightCirleCenter, points[current], points[adjIndex], radius);
            return list[j];
        }
    }
    return -1;
}

void BallConcave::SortAdjListByAngel(std::vector<int> list, int prev, int current)
{
    Point3D origin = points[current];
    Point3D df;
    if (prev != -1)
        df = Point3D(points[prev].getX() - origin.getX(), points[prev].getY() - origin.getY(),0.0f);
    else
        df = Point3D(1, 0,0.0f);
    int temp = 0;
    for (int i = list.size(); i > 0; i--)
    {
        for (int j = 0; j < i - 1; j++)
        {
            if (CompareAngel(points[list[j]], points[list[j + 1]], origin, df))
            {
                temp = list[j];
                list[j] = list[j + 1];
                list[j + 1] = temp;
            }
        }
    }
}

bool BallConcave::HasPointsInCircle(std::vector<int> adjPoints, Point3D center, double radius, int adjIndex)
{
    for (int k = 0; k < adjPoints.size(); k++)
    {
        if (adjPoints[k] != adjIndex)
        {
            int index2 = adjPoints[k];
            if (IsInCircle(points[index2], center, radius))
                return true;
        }
    }
    return false;
}

Point3D BallConcave::GetCircleCenter(Point3D a, Point3D b, double r)
{
    double dx = b.getX() - a.getX();
    double dy = b.getY() - a.getY();
    double cx = 0.5 * (b.getX() + a.getX());
    double cy = 0.5 * (b.getY() + a.getY());
    if (r * r / (dx * dx + dy * dy) - 0.25 < 0)
    {
        return Point3D(-1, -1,0.0f);
    }
    
    double sqrt = std::sqrt(r * r / (dx * dx + dy * dy) - 0.25);
    return Point3D(cx - dy * sqrt, cy + dx * sqrt,0.0f);
}

bool BallConcave::IsInCircle(Point3D p, Point3D center, double r)
{
    double dis2 = (p.getX() - center.getX()) * (p.getX() - center.getX()) + (p.getY() - center.getY()) * (p.getY() - center.getY());
    return dis2 < r* r;
}

std::vector<std::vector<int>> BallConcave::GetInRNeighbourList(double radius)
{
    std::vector<std::vector<int>> adjs;
    adjs.resize(points.size());

    for (int i = 0; i < points.size(); i++)
    {

        for (int j = 0; j < points.size(); j++)
        {
            if (i < j && distanceMap[i][j] < radius)
            {
                adjs[i].push_back(j);
                adjs[j].push_back(i);
            }
        }
    }
    return adjs;
}

std::vector<int> BallConcave::GetSortedNeighbours(int index)
{
    std::vector<Point2dInfo> infos;
    infos.resize(points.size());
    for (int i = 0; i < points.size(); i++)
    {
        infos.push_back(Point2dInfo(points[i], i, distanceMap[index][i]));
    }
    std::sort(infos.begin(), infos.end(), [](Point2dInfo& info1, Point2dInfo& info2) {return info1.CompareTo(info2)>0; });
    std::vector<int> adj;
    for (int i = 1; i < infos.size(); i++)
    {
        adj.push_back(infos[i].Index);
    }
    return adj;
}

double BallConcave::GetDistance(Point3D p1, Point3D p2)
{
    return std::sqrt((p1.getX() - p2.getX()) * (p1.getX() - p2.getX()) + (p1.getY() - p2.getY()) * (p1.getY() - p2.getY()));
}

double BallConcave::GetCross(Point3D a, Point3D b)
{
    return a.getX() * b.getY() - a.getY() * b.getX();
}
