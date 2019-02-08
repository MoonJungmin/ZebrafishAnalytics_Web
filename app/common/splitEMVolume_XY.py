import os
import numpy
from PIL import Image
from scipy import misc

dimx = 2048
dimy = 2048
dimz = 16000/4

#print dimx, dimy, dimz

input_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_crop(2048x2048)_NEW.raw"
output_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_XY_New/level1/"

fp = open(input_data_path, "rb");
for z in range(0, dimz):
	data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	mImage = Image.fromarray(data)
	for x in range(0, (dimx)/256):
		for y in range(0, (dimy)/256):
			img = mImage.copy()

			cropImage = img.crop((x*256, y*256, x*256+256, y*256+256));

			filename = output_data_path + str(x) + "_" + str(y) + "_" + str(z) + ".jpg"

			cropImage.save(filename, format="jpeg")
	print "level1 : " + str(z)



input_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_crop(2048x2048)_NEW.raw"
output_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_XY_New/level2/"
h_dimx = dimx/2
h_dimy = dimy/2

fp = open(input_data_path, "rb");
for z in range(0, dimz):
	data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	small_data = misc.imresize(data, (h_dimy, h_dimx))
	mImage = Image.fromarray(small_data)
	#resizeImage = mImage.crop((-horizontal_padding, -vertical_padding, h_dimx+horizontal_padding, h_dimy+vertical_padding));
	for x in range(0, (h_dimx)/256):
		for y in range(0, (h_dimy)/256):
			img = mImage.copy()
			#print img.size
			cropImage = img.crop((x*256, y*256, x*256+256, y*256+256));
			#print img.size
			filename = output_data_path + str(x) + "_" + str(y) + "_" + str(z) + ".jpg"
			#print cropImage.size
			cropImage.save(filename, format="jpeg")
	print "level2 : " + str(z)
	#print data.shape		

input_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_crop(2048x2048)_NEW.raw"
output_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_XY_New/level3/"
h_dimx = dimx/4
h_dimy = dimy/4

print h_dimx, h_dimy
fp = open(input_data_path, "rb");
for z in range(0, dimz):
	data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	small_data = misc.imresize(data, (h_dimy, h_dimx))
	mImage = Image.fromarray(small_data)
	#resizeImage = mImage.crop((-horizontal_padding, -vertical_padding, h_dimx+horizontal_padding, h_dimy+vertical_padding));
	for x in range(0, int(round((h_dimx)/256 + 0.5))):
		for y in range(0, int(round((h_dimy)/256 + 0.5))):
			img = mImage.copy()
			#print img.size
			cropImage = img.crop((x*256, y*256, x*256+256, y*256+256));
			#print img.size
			filename = output_data_path + str(x) + "_" + str(y) + "_" + str(z) + ".jpg"
			#print cropImage.size
			cropImage.save(filename, format="jpeg")
	print "level3 : " + str(z)
	#print data.shape		

input_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_crop(2048x2048)_NEW.raw"
output_data_path = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/EMVolume_XY_New/level4/"
h_dimx = dimx/8
h_dimy = dimy/8

fp = open(input_data_path, "rb");
for z in range(0, dimz):
	data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	small_data = misc.imresize(data, (h_dimy, h_dimx))
	mImage = Image.fromarray(small_data)
	#resizeImage = mImage.crop((-horizontal_padding, -vertical_padding, h_dimx+horizontal_padding, h_dimy+vertical_padding));
	for x in range(0, (h_dimx)/256):
		for y in range(0, (h_dimy)/256):
			img = mImage.copy()
			#print img.size
			cropImage = img.crop((x*256, y*256, x*256+256, y*256+256));
			#print img.size
			filename = output_data_path + str(x) + "_" + str(y) + "_" + str(z) + ".jpg"
			#print cropImage.size
			cropImage.save(filename, format="jpeg")
	print "level4 : " + str(z)
	#print data.shape		

