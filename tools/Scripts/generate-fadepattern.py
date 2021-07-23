import tkinter
import pdb
import PIL
from PIL import Image
import numpy
import math

picture_size = None

class Application(tkinter.Frame):
    """
    アプリケーションクラス
    """
    def __init__(self, master=None):
        """初期化する。

        Parameters
        ----------
        master : Tk
            ルートフレーム
        """
        super().__init__(master)
        self._master = master
        self._result = "cancel"
        self._picture_size = None

        self._master.title("Set size")
        self._master.geometry("220x140")
        self._create_widgets()
        self.place(x=0, y=0, width=220, height=140)
        

    def _create_widgets(self):
        """ウィジェットを作成する。
        """
        tkinter.Label()
        label1 = tkinter.Label(self, text="Picture Width", anchor="w")
        label1.place(x=20, y=20, width=100)

        self._entry_width = tkinter.Entry(self, font=20)
        self._entry_width.insert(tkinter.END, "640")
        self._entry_width.place(x=140, y=20, width=60)

        label2 = tkinter.Label(self, text="Picture Height", anchor="w")
        label2.place(x=20, y=50, width=100)

        self._entry_height = tkinter.Entry(self, font=20)
        self._entry_height.insert(tkinter.END, "360")
        self._entry_height.place(x=140, y=50, width=60)

        self._ok_button = tkinter.Button(self, text="OK", command=self._on_OK_click)
        self._ok_button.place(x=20, y=80, width=60, height=24)

        self._cancel_button = tkinter.Button(self, text="Cancel", command=self._on_Cancel_click)
        self._cancel_button.place(x=100, y=80, width=60, height=24)


    def _on_OK_click(self):
        """OK操作されたときのコールバック処理
        """
        self._result = "ok"
        width_str = self._entry_width.get()
        height_str = self._entry_height.get()
        self._picture_size = int(width_str), int(height_str)
        self._master.destroy()

    def _on_Cancel_click(self):
        """Cancel操作されたときのコールバック処理
        """
        self._master.destroy()

    def result(self):
        """結果を得る。

        Returns
        -------
        result : string
            OK操作された場合には"ok"が返る。キャンセル操作されたときは"cancel"が返る。
        """
        return self._result

    def picture_size(self):
        """入力された画像サイズを返す。

        Returns
        -------
        size : (int, int)
            (width, height)のタプルを返す。
        """
        return self._picture_size

