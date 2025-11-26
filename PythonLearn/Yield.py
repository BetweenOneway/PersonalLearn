def Generator(max):
   n, a, b = 0, 0, 1
   while n < max:
       yield b
       a, b = b, a + b # 1 1 2 3 5
       # b,a = b,a+b # 1 1 1 1 1

       # 1 2 4 8 16
       # a = b
       # b = a+b
       n += 1

def Iterator():
    list=[1,2,3,4]
    it = iter(list)    # 创建迭代器对象
    for x in it:
        print (x, end=" ")

def Iterator1():
    list=[1,2,3,4]
    it = iter(list)    # 创建迭代器对象
    print (next(it))   # 1
    print (next(it)) # 2


def CallGenerator():
    for val in Generator(5):
        print(val)

def countdown(n):
    while n > 0:
        yield n
        n -= 1

def Generator1():
    # 创建生成器对象
    generator = countdown(5)
    
    # 通过迭代生成器获取值
    print(next(generator))  # 输出: 5
    print(next(generator))  # 输出: 4
    print(next(generator))  # 输出: 3
    
    # 使用 for 循环迭代生成器
    for value in generator:
        print(value)  # 输出: 2 1

if __name__ == '__main__':
    Generator1()