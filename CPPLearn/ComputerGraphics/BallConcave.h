#pragma once
#include <vector>

#include "ComputerGraphics.h"

class BallConcave
{
public:
    BallConcave(std::vector<Point3D> list);
    void InitNearestList();
    void InitDistanceMap();
    double GetRecomandedR();
    double GetMinEdgeLength();
    std::vector<Point3D> GetConcave_Ball(double radius);
    std::vector<Point3D> GetConcave_Edge(double radius);
    bool CheckValid(std::vector<std::vector<int>>& adjs);
    bool CompareAngel(Point3D a, Point3D b, Point3D m_origin, Point3D m_dreference);
    int GetNextPoint_EdgePivoting(int prev, int current, std::vector<int> list, double radius);
    int GetNextPoint_BallPivoting(int prev, int current, std::vector<int> list, double radius);
    void SortAdjListByAngel(std::vector<int> list, int prev, int current);
    bool HasPointsInCircle(std::vector<int> adjPoints, Point3D center, double radius, int adjIndex);
    Point3D GetCircleCenter(Point3D a, Point3D b, double r);
    bool IsInCircle(Point3D p, Point3D center, double r);
    std::vector<std::vector<int>> GetInRNeighbourList(double radius);
    std::vector<int> GetSortedNeighbours(int index);
    double GetDistance(Point3D p1, Point3D p2);
    double GetCross(Point3D a, Point3D b);
private:
    std::vector<bool> flags;
    std::vector<Point3D> points;
    std::vector<std::vector<double>> distanceMap;
    std::vector<std::vector<int>> rNeigbourList;
};

