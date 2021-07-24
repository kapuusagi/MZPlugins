from PIL import Image
import os
import sys

def combine_from_4x2(output_path, filelist):
    """
    ファイルを結合する。

    Parameters
    ----------
    output_path : string
        出力ファイルパス
    filelist : Array<string>
        ファイルリスト
    """
    images = []
    for file in filelist:
        image = Image.open(file)
        images.append(image)
    
    image_width = images[0].width
    image_height = images[0].height
    combine_width = image_width * 4
    combine_height = image_height * 2

    combine_image = Image.new("RGBA", (combine_width, combine_height), (0, 0, 0, 0))
    y = 0
    x = 0
    for image in images:
        combine_image.paste(image, (x * image_width, y * image_height))
        x += 1
        if x >= 4:
            x = 0
            y += 1
    combine_image.save(output_path)

if __name__ == '__main__':
    filecount = max(len(sys.argv) - 1,9)
    filelist = sys.argv[1:filecount]
    if len(filelist) > 0:
        filelist.sort()
        dir = os.path.dirname(filelist[0])
        output_path = dir + os.sep + "output.png"
        combine_from_4x2(output_path, filelist)
    