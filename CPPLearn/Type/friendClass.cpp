#include <iostream>

namespace CLASS_TEST {

    class Base;

    class FriendClass
    {
    public:
        void friendFunc();
        void Init(Base* ptr);
    private:
        Base* m_ptr;
    };

    class Base {
    public:
        int m_num;
        friend class FriendClass;
    };

    
    class Concrete :public Base
    {
    public:
        void Add();
        void Init();
        void Get();
    private:
        FriendClass fc;
    };

    void FriendClass::Init(Base* ptr)
    {
        m_ptr = ptr;
    }

    void FriendClass::friendFunc()
    {
        m_ptr->m_num++;
    }

    void Concrete::Add()
    {
        fc.friendFunc();
    }

    void Concrete::Init()
    {
        m_num = 0;
        fc.Init(dynamic_cast<Base *>(this));
    }

    void Concrete::Get()
    {
        std::cout << m_num<<std::endl;
    }

    void testFirendClass()
    {
        Concrete c;
        c.Init();
        c.Add();
        c.Get();
    }
}
