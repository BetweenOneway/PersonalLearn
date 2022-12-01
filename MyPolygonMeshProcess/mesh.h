#pragma once
#include <vector>
#include "../Vector3/Vector3.h"
class Mesh
{
public:
    Mesh(const std::vector<Vector3>& vertices, const std::vector<std::vector<size_t>>& faces);
};
