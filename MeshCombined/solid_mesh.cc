/*
 *  Copyright (c) 2016-2021 Jeremy HU <jeremy-at-dust3d dot org>. All rights reserved. 
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:

 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

#include "solid_mesh.h"

namespace dust3d {

SolidMesh::~SolidMesh()
{
    delete m_triangleNormals;
    delete m_axisAlignedBoundingBoxTree;
    delete m_triangleAxisAlignedBoundingBoxes;
}

void SolidMesh::setVertices(const std::vector<Vector3>* vertices)
{
    m_vertices = vertices;
}

void SolidMesh::setTriangles(const std::vector<std::vector<size_t>>* triangles)
{
    m_triangles = triangles;
}

void SolidMesh::prepare()
{
    if (nullptr == m_triangles)
        return;

    m_triangleNormals = new std::vector<Vector3>;
    m_triangleNormals->reserve(m_triangles->size());
    for (const auto& it : *m_triangles) {
        m_triangleNormals->push_back(
            Vector3::normal((*m_vertices)[it[0]],
                (*m_vertices)[it[1]],
                (*m_vertices)[it[2]]));
    }

    //申请与三角形个数相等的AABB包围盒
    m_triangleAxisAlignedBoundingBoxes = new std::vector<AxisAlignedBoudingBox>(m_triangles->size());

    //遍历所有三角形 生成AABB包围盒
    for (size_t i = 0; i < m_triangleAxisAlignedBoundingBoxes->size(); ++i) {
        addTriagleToAxisAlignedBoundingBox((*m_triangles)[i], &(*m_triangleAxisAlignedBoundingBoxes)[i]);
        (*m_triangleAxisAlignedBoundingBoxes)[i].updateCenter();
    }

    //所有AABB包围盒的下表索引
    std::vector<size_t> firstGroupOfFacesIn;
    for (size_t i = 0; i < m_triangleAxisAlignedBoundingBoxes->size(); ++i)
        firstGroupOfFacesIn.push_back(i);

    //因为一直传同一个变量进去，所以当有新的更大的盒子生成的时候，原有的就会被更新
    //所以这里获取的是最外围的包裹整个图形的盒子
    AxisAlignedBoudingBox groupBox;
    for (const auto& i : firstGroupOfFacesIn) {
        addTriagleToAxisAlignedBoundingBox((*m_triangles)[i], &groupBox);
    }
    groupBox.updateCenter();

    m_axisAlignedBoundingBoxTree = new AxisAlignedBoudingBoxTree(m_triangleAxisAlignedBoundingBoxes,
        firstGroupOfFacesIn, groupBox);
}

}
