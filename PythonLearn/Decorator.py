from functools import wraps

class Student:
    # 类属性（所有学生共享）
    school = "第一中学"

    def __init__(self, name):
        # 实例属性（每个对象独有）
        self.name = name

    # ======================
    # 1. 普通实例方法（必须 self）
    # ======================
    def show_name(self):
        # 能访问：self.name（实例） + Student.school（类）
        return f"我是 {self.name}，来自 {Student.school}"

    # ======================
    # 2. @classmethod 类方法（必须 cls）
    # ======================
    @classmethod
    def change_school(cls, new_school):
        # cls 就是 Student 类本身
        print('cls.school=>',cls.school)
        cls.school = new_school  # 修改类属性

    @classmethod
    def from_string(cls, name_str):
        # 最经典用途：备用构造器，创建对象
        return cls(name_str)  # 等价 Student(name_str)

    # ======================
    # 3. @staticmethod 静态方法（无self、无cls）
    # ======================
    @staticmethod
    def is_adult(age):
        # 只是一个普通函数，只是碰巧写在类里
        # 完全不能访问 self 或 cls
        return age >= 18

class Person:
    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("年龄不能为负")
        self._age = value

class Person1:
    def __init__(self, age):
        self._age = age

    @property
    def age(self):
        return self._age

def logNoWrap(func):
    def wrapper(*args, **kwargs):
        print(f"调用函数: {func.__name__}")
        res = func(*args, **kwargs)
        print(f"函数 {func.__name__} 执行完毕")
        return res
    return wrapper

@logNoWrap
def addNoWrap(a, b):
    """两数相加"""
    return a + b

from functools import wraps

def logWrap(func):
    @wraps(func)  # 只加这一行
    def wrapper(*args, **kwargs):
        print(f"调用函数: {func.__name__}")
        res = func(*args, **kwargs)
        print(f"函数 {func.__name__} 执行完毕")
        return res
    return wrapper

@logWrap
def addWrap(a, b):
    """两数相加"""
    return a + b

def functionDecorator():
    # 关键在这里！打印函数名字
    print("函数名：", addNoWrap.__name__)
    print("文档字符串：", addNoWrap.__doc__)
    
    print("wrapped函数名：", addWrap.__name__)
    print("wrapped文档字符串：", addWrap.__doc__)

def classDecorator():
    s = Student("小明")
    print(s.show_name())  # 我是 小明，来自 第一中学

    # 改类属性
    Student.change_school("第二中学")
    print(Student.school)  # 第二中学

    # 备用构造器（超级常用）
    s2 = Student.from_string("小红")
    print(s2.name)  # 小红

    print(Student.is_adult(20))  # True
    print(Student.is_adult(15))  # False

    ##############################
    # 使用
    p = Person()

    # 赋值 → 自动调用 @age.setter
    p.age = 20
    print(p.age)  # 20 → 调用 @property

    # 赋值非法值 → 直接报错
    #p.age = -5

    p1 = Person1(20)
    print(p1.age)   # 可以读
    p1.age = 30     # 报错：can't set attribute

from functools import singledispatch

# 1. 定义一个主函数，作为默认版本
@singledispatch
def process(x):
    print(f"默认处理：{x}，类型：{type(x)}")


# 2. 注册 int 类型的处理逻辑
@process.register(int)
def _(x):
    print(f"处理整数：{x}")


# 3. 注册 str 类型的处理逻辑
@process.register(str)
def _(x):
    print(f"处理字符串：{x}")


# 4. 注册 list 类型
@process.register(list)
def _(x):
    print(f"处理列表，长度：{len(x)}")

def testSingleDispatch():
    process(123)        # 处理整数：123
    process("hello")    # 处理字符串：hello
    process([1,2,3])    # 处理列表，长度：3
    process(3.14)       # 默认处理：3.14，类型：<class 'float'>

from functools import total_ordering

@total_ordering
class StudentCmp:
    def __init__(self, score):
        self.score = score

    # 必须实现相等
    def __eq__(self, other):
        return self.score == other.score

    # 只需要再实现一个小于
    def __lt__(self, other):
        return self.score < other.score

def testOrdering():
    s1 = StudentCmp(60)
    s2 = StudentCmp(80)
    s3 = StudentCmp(80)

    print(s1 < s2)   # True
    print(s1 > s2)   # False
    print(s1 <= s2)  # True
    print(s2 >= s3)  # True
    print(s2 == s3)  # True

if __name__=='__main__':
    #functionDecorator()
    #testSingleDispatch()
    testOrdering()