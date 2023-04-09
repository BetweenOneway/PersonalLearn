#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <deque>
#include <queue>

using namespace std;

#include "container.h"
namespace CONTAINER_TEST {

template <typename T>  struct ST {
	T x;
	T y;
	T z;
	const T& operator[](unsigned i) const { return  ((T*)(&x))[i]; }
	ST(T x, T y, T z)
	{
		this->x = x;
		this->y = y;
		this->z = z;
	}
	ST(const ST& ref)
	{
		cout << "call copy constructor" << endl;
		this->x = ref.x;
		this->y = ref.y;
		this->z = ref.z;
	}
};

void test()
{
	vector<int> vec{ 1,2,3,4,5,6,7,8,9 };
	auto result = minmax_element(vec.begin(), vec.end(), [](int l, int r) {return l < r; });
	cout << *result.first << "," << *result.second << endl;
}

void test1()
{
	for (int i = 0; i < 10 && i != 5; i++)
	{
		cout << i << endl;
	}
}

void test2()
{
	struct ST<int> sti { 1, 2, 3 };
	cout << sti[0] << " " << sti[1] << " " << sti[2] << endl;
}

void test3()
{
	ST<int> st1{ 1,2,3 };
	ST<int> st2{ 4,5,6 };
	vector<ST<int>> vecSt;
	cout << "start push_back" << endl;
	vecSt.push_back(st1);
	vecSt.push_back(st2);

}

void test4()
{
    vector<vector<int>> vecContainer;
    //是vecContainer有了30个容量
    vecContainer.resize(30);

    vector<int> veci;
    veci.insert(veci.end(),5);
    veci.insert(veci.end(), 10);

    //resize数据不会被清空
    veci.resize(10);
    veci.clear();
    return;
}

/*
测试vector不resize / reserve的情况下能否直接插入数据
结果是可以的
*/
void test5()
{
    vector<int> vint;
    for (int i = 0; i < 10; i++)
    {
        vint.push_back(i);
    }
    for (auto i : vint)
    {
        cout << i << "\t";
    }
    cout << endl;
}

void testClear()
{
    vector<int> vec{ 1,2,3,4 };
    int size = vec.size();
    cout << "before clear size=" << size << endl;
    vec.clear();
    size = vec.size();
    cout << "after clear size=" << size << endl;

}

template<typename T1> class RationStack
{
public:
    RationStack(unsigned int size)
    {
        capacity = size;
    }
    void push(const T1& val)
    {
        if (container.size() >= capacity)
        {
            container.pop();
        }
        container.push(val);
    }
    T1& top()
    {
        return container.top();
    }
    void pop()
    {
        if (container.empty())
        {
            return;
        }
        container.pop();
    }
    unsigned int size()
    {
        return capacity;
    }
private:
    unsigned int capacity;
    stack<T1> container;
};

//栈不支持固定大小
void testStack()
{
    RationStack<int> rs(4);
    rs.push(1);
    rs.push(2);
    rs.push(3);
    rs.push(4);
    rs.push(5);
    int all = rs.size();
    for (int i = 0; i < all; i++)
    {
        cout << rs.top() << endl;
        rs.pop();
    }
}

template<typename T1> class RationPriorityQueue
{
public:
    RationPriorityQueue(unsigned int size)
    {
        capacity = size;
    }
    void push(const T1& val)
    {
        if (container.size() >= capacity)
        {
            container.pop();
        }
        container.push(val);
    }
    void pop()
    {
        if (container.empty())
        {
            return;
        }
        container.pop();
    }
    const T1& top()
    {
        return container.top();
    }
    unsigned int size()
    {
        return capacity;
    }

private:
    //对于基础类型 默认是大顶堆
    //等同于priority_queue<int, vector<int>, less<int> >
    priority_queue<T1> container;
    unsigned int capacity;
};

void testPriorityQueue()
{
    RationPriorityQueue<int> rpq(4);
    rpq.push(1);
    rpq.push(2);
    rpq.push(3);
    rpq.push(4);
    rpq.push(5);
    int all = rpq.size();
    for (int i = 0; i < all; i++)
    {
        cout << rpq.top() << endl;
        rpq.pop();
    }
}

//queue是先进先出队列
template<typename T1> class RationQueue
{
public:
    RationQueue(unsigned int size)
    {
        capacity = size;
    }
    unsigned int size()
    {
        return capacity;
    }
    void push(const T1& val)
    {
        while (container.size() >= capacity)
        {
            pop();
        }
        container.push(val);
    }
    void pop()
    {
        container.pop();
    }
    const T1& front()
    {
        return container.front();
    }

    const T1& back()
    {
        return container.back();
    }
    bool empty()
    {
        return container.empty();
    }
private:
    queue<T1> container;
    unsigned int capacity;
};
void testQueue()
{
    RationQueue<int> rq(4);
    rq.push(1);
    rq.push(2);
    rq.push(3);
    rq.push(4);
    rq.push(5);
    rq.push(0);

    int all = rq.size();
    while (!rq.empty())
    {
        cout << rq.front() << endl;
        rq.pop();
    }
}

void testVectorInsert()
{
    vector<int> v(5, 5);
    vector<int> v1{1,2,3,4};
    //[)
    v.insert(v.begin(), v1.begin(), v1.begin()+3);

    for (auto val : v)
    {
        cout << val<<" ";
    }
    cout << endl;
}

<<<<<<< HEAD
void testVectorPointer()
{
	std::vector<int> vi{ 1,2,3 };
	int* p = &(vi.front());

	cout << p << endl;
=======
void testVectorAddress()
{
    int i = 6 ,j=5;
    std::vector<int> vec;
    vec.push_back(i);
    vec.push_back(j);

    int* p = &(vec.front());
    cout << p << endl;
>>>>>>> 0726007fd796ab1223b3dfbca0b982e858a0e3eb
}

}
