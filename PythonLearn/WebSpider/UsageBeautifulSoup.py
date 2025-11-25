from bs4 import BeautifulSoup

html_str = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>
<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1"><!-- Elsie --></a>,
<a href="http://example.com/lacie" class="sister" id="link2"><!-- Lacie --></a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>
<p class="story">...</p>
</body></html>
"""

# 更换解析器为 html.parser（无需安装额外依赖）
# soup = BeautifulSoup(html_str, 'html.parser')
# python3默认编码就是unicode，所以from_encoding='utf-8'可以去掉
soup = BeautifulSoup(html_str,'lxml')

print(soup.prettify())
# 根文档名称 [document]
print(soup.name)
# 标签title的名称 title
print(soup.title.name)
# 标签a对象 完整标签 仅输出第一个
print(soup.a)
# 标签p对象
print(soup.p)

# 访问标签具体属性 下面两种方式结果一样
print(soup.p['class'])
print(soup.p.get('class'))

# soup.p['class'] = "myClass"
# print(soup.p['class'])

# 获取标签所有属性 返回对象
print(soup.a.attrs)

print(soup.p.string)
print(type(soup.p.string))
print("soup.find=>", soup.find('p', class_="title"))