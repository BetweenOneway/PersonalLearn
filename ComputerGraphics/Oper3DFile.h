#pragma once
#include <vector>
#include <fstream>
#include "Point.h"
using namespace std;

void OBJWritePoints(const vector<Point3D>& Vertices, const char* pszFileName);
