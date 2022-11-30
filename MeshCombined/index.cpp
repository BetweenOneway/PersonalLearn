#include "MeshCombiner.h"

#include <fstream>
#include <unordered_map>

struct MyHash {
	std::size_t operator()(dust3d::Vector3 const& s) const noexcept
	{
		std::size_t h1 = std::hash<double>{}(s.x());
		std::size_t h2 = std::hash<double>{}(s.y());
		return h1 ^ (h2 << 1); // or use boost::hash_combine
	}
};


typedef struct _STL_Head
{
    char partName[80];//零件名称
    int  faceNum;//面的数目
}STL_Head;


//点，三个float类型的，大小为12字节
typedef struct _Point
{
    float x;
    float y;
    float z;
}Point;

//法线
typedef struct _Normal
{
    float i;
    float j;
    float k;
}Normal;

//三角面，由一个法线，三个点，和一个两字节的保留项，一共50字节
typedef struct _Face
{
    Normal normal;
    Point  p1;
    Point  p2;
    Point  p3;
    char  info[2];//保留数据，可以不用管
}Face;


bool GetVertsAndSurfs(std::vector<dust3d::Vector3>& vertices, std::vector<std::vector<size_t>>& faces)
{
	unsigned nOldVertCnt = vertices.size();
	std::vector<dust3d::Vector3> tmpVertices;
	faces.resize(nOldVertCnt / 3);
	tmpVertices.reserve(nOldVertCnt);
	std::unordered_map<int,int> mapi;
	std::unordered_map<dust3d::Vector3, unsigned,MyHash> mapVerts;

	for (unsigned i = 0; i < nOldVertCnt / 3; i++)
	{
		unsigned nVCnt = 0;
		for (unsigned k = 0; k < 3; k++)
		{
			unsigned nOldIdx = i * 3 + k;
			const dust3d::Vector3& v = vertices[nOldIdx];

			if (mapVerts.count(v) == 0)
			{
				mapVerts.insert(std::make_pair(v, tmpVertices.size()));
				tmpVertices.push_back(v);
			}
			auto vert = mapVerts.find(v);
			faces[i].insert(faces[i].begin(), vert->second);
		}
	}
	return true;
}

void ReadOBJ(const char* szFileName)
{

}

/*
* 二进制STL
文件起始的80个字节是文件头，用于存贮文件名；
紧接着用 4 个字节的整数来描述模型的三角面片个数， 后面逐个给出每个三角面片的几何信息。每个三角面片占用固定的50个字节，依次是: 
3个4字节浮点数(角面片的法矢量) 
3个4字节浮点数(1个顶点的坐标)
 3个4字节浮点数(2个顶点的坐标) 
3个4字节浮点数(3个顶点的坐标)
三角面片的最后2个字节用来描述三角面片的属性信息，一般只保留位置，具体数据不用管。 
一个完整二进制STL文件的大小为三角形面片数乘以 50再加上84个字节。
*/
bool ReadSTL(const char* szFileName, std::vector<dust3d::Vector3>& vertices, std::vector<std::vector<size_t>>& faces)
{
    FILE* fp;
    STL_Head head;
    fp = fopen(szFileName, "rb");

    if (fp == NULL)
    {
        return false;
    }
    fread(head.partName, 80, 1, fp);//获取部件名
    fread(&head.faceNum, 4, 1, fp);//获取三角面片的数目

    vertices.resize(head.faceNum * 3);
    faces.resize(head.faceNum);

    Face face;
    int verticeIndex = 0;
    for (int i = 0; i < head.faceNum; i++)
    {
        //每个面由3个顶点组成
        faces[i].resize(3);
        fread(&face.normal, 12, 1, fp);//读取法线数据

        fread(&face.p1, 12, 1, fp);//读取顶点1的数据
        
        faces[i][0] = verticeIndex;
        vertices[verticeIndex++] = { face.p1.x,face.p1.y,face.p1.z };

        fread(&face.p2, 12, 1, fp);//读取顶点2的数据
        faces[i][1] = verticeIndex;
        vertices[verticeIndex++] = { face.p2.x,face.p2.y,face.p2.z };
        

        fread(&face.p3, 12, 1, fp);//读取顶点3的数据
        faces[i][2] = verticeIndex;
        vertices[verticeIndex++] = { face.p3.x,face.p3.y,face.p3.z };
        

        fread(&face.info, 2, 1, fp);//读取保留项数据，这一项一般没什么用，这里选择读取是为了移动文件指针
    }

    fclose(fp);
	return true;
}

