import re

def replace_chinese_punctuation_with_english(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 定义中文标点和对应的英文标点
    chinese_punctuation = '，；：“”‘’（）'
    english_punctuation = ',;:""\'\'()'
    
    translation_table = str.maketrans(chinese_punctuation, english_punctuation)
    modified_content = content.translate(translation_table)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(modified_content)

input_file = '无名杀技能函数手册.js'  # 替换为你的输入文件名
output_file = input_file

replace_chinese_punctuation_with_english(input_file, output_file)