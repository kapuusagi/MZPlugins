from PIL import Image
import os
import sys

from datetime import datetime


def split_image_to_4x2(path):
    """
    画像をヨコ4、タテ2に分割する。

    Parameters
    ----------
    path : string
        ファイルパス
    """
    image = Image.open(sys.argv[i])
    split_width = int(image.width / 4)
    split_height = int(image.height / 2)

    dir = os.path.dirname(path)
    name = os.path.splitext(os.path.basename(path))[0]

    for y in range(0, 2):
        for x in range(0, 4):
            xoffs = x * split_width
            yoffs = y * split_height
            child_image = image.crop((xoffs, yoffs, xoffs + split_width, yoffs + split_height))
            save_path = dir + os.sep + name + "_" + str(x + 1) + "-" + str(y + 1) + ".png"
            child_image.save(save_path, "PNG")
            del child_image

if __name__ == '__main__':
    # 画像の読み込み
    for i in range(1, len(sys.argv)):
        split_image_to_4x2(sys.argv[i])

    quit()
