#include <iostream>
using namespace std;

class Obj
{
public:
	Obj(int i) :num(i) {}
	int getNum() {
		return num;
	}
	Obj& operator=(const Obj& in)
	{
		this->num = in.num;
		return *this;
	}
private:
	int num;
};

void func(Obj& in)
{
	auto var = Obj(1);
	in = Obj(1);
}

int main()
{
	Obj obj(2);
	cout << obj.getNum() << endl;
	func(obj);
	cout << obj.getNum() << endl;
	cin.get();
	return 0;
}