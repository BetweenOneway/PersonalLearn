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

bool ReadSTL(const char* szFileName, std::vector<dust3d::Vector3>& vertices, std::vector<std::vector<size_t>>& faces)
{
	std::ifstream fin(szFileName, std::ios::in | std::ios::binary);

	fin.seekg(0, std::ios::end);   //seek to the end
	unsigned fileLen = (unsigned)fin.tellg();
	if (0 == fileLen)      // file is empty
	{
		return false;
	}

	fin.seekg(0, std::ios::beg);
	unsigned len = fin.tellg();
	char* buffer = new char[fileLen + 1];
	std::memset(buffer, 0, fileLen + 1);
	fin.read(buffer, fileLen);

	unsigned offset = 80;
	unsigned nVertDataCount = *(unsigned*)(buffer + offset);   //获取nVertDataCount
	offset += sizeof(int32_t);

	//从二进制文件读取顶点信息
	dust3d::Vector3 pt;
	vertices.resize(nVertDataCount * 3);

	for (unsigned k = 0; k < nVertDataCount; k++)
	{
		offset += 4 * 3; //normal

		for (unsigned i = 0; i < 3; i++)
		{
			pt.setX(*(float*)(buffer + offset));
			offset += 4;
			pt.setY(*(float*)(buffer + offset));
			offset += 4;
			pt.setZ(*(float*)(buffer + offset));
			offset += 4;

			vertices[3 * k + i] = pt;
		}

		offset += 2;
	}
	delete(buffer);

	GetVertsAndSurfs(vertices, faces);
	return true;

}

bool WriteSTL(const char* szFileName,dust3d::Mesh& mesh)
{
	std::ofstream fout(szFileName, std::ios::binary);

	std::unique_ptr<std::vector<dust3d::Vector3>> vertices;
	std::unique_ptr<std::vector<std::vector<size_t>>> triangles;

	vertices = std::make_unique<std::vector<dust3d::Vector3>>();
	triangles = std::make_unique<std::vector<std::vector<size_t>>>();

	mesh.fetch(*vertices, *triangles);

	char title[80] = { 0 };
	int32_t triCount = triangles->size();

	fout.write(title, 80);
	fout.write((char*)&triCount, sizeof(int32_t));

	for (int i = 0; i < triCount; i++)
	{
		dust3d::Vector3 pt1 = vertices->at(triangles->at(i).at(0));
		dust3d::Vector3 pt2 = vertices->at(triangles->at(i).at(1));
		dust3d::Vector3 pt3 = vertices->at(triangles->at(i).at(2));
		dust3d::Vector3 normal = dust3d::Vector3::normal(pt1, pt2, pt3);

		fout.write((char*)&normal.x(), 4);
		fout.write((char*)&normal.y(), 4);
		fout.write((char*)&normal.z(), 4);
		fout.write((char*)&pt1.x(), 4);
		fout.write((char*)&pt1.y(), 4);
		fout.write((char*)&pt1.z(), 4);
		fout.write((char*)&pt2.x(), 4);
		fout.write((char*)&pt2.y(), 4);
		fout.write((char*)&pt2.z(), 4);
		fout.write((char*)&pt3.x(), 4);
		fout.write((char*)&pt3.y(), 4);
		fout.write((char*)&pt3.z(), 4);

		char triAttr[2] = { 0 };
		fout.write(triAttr, 2);
	}

	return true;
}

int main()
{
	std::vector<dust3d::Vector3> vertices1;
	std::vector<std::vector<size_t>> faces1;
    //读写STL文件有问题
	std::string inputfile1("./testData/1_split_part_18.stl");
	ReadSTL(inputfile1.c_str(), vertices1, faces1);
	dust3d::Mesh mesh1(vertices1,faces1);
    std::string outFileName("./testData/write_mesh1.stl");
    WriteSTL(outFileName.c_str(), mesh1);


	//std::vector<dust3d::Vector3> vertices2;
	//std::vector<std::vector<size_t>> faces2;

	//std::string inputfile2("./testData/1_split_part_0.stl");
	//ReadSTL(inputfile1.c_str(), vertices2, faces2);
	//dust3d::Mesh mesh2(vertices2, faces2);

	//dust3d::Mesh* combinedMesh = dust3d::MeshCombiner::combine(mesh1, mesh2, dust3d::MeshCombiner::Method::Union);
	
	//std::string outFileName("./testData/combined.stl");
	//WriteSTL(outFileName.c_str(), *combinedMesh);

	return 0;
}
