import os
import numpy, json
from PIL import Image
from scipy import misc
from scipy import ndimage
from skimage import measure

dimx = 2048
dimy = 2048
dimz = 3701
input_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/BrainMask/RAW.raw"


fp = open(input_data_path, 'rb')
fp_out = open("./RAW_erode_150.raw", 'wb')
for z in range(0, dimz):
	mImageRaw = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	mImage = Image.fromarray(mImageRaw)
	
	mImage = ndimage.grey_erosion(mImage, size=(150,150))
	# mImage = Image.fromarray(mImage)

	# mImage.save("./test2.png")

	fp_out.write(mImage.tostring());





