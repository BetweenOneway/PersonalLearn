#pragma once
#include "Vector3.h"

template< class T1, class T2 = void, class T3 = void, class T4 = void, class T5 = void, class T6 = void >
struct VSConstBuffer
{
    unsigned     len;
    const T1* pData1;
    const T2* pData2;
    const T3* pData3;
    const T4* pData4;
    const T5* pData5;
    const T6* pData6;
};

template< class T >
struct VSConstBuffer< T, void, void, void, void, void >
{
    unsigned    len;
    const T* pData;

    VSConstBuffer()
    {
        len = 0;
        pData = NULL;
    }
    VSConstBuffer(unsigned n, const T* p) :len(n), pData(p) {}
    const T& operator[](size_t i) const { return pData[i]; }
};

template< class IT = unsigned >
struct TVSimpleGraph
{
    unsigned                nVertCount;
    unsigned                nTriangleCount;
    const VNVector3< IT >* pTriangles;

    TVSimpleGraph()
    {
        nVertCount = 0;
        nTriangleCount = 0;
        pTriangles = NULL;
    }
    template< typename TP > static void MapTo(TP& mapper, const TVSimpleGraph< IT >& ti) {
        mapper.Append(VSConstBuffer< char >(ti.nTriangleCount * sizeof(VNVector3< IT >), reinterpret_cast<const char*>(ti.pTriangles)));
    }
    template< typename CP > static void CorrectPtr(CP& r, unsigned& posEnd, const VSConstBuffer< char >& pbuff, unsigned objPos, unsigned curPos) {
        const TVSimpleGraph< IT >* pgraph = reinterpret_cast<const TVSimpleGraph< IT > *>(pbuff.pData + objPos);
        const VNVector3< IT >* pv = reinterpret_cast<const VNVector3< IT > *>(pbuff.pData + curPos);
        r.Modify(objPos + ((size_t) & reinterpret_cast<char const volatile&>((((TVSimpleGraph<IT>*)0)->pTriangles)))
                , VSConstBuffer< char >(sizeof(const VNVector3< IT > *), reinterpret_cast<const char*>(&pv)));
        posEnd = curPos + pgraph->nTriangleCount * sizeof(VNVector3< IT >);
    };
};

template< class VT, class IT = unsigned >
struct TVSimpleMesh : TVSimpleGraph< IT >
{
    const VT* pVertices;

    TVSimpleMesh() :TVSimpleGraph< IT >()
    {
        pVertices = NULL;
    }
    template< typename TP > static void MapTo(TP& mapper, const TVSimpleMesh< VT, IT >& ti) {
        TVSimpleGraph< IT >::MapTo(mapper, ti);
        mapper.Append(VSConstBuffer< char >(ti.nVertCount * sizeof(VT), reinterpret_cast<const char*>(ti.pVertices)));
    }
    template< typename CP >
    static void CorrectPtr(CP& r, unsigned& posEnd, const VSConstBuffer< char >& pbuff, unsigned objPos, unsigned curPos) {
#ifdef WIN32
        static_assert((reinterpret_cast<const char*>((TVSimpleMesh< VT, IT > *)(0))
            == reinterpret_cast<const char*>((TVSimpleGraph< IT >     *)(0))), "Stucture Offset Error£¡");
#endif
        TVSimpleGraph< IT >::CorrectPtr(r, posEnd, pbuff, objPos, curPos);

        const TVSimpleMesh< VT, IT >* pmesh = reinterpret_cast<const TVSimpleMesh< VT, IT > *>(pbuff.pData + objPos);
        const VT* pv = reinterpret_cast<const VT*>(pbuff.pData + posEnd);
        r.Modify(objPos + ((size_t) & reinterpret_cast<char const volatile&>((((TVSimpleMesh<VT, IT>*)0)->pVertices)))
                , VSConstBuffer< char >(sizeof(const VT*), reinterpret_cast<const char*>(&pv)));
        posEnd += pmesh->nVertCount * sizeof(VT);
    };
};

typedef TVSimpleMesh< Vector3 >    VSSimpleMeshF;
