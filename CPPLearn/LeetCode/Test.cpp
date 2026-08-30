#include "Test.h"
#include "Sort.h"

void TestSor()
{
    std::vector<int> toSortNums = { 10,9,8,7,6,5,4,3,2,1,0 };
    quickSort(toSortNums, 0, toSortNums.size());


}