def export_fade_pattern1(image_buf, path):
    """フェードパターン1(左から右へフェードアウト)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    for x in range(0, width):
        d = round((x + 1) / width * 255)
        for y in range(0, height):
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern2(image_buf, path):
    """フェードパターン2(右から左へフェードアウト)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    for x in range(0, width):
        d = round((width - x - 1) / width * 255)
        for y in range(0, height):
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern3(image_buf, path):
    """フェードパターン3(上から下へフェードアウト)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    for y in range(0, height):
        d = round((y + 1) / height * 255)
        for x in range(0, width):
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern4(image_buf, path):
    """フェードパターン4(下から上へフェードアウト)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    for y in range(0, height):
        d = round((height - y + 1) / height * 255)
        for x in range(0, width):
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern5(image_buf, path):
    """フェードパターン5(左上から右下)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    total = width + height
    for y in range(0, height):
        for x in range(0, width):
            d = round((x + y + 2) / total * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern6(image_buf, path):
    """フェードパターン6(右下から左下)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    total = width + height
    for y in range(0, height):
        for x in range(0, width):
            d = round((width - x + y) / total * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern7(image_buf, path):
    """フェードパターン7(左下から右上)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    total = width + height
    for y in range(0, height):
        for x in range(0, width):
            d = round((x + height - y) / total * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern8(image_buf, path):
    """フェードパターン8(右下から左下)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    total = width + height
    for y in range(0, height):
        for x in range(0, width):
            d = round((width - x + height - y + 2) / total * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern9(image_buf, path):
    """フェードパターン9(ストライプ調 左右)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    y_strip_count = 10
    y_strip_height = height / y_strip_count
    for y in range(0, height):
        for x in range(0, width):
            strip_num = int(y / y_strip_height)
            if (strip_num & 1) == 0:
                d = round((x + 1) / width * 255)
            else:
                d = round((width - x - 1) / width * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern10(image_buf, path):
    """フェードパターン10(ストライプ調 上下)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    x_strip_count = 20
    x_strip_width = width / x_strip_count
    for y in range(0, height):
        for x in range(0, width):
            strip_num = int(x / x_strip_width)
            if (strip_num & 1) == 0:
                d = round((y + 1) / height * 255)
            else:
                d = round((height - y - 1) / height * 255)
            image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern11(image_buf, path):
    """フェードパターン11(円形で中央から外)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    x_center = width / 2
    y_center = height / 2

    # 半径計算
    r = numpy.sqrt(numpy.power(width / 2, 2) + numpy.power(height / 2, 2))

    # 超計算が重いので、1/4だけ計算して後は複製するロジックを流す
    for y in range(0, height):
        for x in range(0, width):
            if (x <= x_center) and (y <= y_center):
                distance = numpy.sqrt(numpy.power(x_center - x, 2) + numpy.power(y_center - y, 2))
                image_buf[y, x] = round(distance / r * 255)
            elif (x <= x_center):
                src_x = x
                src_y = height - y - 1
                image_buf[y, x] = image_buf[src_y, src_x]
            elif (y <= y_center):
                src_x = width - x - 1
                src_y = y
                image_buf[y, x] = image_buf[src_y, src_x]
            else:
                src_x = width - x - 1
                src_y = height - y - 1
                image_buf[y, x] = image_buf[src_y, src_x]
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern12(image_buf, path):
    """フェードパターン12(円形で外から中央)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    x_center = width / 2
    y_center = height / 2

    # 半径計算
    r = numpy.sqrt(numpy.power(width / 2, 2) + numpy.power(height / 2, 2))

    # 超計算が重いので、1/4だけ計算して後は複製するロジックを流す
    for y in range(0, height):
        for x in range(0, width):
            if (x <= x_center) and (y <= y_center):
                distance = numpy.sqrt(numpy.power(x_center - x, 2) + numpy.power(y_center - y, 2))
                image_buf[y, x] = round((r - distance) / r * 255)
            elif (x <= x_center):
                src_x = x
                src_y = height - y - 1
                image_buf[y, x] = image_buf[src_y, src_x]
            elif (y <= y_center):
                src_x = width - x - 1
                src_y = y
                image_buf[y, x] = image_buf[src_y, src_x]
            else:
                src_x = width - x - 1 
                src_y = height - y - 1
                image_buf[y, x] = image_buf[src_y, src_x]
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern13(image_buf, path):
    """フェードパターン13(チェック調 左から右)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    x_strip_count = 20
    x_strip_width = width / x_strip_count
    y_strip_count = 10
    y_strip_height = height / y_strip_count
    for y in range(0, height):
        for x in range(0, width):
            strip_num = int(x / x_strip_width) + int(y / y_strip_height)
            if (strip_num & 1) == 0:
                x_left = x % x_strip_width
                d = round((x_left + 1) / x_strip_width * 128)
                image_buf[y, x] = d
            else:
                x_left = x % x_strip_width
                d = round((x_left + 1) / x_strip_width * 128) + 127
                image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern14(image_buf, path):
    """フェードパターン14(チェック調 右から左)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)
    x_strip_count = 20
    x_strip_width = width / x_strip_count
    y_strip_count = 10
    y_strip_height = height / y_strip_count
    for y in range(0, height):
        for x in range(0, width):
            strip_num = int(x / x_strip_width) + int(y / y_strip_height)
            if (strip_num & 1) == 0:
                x_left = x % x_strip_width
                d = round((x_strip_width - x_left - 1) / x_strip_width * 128)
                image_buf[y, x] = d
            else:
                x_left = x % x_strip_width
                d = round((x_strip_width - x_left - 1) / x_strip_width * 128) + 127
                image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern15(image_buf, path):
    """フェードパターン15(中央から左右へ開く)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    x_center = width / 2

    for y in range(0, height):
        for x in range(0, width):
            if (x <= x_center):
                d = round((x_center - x) / x_center * 255)
                image_buf[y, x] = d
            else:
                d = round((x + 1 - x_center) / x_center * 255)
                image_buf[y, x] = d

    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern16(image_buf, path):
    """フェードパターン16(左右から中央へ)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    x_center = width / 2

    for y in range(0, height):
        for x in range(0, width):
            if (x <= x_center):
                d = round(x / x_center * 255)
                image_buf[y, x] = d
            else:
                d = round((width - x - 1) / x_center * 255)
                image_buf[y, x] = d
    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern17(image_buf, path):
    """フェードパターン17(中央から上下へ開く)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    y_center = height / 2

    for y in range(0, height):
        d = 0
        if (y <= y_center):
            d = round((y_center - y) / y_center * 255)
        else:
            d = round((y + 1 - y_center) / y_center * 255)
        for x in range(0, width):
            image_buf[y, x] = d

    image = Image.fromarray(image_buf)
    image.save(path)
    del image

def export_fade_pattern18(image_buf, path):
    """フェードパターン18(上下から中央へ)を出力する

    Parameters
    ----------
    image_buf : numpy.array
        画像バッファ
    """
    width = len(image_buf[0])
    height = len(image_buf)

    y_center = height / 2

    for y in range(0, height):
        d = 0
        if (y <= y_center):
            d = round(y / y_center * 255)
        else:
            d = round((y_center - y - 1) / y_center * 255)
        for x in range(0, width):
            image_buf[y, x] = d

    image = Image.fromarray(image_buf)
    image.save(path)
    del image



root = tkinter.Tk()
app = Application(master=root)
app.mainloop()

if app.result() == "cancel":
    quit()

size = app.picture_size()

image_buf = numpy.array(PIL.Image.new("L", size, "black"))

export_fade_pattern1(image_buf, "fade_01.png")
export_fade_pattern2(image_buf, "fade_02.png")
export_fade_pattern3(image_buf, "fade_03.png")
export_fade_pattern4(image_buf, "fade_04.png")
export_fade_pattern5(image_buf, "fade_05.png")
export_fade_pattern6(image_buf, "fade_06.png")
export_fade_pattern7(image_buf, "fade_07.png")
export_fade_pattern8(image_buf, "fade_08.png")
export_fade_pattern9(image_buf, "fade_09.png")
export_fade_pattern10(image_buf, "fade_10.png")
export_fade_pattern11(image_buf, "fade_11.png")
export_fade_pattern12(image_buf, "fade_12.png")
export_fade_pattern13(image_buf, "fade_13.png")
export_fade_pattern14(image_buf, "fade_14.png")
export_fade_pattern15(image_buf, "fade_15.png")
export_fade_pattern16(image_buf, "fade_16.png")
export_fade_pattern17(image_buf, "fade_17.png")
export_fade_pattern18(image_buf, "fade_18.png")



del image_buf



