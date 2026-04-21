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

if __name__=='__main__':
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