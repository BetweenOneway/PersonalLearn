#include <iostream>
#include <exception>
using namespace std;
#include "exception.h"

namespace EXCEPTION {
    class overflow :public exception
    {
    private:
        const char* what() const throw()
        {
            return "栈满";
        }
    };

    void testException()
    {

        try
        {
            //throw overflow();
            //throw "test";
            throw std::runtime_error("An error occurred");
            //cout << "hello" << endl;
        }
        catch (exception& ex)
        {
            cout << ex.what() << endl;
        }
        catch (...)
        {
            cout << "final catch" << endl;
        }
    }
}
