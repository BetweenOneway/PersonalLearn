#pragma once
#include <vector>
#include <fstream>
#include "Point.h"
#include "Type.h"
using namespace std;

bool ReadOBJFile(vector<Point3D>& Vertices, const char* pszFileName);
bool ReadOBJFile(vector<Point3D>& Vertices, vector<Surf>& surfs, const char* pszFileName);
void WriteOBJFile(const vector<Point3D>& Vertices, const char* pszFileName);
