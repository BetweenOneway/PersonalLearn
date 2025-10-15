#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <deque>
#include <queue>
#include <array>
#include <unordered_map>
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

void testVectorPointer()
{
    std::vector<int> vi{ 1,2,3 };
    int* p = &(vi.front());

    cout << p << endl;
}

void testVectorAddress()
{
    int i = 6 ,j=5;
    std::vector<int> vec;
    vec.push_back(i);
    vec.push_back(j);

    int* p = &(vec.front());
    cout << p << endl;
}

class testDemo
{
public:
    testDemo(int num) :num(num) {
        std::cout << "调用构造函数" << endl;
    }
    testDemo(const testDemo& other) :num(other.num) {
        std::cout << "调用拷贝构造函数" << endl;
    }
    testDemo(testDemo&& other) :num(other.num) {
        std::cout << "调用移动构造函数" << endl;
    }

    testDemo& operator=(const testDemo& other);
private:
    int num;
};
testDemo& testDemo::operator=(const testDemo& other) {
    this->num = other.num;
    return *this;
}

void testVectorEfficent()
{
    vector<testDemo> v1,v2;
    v1.clear();
    v2.clear();

    vector<testDemo> src{ 1,2,3,4 };
    cout << "=======case 1========" << endl;
    v1.insert(v1.end(), src.begin(), src.end());
    cout << "=====case 2======" << endl;
    for (auto& el : src)
    {
        v2.emplace_back(el);
    }
}

void testVectorInsert()
{
    auto printVector = [&](const std::vector<int>& vec) {
        for (auto& el : vec)
        {
            cout << el << " ";
        }
        cout << endl;
    };
    //insert表示的意思是在指定位置之前插入 insertBefore
    //是否可以在空的vector前插入 可以
    vector<int> ve;
    for (int i = 0; i < 10; i++)
    {
        ve.insert(ve.begin(), i);
    }
    for (auto val : ve)
    {
        cout << val << " ";
    }
    cout << endl;

    {
        //测试是否可以在空容器后插入 => 可以
        vector<int> ve;
        ve.clear();

        vector<int> v1{ 1,2,3,4 };

        ve.insert(ve.end(), v1.begin(), v1.end());

        printVector(ve);
    }

    vector<int> v(5, 5);
    vector<int> v1{ 1,2,3,4 };
    v.insert(v.begin(), v1.begin(), v1.begin() + 3);

    for (auto val : v)
    {
        cout << val << " ";
    }
    cout << endl;

    //插入10个5
    //vector<int> vi(10,5);
    vector<int> vi;
    for (int i = 0; i < 10; i++)
    {
        vi.push_back(i);
    }

    for (auto val : vi)
    {
        cout << val << " ";
    }
    cout << endl;
    auto it = vi.begin();
    advance(it, 3);
    //在给定的位置前插入
    vi.insert(it, 6);
    it = vi.begin();
    advance(it, 3);
    vi.insert(it, 5);
    cout << vi.size() << ": ";
    for (auto val : vi)
    {
        cout << val << " ";
    }
    cout << endl;

    //
    vector<int> vi1(10, 1);
    vector<int> vi2{ 11,22,33,44,55,66 };
    it = vi1.begin();
    advance(it, 3);
    //[)
    vi1.insert(it, vi2.begin() + 2, vi2.begin() + 4);
    for (auto& val : vi1)
    {
        cout << val << " ";
    }
    cout << endl;

}

void testVectorErase()
{
    //erase 包前不包后
    std::vector<int> vec{ 0,1,2,3,4,5,6,7,8,9 };
    //vec.erase(vec.begin() + 2, vec.begin() + 5);
    //测试erase能否跨起点删除 不能会报错
    //vec.erase(vec.begin() + 5, vec.begin() + 2);

    //如果只指定一个位置，表示的是删除该位置元素
    vec.erase(vec.begin() + 2);
    for (auto& val : vec)
    {
        cout << val << " ";
    }
    cout << endl;
}

/*
* 测试vector访问越界
* 测试结果都会报错，但根据cppreference []不会做下标检查 at会做
*/
void testVectorRange()
{
    vector<int> vi(10, 1);
    for (int i = 0; i < 20; i++)
    {
        cout << vi[i] << endl;
    }
    //cout << vi[10] << endl;
    //cout << vi.at(10) << endl;
}

void testVectorConstruct()
{
    std::vector<int>  v1;
    v1.clear();
    for (int i = 0; i < 20; i++)
    {
        v1.push_back(i);
    }

    auto endPos = v1.begin();
    std::advance(endPos, 10);
    std::cout << "endpos = " << *endPos << std::endl;
    //前包后不包
    std::vector<int> v2(v1.begin(), endPos);

    for (const auto& num : v2)
    {
        cout << num << ' ';
    }
    std::cout << std::endl;
}

void CallFunc(std::pair<std::vector<int>, std::vector<int>>&& p)
{
    std::pair<std::vector<int>, std::vector<int>> p1;
    p1.first = std::move(p.first);
    p1.second = std::move(p.second);
    for (auto& val : p1.first)
    {
        cout << val << endl;
    }

    for (auto& val : p1.second)
    {
        cout << val << endl;
    }
}

void testPair()
{
    std::pair<std::vector<int>, std::vector<int>> p{ {1,2,3,4},{5,6,7,8} };
    CallFunc(std::move(p));

    std::pair<std::vector<int>, std::vector<int>> p1{};
    cout << p1.first.size() << " " << p1.second.size() << endl;
}

/*
* 从容量上看vector和Array没啥区别
* 可能更多的是解决原始数组遍历和原始数组传参时长度传递有难度的问题
*/
void compareVectorArray()
{
    array<int, 10> arr;
    vector<int> vec(10);
    cout << "vec.size = "<< vec.size() << ",vec.cap = " << vec.capacity() << endl;
    cout << "arr.size = "<<arr.size() <<",arr.max_size() = " << arr.max_size() << endl;
}

/*测试对于自定义变量 unordered_map是否必须自定义hash函数？
* 如果自定义struct类型的变量呢？必须
* 如果自定义class类型的变量呢？
*/

struct Vector1 {
    float x, y, z;
    bool operator==(Vector1& v) {
        return true;
    };
};

class Vector2 {
public:
    float x, y, z;
};

void testUnorderedMap()
{
    unordered_map<Vector1, int> map1;

}

}
