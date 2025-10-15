#include "Mesh.h"

Mesh::Mesh(const Mesh& in)
{
    vVertice = in.vVertice;
    vSurface = in.vSurface;
}

Mesh::Mesh(const std::vector<Vector3>& verts, const std::vector<Surf> surfs)
{
    vVertice = verts;
    vSurface = surfs;
}

VSSimpleMeshF Mesh::GetSimpMesh() const
{
    VSSimpleMeshF sm;
    this->GetSimpMesh(sm);
    return sm;
}

void Mesh::GetSimpMesh(VSSimpleMeshF& out) const
{
    if (this->vVertice.size() > 0)
    {
        out.pVertices = &this->vVertice[0];
        out.nVertCount = this->vVertice.size();
    }
    if (this->vSurface.size() > 0)
    {
        out.pTriangles = &this->vSurface[0];
        out.nTriangleCount = this->vSurface.size();
    }
}

void Mesh::WriteToFile(const char* szPath, ...) const
{

}


