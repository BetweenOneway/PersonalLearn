import pymongo

# 连接mongodb
client = pymongo.MongoClient(host='localhost',port=27017)

# 查看mongodb中有哪些数据库
print('Client=>',client.list_database_names())

# 访问数据库 如果不存在就创建一个
db = client['test']
print('db=>',db)

# 访问集合 如果不存在就创建一个
collection = db['students']
print('collection=>',collection)

# 插入 重复执行会重复插入
# 在MongoDB中，每一条数据有一个_id作为唯一标识，如果没有显示指明该属性，会自动生成一个
def Create():
    student1 = {
        'id':'20170101',
        'name':'Jordan',
        'age':20,
        'gender':'male'
    }

    result = collection.insert_one(student1)
    print("insert one result=>",result)

    student2 = {
        'id':'20170102',
        'name':'Mike',
        'age':21,
        'gender':'male'
    }

    student3 = {
        'id':'20170103',
        'name':'Kevin',
        'age':20,
        'gender':'male'
    }

    result = collection.insert_many([student2,student3])
    print("insert many result=>",result)
    print(result.inserted_ids)

# 查询
def Read():
    print('>>>>>Read<<<<<<<')
    result = collection.find_one({'name':'Mike'})
    print(type(result))
    print(result)

    # 必须指明条件
    num_active = collection.count_documents({'name':'Mike'})
    print(num_active)

    count=collection.estimated_document_count()
    print('count=>',count)

    # 遍历所有记录
    for doc in collection.find():
        print(doc)

# 更新
def Update():
    print('>>>Update<<<')
    condition = {'name':'Kevin'}
    student = collection.find_one(condition)
    student['age']=25
    newvalues = { "$set": student}
    
    result = collection.update_one(condition, newvalues)
    print(result)
    # 遍历所有记录
    for doc in collection.find():
        print(doc)

    newvalues = { "$set": { "age": "25" } }
    result = collection.update_many(condition, newvalues)
    print(result)

    for doc in collection.find():
        print(doc)

# 删除
def Delete():
    print('>>>Delete<<<')
    result = collection.delete_one({'name':'Kevin'})
    print(result)
    for doc in collection.find():
        print(doc)

    condition = {'name':'Kevin'}
    result = collection.delete_many(condition)
    print(result)
    for doc in collection.find():
        print(doc)

if __name__=='__main__':
    #Create()
    #Read()
    #Update()
    Delete()