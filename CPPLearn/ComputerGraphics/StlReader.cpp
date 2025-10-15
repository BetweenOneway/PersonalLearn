#include "StlReader.h"

#include <unordered_map>
#include <fstream>

StlReader::StlReader(const std::string& fileName, bool bAscii)
    : m_strFileName(fileName)
    , m_bAsciiMode(bAscii)
{
}

bool StlReader::Process(std::vector<Vector3>& vVerts, std::vector<Surf>& vSurfs)
{
    if (m_bAsciiMode)
    {
        std::ifstream fin(m_strFileName, std::ios::in);

        fin.seekg(0, std::ios::end);   //seek to the end
        unsigned fileLen = (unsigned)fin.tellg();
        if (0 == fileLen)      // file is empty
        {
            return false;
        }
        fin.seekg(0, std::ios::beg); //seek to the beg

        char* pFileBuf = new char[fileLen + 1];
        std::memset(pFileBuf, 0, fileLen + 1);
        fin.read(pFileBuf, fileLen);

        char* pTemp = NULL;
        pTemp = pFileBuf;
        char tempBuffer[1024];
        unsigned nMaxSize = 1024;
        unsigned nReadLen = 0;
        unsigned nRet = 0;
        while (nReadLen < fileLen)
        {
            nRet = ReadNextValidData(pTemp, nReadLen, tempBuffer, nMaxSize);
            if (0 == nRet)
            {
                break;
            }
            if (std::strcmp(tempBuffer, "vertex") == 0)    //顶点信息
            {
                Vector3 vert;
                nRet = ReadNextValidData(pTemp, nReadLen, tempBuffer, nMaxSize);
                if (0 == nRet)
                {
                    break;
                }
                vert.setX((float)atof(tempBuffer));
                nRet = ReadNextValidData(pTemp, nReadLen, tempBuffer, nMaxSize);
                if (0 == nRet)
                {
                    break;
                }
                vert.setY((float)atof(tempBuffer));
                nRet = ReadNextValidData(pTemp, nReadLen, tempBuffer, nMaxSize);
                if (0 == nRet)
                {
                    break;
                }
                vert.setZ((float)atof(tempBuffer));
                mVerts.push_back(vert);
            }
        }
        delete(pFileBuf);

        GetVertsAndSurfs(vVerts, vSurfs);

        return true;
    }
    else
    {
        std::ifstream fin(m_strFileName, std::ios::in | std::ios::binary);

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
        Vector3 pt = Vector3(0.0f,0.0f,0.0f);
        mVerts.resize(nVertDataCount * 3);

        for (unsigned k = 0; k < nVertDataCount; k++)
        {
            offset += 4 * 3; //normal

            for (unsigned i = 0; i < 3; i++)
            {
                pt.setX( *(float*)(buffer + offset));
                offset += 4;
                pt.setY(*(float*)(buffer + offset));
                offset += 4;
                pt.setZ( *(float*)(buffer + offset));
                offset += 4;

                mVerts[3 * k + i] = pt;
            }

            offset += 2;
        }
        delete(buffer);

        GetVertsAndSurfs(vVerts, vSurfs);

        return true;
    }
}

int StlReader::ReadNextValidData(char*& tBuf, unsigned& nCount, char* validData, const unsigned& nMaxSize)
{
    unsigned nIndex = 0;

    while ((tBuf[0] == ' ') ||
        (tBuf[0] == '\n') ||
        (tBuf[0] == '\t') ||
        (tBuf[0] == '\r'))
    {
        tBuf++;
        nCount++;
    }

    while ((tBuf[0] != ' ') &&
        (tBuf[0] != '\n') &&
        (tBuf[0] != '\t') &&
        (tBuf[0] != '\r') &&
        (tBuf[0] != '\null') &&
        (tBuf[0] != 0) &&
        (nIndex < nMaxSize))
    {
        validData[nIndex++] = *(tBuf++);
        nCount++;
    }
    validData[nIndex] = 0;
    return nIndex;
}

void StlReader::GetVertsAndSurfs(std::vector<Vector3>& vVerts, std::vector<Surf>& vSurfs)
{
    // 修改说明：原先去除重复点的方法时间复杂度过高，改用hashmap
    unsigned nOldVertCnt = mVerts.size();
    vSurfs.resize(nOldVertCnt / 3);
    vVerts.reserve(nOldVertCnt);
    std::unordered_map<Vector3, unsigned> mapVerts;

    for (unsigned i = 0; i < nOldVertCnt / 3; i++)
    {
        unsigned nVCnt = 0;
        for (unsigned k = 0; k < 3; k++)
        {
            unsigned nOldIdx = i * 3 + k;
            const Vector3& v = mVerts[nOldIdx];

            if (mapVerts.count(v) == 0)
            {
                mapVerts.insert(std::make_pair(v, vVerts.size()));
                vVerts.push_back(v);
            }

            auto vert = mapVerts.find(v);
            vSurfs[i][k] = vert->second;
        }
    }
}
