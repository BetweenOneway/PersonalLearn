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

if __name__=='__main__':
    Captcha2()