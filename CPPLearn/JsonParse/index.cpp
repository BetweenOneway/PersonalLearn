#include <string>
#include "json/json.h"
#include <iostream>
#include <fstream>
using namespace std;

void readFileJson();
void readFileJson2();

int main(int argc, char* argv[])
{
    readFileJson2();
    //system("pause");
    return 0;
}

void readFileJson()
{
    Json::Reader reader;
    Json::Value root;

    //确认文件读取状态
    ifstream in("./test.json", ios::binary);

    if (!in.is_open())
    {
        cout << "Error opening file\n";
        return;
    }

    /*
    //test.json内容：
    {
        "name":"Mike Jiang",
        "age":23,
        "sex_is_male":true,
        "partner":
        {
            "partner_name":"Galatea",
            "partner_age":21,
            "partner_sex_is_male":false
        },
        "achievement":["ach1","ach2","ach3"]
    }
    */

    if (reader.parse(in, root))
    {
        string name = root["name"].asString();
        int age = root["age"].asInt();
        bool sexIsM = root["sex_is_male"].asBool();

        cout << "My name is " << name << endl;
        cout << "I`m " << age << endl;
        cout << "I`m a " << (sexIsM ? "man" : "woman") << endl;

        //读取子节点--字典
        const Json::Value partner = root["partner"];
        cout << partner["partner_name"] << endl;
        vector<string> keys = partner.getMemberNames();
        for (unsigned int i = 0; i < keys.size(); i++) {
            cout << partner[keys[i]];
        }
        //读取子节点--列表
        const Json::Value achievement = root["achievement"];
        for (unsigned int i = 0; i < achievement.size(); i++) {
            cout << achievement[i].asString() << endl;
        }
    }

    //system("pause");
}

void readFileJson2()
{
    Json::Reader reader;
    Json::Value root;

    //确认文件读取状态
    ifstream in("./newFormat.json", ios::binary);

    if (!in.is_open())
    {
        cout << "Error opening file\n";
        return;
    }

    //std::string line;
    //while (std::getline(in, line)) {
    //    std::cout << line << std::endl; // 输出文件中的每一行内容
    //}

    if (reader.parse(in, root))
    {
        const Json::Value cutSpeedConfigList = root["CustomizeCutSpeedConfig"];
        for (int i = 0; i < cutSpeedConfigList.size(); i++)
        {
            const Json::Value cutSpeedConfig = cutSpeedConfigList[i];
            const Json::Value productSeries = cutSpeedConfig["ProductSeries"];
            cout << "ProductSeries:";
            for (int index = 0; index < productSeries.size(); index++)
            {
                cout << productSeries[index].asString() << " ";
            }
            cout << endl;

            //"CutSpeedPartList": [ "CutSpeedPart1", "CutSpeedPart2", "CutSpeedPart3" ],
            const Json::Value cutSpeedPartList = cutSpeedConfig["CutSpeedPartList"];
            for (int j = 0; j < cutSpeedPartList.size(); j++)
            {
                string cutSpeedPartName = cutSpeedPartList[j].asString();
                const Json::Value cutSpeedPartConfig = cutSpeedConfig[cutSpeedPartName];

                const Json::Value toothFDIList = cutSpeedPartConfig["toothFDIList"];
                cout << "toothFDIList:";
                for (int k = 0; k < toothFDIList.size(); k++)
                {
                    cout << toothFDIList[k].asInt()<<" ";
                }
                cout << endl;

                cout << "speed:" << cutSpeedPartConfig["cutSpeed"].asDouble() << endl;
                cout << "side:" << (cutSpeedPartConfig["isLipSide"].asBool() == true?"lip":"tongue") << endl;
            }
        }
    }
    else
    {
        cout << "文件解析失败" << endl;
    }

    
}
