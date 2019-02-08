import struct, os
import numpy, json
from PIL import Image
# from scipy import misc

# path = "/home/Pearl_Home/ridwan/Data/Subregions/Subregion_240nm"
# outPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/"
# filelist = []
# def search(dirname):
# 	filenames = os.listdir(dirname)
# 	for filename in filenames:
# 		full_filename = os.path.join(dirname, filename)
# 		ext = os.path.splitext(full_filename)[-1]

# 		filelist.append(full_filename)


# search(path)
# # print (filelist.split(path))



# dimx = 2475
# dimy = 2151
# dimz = 3703

# for file in filelist:
# 	fp = open(file + "/RAW.raw", "rb");
# 	subregionPath = file.split(path + "/")[-1]
# 	fp_out = open(outPath+subregionPath+"/RAW.raw", "wb")
# 	print subregionPath
# 	for z in range(0, dimz):
# 		data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
# 		mImage = Image.fromarray(data)
# 		cropImage = mImage.crop((250, 0, 2298, 2048));
# 		cropImageNP = numpy.asarray(cropImage, dtype=numpy.uint8).ravel()

# 		fp_out.write(cropImageNP.tostring());
		


path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/BrainMask/"
dimx = 2560
dimy = 2304
dimz = 4000

fp = open(path + "RAW.raw", "rb");
fp_out = open(path+"RAW_crop.raw", "wb")
for z in range(0, dimz):
	data = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
	mImage = Image.fromarray(data)
	cropImage = mImage.crop((200, 0, 2248, 2048));
	cropImageNP = numpy.asarray(cropImage, dtype=numpy.uint8).ravel()

	fp_out.write(cropImageNP.tostring());