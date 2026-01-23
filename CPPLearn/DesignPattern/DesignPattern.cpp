// DesignPattern.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include <iostream>
#include <string>
using namespace std;
// 基础手机类
class Phone {
public:
    virtual void showDecorate() = 0;
    virtual ~Phone() {}
};
// 具体的手机类
class iPhone : public Phone {
private:
    string name;
public:
    iPhone(string _name) : name(_name) {}
    void showDecorate() {
        cout << name << "的装饰" << endl;
    }
};
// 具体的手机类
class NokiaPhone : public Phone {
private:
    string name;
public:
    NokiaPhone(string _name) : name(_name) {}
    void showDecorate() {
        cout << name << "的装饰" << endl;
    }
};
// 装饰器基类
class DecoratorPhone : public Phone {
protected:
    Phone* m_phone;
public:
    DecoratorPhone(Phone* phone) : m_phone(phone) {}
    virtual void showDecorate() {
        m_phone->showDecorate();
    }
};
// 具体的装饰类A
class DecoratePhoneA : public DecoratorPhone {
public:
    DecoratePhoneA(Phone* ph) : DecoratorPhone(ph) {}
    void showDecorate() {
        DecoratorPhone::showDecorate();
        AddDecorate();
    }
private:
    void AddDecorate() {
        cout << "增加挂件" << endl;
    }
};
// 具体的装饰类B
class DecoratePhoneB : public DecoratorPhone {
public:
    DecoratePhoneB(Phone* ph) : DecoratorPhone(ph) {}
    void showDecorate() {
        DecoratorPhone::showDecorate();
        AddDecorate();
    }
private:
    void AddDecorate() {
        cout << "屏幕贴膜" << endl;
    }
};
// 客户端代码
int main() {
    Phone* ph = new NokiaPhone("16300");
    Phone* dpa = new DecoratePhoneA(ph); // 增加挂件
    Phone* dpb = new DecoratePhoneB(ph); // 增加贴膜
    //16300的装饰
    ph->showDecorate();
    //16300的装饰
    //增加挂件
    dpa->showDecorate();
    //16300的装饰
    //屏幕贴膜
    dpb->showDecorate();

    delete ph;
    delete dpa;
    delete dpb;
    return 0;
}

