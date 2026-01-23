import tesserocr
from PIL import Image

image = Image.open('captcha.png')
result = tesserocr.image_to_text(image)
print(result)