#include <iostream>
#include <string>
#include <vector>

// 抽象构件类（对应 C# abstract class Component）
class Component
{
protected:
    std::string name;
public:
    Component(std::string n) : name(std::move(n)) {}

    // 纯虚函数 = 抽象方法
    virtual void Add(Component* c) = 0;
    virtual void Remove(Component* c) = 0;
    virtual void Display(int depth) = 0;

    // 虚析构：多态删除必备
    virtual ~Component() = default;
};

// 叶子节点 Leaf
class Leaf : public Component
{
public:
    Leaf(std::string n) : Component(std::move(n)) {}

    void Add(Component* c) override
    {
        std::cout << "Can't add to a leaf" << std::endl;
    }

    void Remove(Component* c) override
    {
        std::cout << "Can't remove from a leaf" << std::endl;
    }

    void Display(int depth) override
    {
        // 输出 depth 个 '-'
        for (int i = 0; i < depth; ++i)
            std::cout << '-';
        std::cout << name << std::endl;
    }
};

// 组合节点 Composite
class Composite : public Component
{
private:
    std::vector<Component*> children;
public:
    Composite(std::string n) : Component(std::move(n)) {}

    void Add(Component* c) override
    {
        children.push_back(c);
    }

    void Remove(Component* c) override
    {
        // 查找并删除对应子节点
        for (auto it = children.begin(); it != children.end(); ++it)
        {
            if (*it == c)
            {
                children.erase(it);
                break;
            }
        }
    }

    void Display(int depth) override
    {
        for (int i = 0; i < depth; ++i)
            std::cout << '-';
        std::cout << name << std::endl;

        // 递归遍历子节点
        for (Component* child : children)
        {
            child->Display(depth + 2);
        }
    }
};

int CompositeTest()
{
    Composite* root = new Composite("root");
    root->Add(new Leaf("Leaf A"));
    root->Add(new Leaf("Leaf B"));

    Composite* comp = new Composite("Composite X");
    comp->Add(new Leaf("Leaf XA"));
    comp->Add(new Leaf("Leaf XB"));
    root->Add(comp);

    Composite* comp2 = new Composite("Composite XY");
    comp2->Add(new Leaf("Leaf XYA"));
    comp2->Add(new Leaf("Leaf XYB"));
    comp->Add(comp2);

    root->Add(new Leaf("Leaf C"));

    Leaf* leaf = new Leaf("Leaf D");
    root->Add(leaf);
    root->Remove(leaf);

    root->Display(1);

    return 0;
}
