import os                                                                                                                                                                                                           
import numpy
from PIL import Image

PATH = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/1200nm_464_404_811/"

def search(aDirname, aType):
    filelist = []
    filenames = os.listdir(aDirname)
    for filename in filenames:
        full_filename = os.path.join(aDirname, filename)
        ext = os.path.splitext(full_filename)[-1]
        if ext == aType:
            filelist.append(full_filename)

    return filelist

# filelist = search(PATH, "")
# print filelist


imagelist = search(PATH, ".tif")
for image in imagelist:
    mImage = Image.open(image)
    filename = image.split(".tif")[0]
    mImage.save(filename+".jpg", 'JPEG', quality=90)

    print image.split("1200nm_464_404_811/")[-1].split(".tif")[0]
