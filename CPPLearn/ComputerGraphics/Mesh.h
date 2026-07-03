#pragma once

#include "Type.h"
#include "Vector3.h"
#include "MeshDefined.h"

class Mesh
{
public:
    Mesh(const Mesh& in);
    Mesh(const std::vector<Vector3>& verts, const std::vector<Surf> surfs);
    VSSimpleMeshF GetSimpMesh() const;
    void WriteToFile(const char* szPath, ...) const;
    void GetSimpMesh(VSSimpleMeshF& out) const;
    std::vector<Vector3>& GetVertices();
    std::vector<Surf>& GetSurfs();
    void Clear();
private:
    // 成员数据
    std::vector<Vector3> vVertice;
    std::vector<Surf> vSurface;
};

