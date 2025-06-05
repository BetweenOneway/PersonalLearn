#include <sstream>
#include "Oper3DFile.h"


void WriteOBJFile(const vector<Point3D>& Vertices, const char* pszFileName)
{
    std::ofstream dstFile(pszFileName);
    for (const auto& point3D : Vertices)
    {
        dstFile << "v " << point3D.getX() << " " << point3D.getY() << " " << point3D.getZ() << std::endl;
    }
    dstFile.close();
}

bool ReadOBJFile(vector<Point3D>& Vertices, const char* pszFileName)
{
    vector<Surf> surfs;
    return ReadOBJFile(Vertices, surfs, pszFileName);
}

bool ReadOBJFile(vector<Point3D>& Vertices, vector<Surf>& surfs, const char* pszFileName)
{
    ifstream in;
    in.open(pszFileName);
    if (!in)
        return false;
    char line[255];
    string word;

    while (in.good()) {
        in.getline(line, 254);
        std::istringstream iss(line);
        float x = 0.0f, y = 0.0f, z = 0.0f;
        if (line[0] == 'v') {
            iss >> word >> x >> y >> z;
            Point3D point(x, y, z);
            Vertices.push_back(point);
        }

        // face data
        if (line[0] == 'f')
        {
            int a, b, c;
            iss >> word >> a >> b >> c;
            //OBJ文件中面的索引是从1开始的，而读进来之后，点的索引却是从1开始的
            Surf surf;
            surf.x = a-1;
            surf.y = b-1;
            surf.z = c-1;
            surfs.push_back(surf);
        }
    }
    in.close();
    return true;
}