bool WriteSTL(const char* szFileName,dust3d::Mesh& mesh)
{
    FILE* fp = fopen(szFileName, "wb");
    if (NULL == fp)
    {
        return false;
    }

	std::unique_ptr<std::vector<dust3d::Vector3>> vertices;
	std::unique_ptr<std::vector<std::vector<size_t>>> triangles;

	vertices = std::make_unique<std::vector<dust3d::Vector3>>();
	triangles = std::make_unique<std::vector<std::vector<size_t>>>();

	mesh.fetch(*vertices, *triangles);

	char title[80] = { "test" };
	int32_t triCount = triangles->size();

    fwrite(title, sizeof(char), 80, fp);
    fwrite(&triCount, sizeof(int), 1, fp);

    float* dat = new float[12];
    for (int i = 0; i < triCount; i++)
    {
        dust3d::Vector3 pt1 = vertices->at(triangles->at(i).at(0));
        dust3d::Vector3 pt2 = vertices->at(triangles->at(i).at(1));
        dust3d::Vector3 pt3 = vertices->at(triangles->at(i).at(2));

        float nx = (pt1.y() - pt3.y()) * (pt2.z() - pt3.z()) - (pt1.z() - pt3.z()) * (pt2.y() - pt3.y());
        float ny = (pt1.z() - pt3.z()) * (pt2.x() - pt3.x()) - (pt2.z() - pt3.z()) * (pt1.x() - pt3.x());
        float nz = (pt1.x() - pt3.x()) * (pt2.y() - pt3.y()) - (pt2.x() - pt3.x()) * (pt1.y() - pt3.y());

        float nxyz = sqrt(nx * nx + ny * ny + nz * nz);

        dat[0] = nx / nxyz;
        dat[1] = ny / nxyz;
        dat[2] = nz / nxyz;

        dat[3] = pt1.x();
        dat[4] = pt1.y();
        dat[5] = pt1.z();

        dat[6] = pt2.x();
        dat[7] = pt2.y();
        dat[8] = pt2.z();

        dat[9] = pt3.x();
        dat[10] = pt3.y();
        dat[11] = pt3.z();

        fwrite(dat, sizeof(float), 12, fp);
        fwrite("wl", sizeof(char), 2, fp);
    }

	//for (int i = 0; i < triCount; i++)
	//{
	//	dust3d::Vector3 pt1 = vertices->at(triangles->at(i).at(0));
	//	dust3d::Vector3 pt2 = vertices->at(triangles->at(i).at(1));
	//	dust3d::Vector3 pt3 = vertices->at(triangles->at(i).at(2));
	//	dust3d::Vector3 normal = dust3d::Vector3::normal(pt1, pt2, pt3);

	//	fout.write((char*)&normal.x(), 4);
	//	fout.write((char*)&normal.y(), 4);
	//	fout.write((char*)&normal.z(), 4);
	//	fout.write((char*)&pt1.x(), 4);
	//	fout.write((char*)&pt1.y(), 4);
	//	fout.write((char*)&pt1.z(), 4);
	//	fout.write((char*)&pt2.x(), 4);
	//	fout.write((char*)&pt2.y(), 4);
	//	fout.write((char*)&pt2.z(), 4);
	//	fout.write((char*)&pt3.x(), 4);
	//	fout.write((char*)&pt3.y(), 4);
	//	fout.write((char*)&pt3.z(), 4);

	//	char triAttr[2] = { 0 };
	//	fout.write(triAttr, 2);
	//}

	return true;
}

int main()
{
	std::vector<dust3d::Vector3> vertices1;
	std::vector<std::vector<size_t>> faces1;

	std::string inputfile1("./testData/1_split_part_18.stl");
	ReadSTL(inputfile1.c_str(), vertices1, faces1);
	dust3d::Mesh mesh1(vertices1,faces1);
    //std::string outFileName("./testData/write_mesh1.stl");
    //WriteSTL(outFileName.c_str(), vertices1, faces1);
    //WriteSTL(outFileName.c_str(), mesh1);


	std::vector<dust3d::Vector3> vertices2;
	std::vector<std::vector<size_t>> faces2;

	std::string inputfile2("./testData/1_split_part_0.stl");
	ReadSTL(inputfile1.c_str(), vertices2, faces2);
	dust3d::Mesh mesh2(vertices2, faces2);

	dust3d::Mesh* combinedMesh = dust3d::MeshCombiner::combine(mesh1, mesh2, dust3d::MeshCombiner::Method::Union);
	
	std::string outFileName("./testData/combined.stl");
	WriteSTL(outFileName.c_str(), *combinedMesh);

	return 0;
}
