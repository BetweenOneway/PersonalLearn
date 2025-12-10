def testArray():
    requested_toppings = []
    if requested_toppings:
        print("not empty list")
    else:
        print("empty list")

def testFormatString():
    name ="Alice"
    age=25
    print("Hello, %s. You are %d years old." % (name, age))
    
    print("Hello format-1, {}. You are {} years old.".format(name, age))

    print(f"Hello format-2, {name}. You are {age} years old.")

    template = "{name} is {age} years old."
    
    print(template.format(name=name, age=age))

if __name__=="__main__":
    testFormatString()