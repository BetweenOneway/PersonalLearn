#pragma once
#include <vector>
#include <fstream>
#include "Point.h"
#include "Type.h"
#include "MeshDefined.h"

using namespace std;

bool ReadOBJFile(vector<Point3D>& Vertices, const char* pszFileName);
bool ReadOBJFile(vector<Point3D>& Vertices, vector<Surf>& surfs, const char* pszFileName);
void WriteOBJFile(const vector<Point3D>& Vertices, const char* pszFileName);

bool ReadSTLFile(std::vector<Point3D>& vVerts, std::vector<Surf>& vSurfs,
    const char* pszFileName, const bool blIsAscii = false);

void WriteSimpleMesh(const char* pszFileName, const VSSimpleMeshF& mesh);
