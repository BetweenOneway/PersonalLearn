from elasticsearch import Elasticsearch

# 1. 连接 ES
es = Elasticsearch(hosts=["http://localhost:9200"])

# 2. 查看 ES 信息
print("ES 连接成功：", es.info())

# 3. 创建一条数据
document = {
    "title": "Elasticsearch 学习",
    "content": "Python 连接 ES 成功"
}
response = es.index(index="test_index", id=1, document=document)
print("插入数据：", response)