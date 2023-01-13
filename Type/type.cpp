#include <iostream>
using namespace std;

enum class Color:int {
    Red,
    Yellow
};

int main()
{
    Color color = Color::Red;

    int i = static_cast<int>(color);
    system("pause");
    return 0;
}
