import os
import numpy
from PIL import Image
from scipy import misc

dimx = 10240/4
dimy = 9216/4
dimz = 16000/4

#print dimx, dimy, dimz

input_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/LabeledVolume.raw"
output_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/LabeledVolume_XY"

fp = open(input_data_path, "rb");
fp_out = open(output_data_path + "/RAW.raw", "wb")

for z in range(0, dimz):
	data = numpy.fromstring(fp.read(4*dimx*dimy), dtype='>f4').reshape(dimy,dimx)
	mImage = Image.fromarray(data)
	cropImage = mImage.crop((200, 0, 2248, 2048));
	cropImageNP = numpy.asarray(cropImage, dtype=numpy.float32)
	fp_out.write(cropImageNP.tostring());	
	print "Progress : " + str(z)

