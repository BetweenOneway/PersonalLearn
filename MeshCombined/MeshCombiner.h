#include <memory>
#include <vector>

#include "vector3.h"
#include "solid_mesh.h"

namespace dust3d {
    class MeshCombiner;
    class Mesh {
    public:
        Mesh() = default;
        Mesh(const std::vector<Vector3>& vertices, const std::vector<std::vector<size_t>>& faces);
        Mesh(const Mesh& other);
        ~Mesh();
        void fetch(std::vector<Vector3>& vertices, std::vector<std::vector<size_t>>& faces) const;
        bool isNull() const;

        friend MeshCombiner;

    private:
        std::unique_ptr<SolidMesh> m_solidMesh;
        std::unique_ptr<std::vector<Vector3>> m_vertices;
        std::unique_ptr<std::vector<std::vector<size_t>>> m_triangles;
    };

    class MeshCombiner {
    public:
        enum class Method {
            Union,
            Diff
        };

        enum class Source {
            None,
            First,
            Second
        };

        static Mesh* combine(const Mesh& firstMesh, const Mesh& secondMesh, Method method,
            std::vector<std::pair<Source, size_t>>* combinedVerticesComeFrom = nullptr);
    };
}