import tesserocr
from PIL import Image
import numpy as np

def Captcha1():
    image = Image.open('captcha.png')
    result = tesserocr.image_to_text(image)
    print(result)
    print(tesserocr.file_to_text('./material/captcha.png'))

def Captcha2():
    image = Image.open('./material/captcha2.png')
    print(np.array(image).shape)
    print(image.mode)

    image = image.convert('L')
    # 灰度图阈值
    threshold = 100
    # 将PIL图像转换为numpy数组，方便数值操作
    array = np.array(image)
    # 核心二值化逻辑：按阈值分割像素值
    array = np.where(array > threshold,255,0)
    # 将numpy数组转回PIL图像（注意要指定数据类型为uint8，否则会报错）
    image = Image.fromarray(array.astype('uint8'))
    image.show()
    result = tesserocr.image_to_text(image)
    print(result)

if __name__=='__main__':
    Captcha2()