#include "Oper3DFile.h"

void OBJWritePoints(const vector<Point3D>& Vertices, const char* pszFileName)
{
    std::ofstream dstFile(pszFileName);
    for (const auto& point3D : Vertices)
    {
        dstFile << "v " << point3D.getX() << " " << point3D.getY() << " " << point3D.getZ() << std::endl;
    }
    dstFile.close();
}
