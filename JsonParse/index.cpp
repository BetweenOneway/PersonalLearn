#include <string>
#include "json/json.h"
#include <iostream>
#include <fstream>
using namespace std;

void readFileJson();
void readFileJson2();

int main(int argc, char* argv[])
{
    readFileJson();
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

    system("pause");
}

void readFileJson2()
{
    std::string strJsonFile("./conf/robot/RobotCutSpeed.json");

    Json::CharReaderBuilder renderBuilder;

    Json::CharReader* reader = renderBuilder.newCharReader();
    Json::Value root;
}
