#pragma once
namespace CLASS_TEST {
    void Call();
    class classBase {
    public:
        virtual void SayHello() final;
        virtual void SayHi();
        void test()
        {
            Call();
        }
    };

    class child :public classBase
    {
    public:
        void SayHi() override;
        void SayHello()const;
        void Call();
    };


    void testFinalOvertide();

    void testNew();

    void testInherit();
}
