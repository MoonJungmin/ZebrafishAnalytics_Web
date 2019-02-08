import os
import numpy, json
from PIL import Image
from scipy import misc
from skimage import measure

dimx = 2048
dimy = 2048
dimz = 3703
# input_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/"
input_data_path = "/home/Pearl_Home/quantm/ZebrafishConnectomeProjectSegmentation/160720_160515SWiFT_60nmpx_BrainMasks_result_warp_downsample"
output_data_path = "/home/Pearl_Home/ridwan/Data/"

filelist = []
def search(dirname):
	filenames = os.listdir(dirname)
	for filename in filenames:
		full_filename = os.path.join(dirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		filelist.append(full_filename)



search(input_data_path);

fp = open(output_data_path + "/BrainMask.raw", "wb");
filelist.sort();
index = 0;
while index < 16000:
	# print file.split(input_data_path)[-1]
	mImage = Image.open(filelist[index]);
	mImageNP = numpy.asarray(mImage, dtype=numpy.uint8)
	fp.write(mImageNP.tostring());

	print " Progress : " + str(index)
	index += 4


