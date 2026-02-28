# -*- coding: UTF-8 -*-
import os

# 验证码中的字符
# string.digits + string.ascii_uppercase
NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
            'V', 'W', 'X', 'Y', 'Z']

ALL_CHAR_SET = NUMBER + ALPHABET
ALL_CHAR_SET_LEN = len(ALL_CHAR_SET)
MAX_CAPTCHA = 4

# 图像大小
IMAGE_HEIGHT = 60
IMAGE_WIDTH = 160

# 训练集所在的路径，数据用千模型的训练
TRAIN_DATASET_PATH = 'dataset' + os.path.sep + 'train'
# 验证集所在的路径，一般在训练过程中或者训练完毕后用到，可用于验证模型的训练效果。
EVAL_DATASET_PATH = 'dataset' + os.path.sep + 'eval'
# 推理集，一般在训练完毕后用到，可用于模型推理和测试
PREDICT_DATASET_PATH = 'dataset' + os.path.sep + 'predict'
