#include <iostream>
#include <string>
#include <unordered_set>

namespace {
	class Student
	{
	public:
		std::string name;
		std::string id;

	public:
		bool operator ==(const Student& other) const
		{
			return this->name == other.name && this->id == other.id;
		}

		bool operator()(const Student& _Left, const Student& _Right) const
		{
			return _Left == _Right;
		}
	};

	static size_t myHash(const Student& self) noexcept
	{
		static 	std::hash<std::string> hash_str;
		return hash_str(self.name);
	}
}

int testHash()
{
	std::unordered_set<Student, decltype(&myHash)> unordered_setVec;
	unordered_setVec.insert(Student());

	return 0;
}

