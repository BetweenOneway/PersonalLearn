#pragma once
#include <vector>
#include <fstream>
#include "Point.h"
using namespace std;

bool ReadOBJFile(vector<Point3D>& Vertices, const char* pszFileName);
void WriteOBJFile(const vector<Point3D>& Vertices, const char* pszFileName);
