#include <vector>
#include <fstream>
#include <sstream>
#include <iostream>

namespace FILE_OPER{
    void testWriteContainerToFile()
    {
        std::vector<char> vec = { 'a','b','\n','c','d' };

        std::ofstream vertsF("../Debug/testWriteContainerToFile.txt");
        for (const auto& c : vec)
        {
            vertsF << c;
        }
        vertsF.close();
    }

    void StingStreamToVector()
    {
        std::stringstream ss;
        ss.clear();
        ss.str("");
        ss << "Hello C++ world!";

        std::cout <<"size="<< ss.str().size() << ",length= " << ss.str().length() << std::endl;

        //stringstream=>vector
        std::string str = ss.str();
        std::vector<char> vec(str.begin(),str.end());

        std::vector<char> vec1;
        vec1.clear();
        vec1.assign(str.begin(), str.end());

        //vec=>stringstream
        ss.clear();
        ss.str("");
        std::copy(vec.begin(), vec.end(), std::ostream_iterator<char>(ss));

        std::cout << ss.str() << std::endl;
    }

}
