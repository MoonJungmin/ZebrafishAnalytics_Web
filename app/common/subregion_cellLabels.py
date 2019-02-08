import os
import numpy, json
import time
from PIL import Image
from scipy import misc
from skimage import measure

dimx = 2048
dimy = 2048
dimz = 3703
subregionsPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/"
labeledPath = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/LabeledVolume_XY/XY"

DATA_PATH = "/home/Pearl_Home/ridwan/Data/160515_SWiFT_60nmpx_downsample/"


filelist = []



def search(dirname):
	filenames = os.listdir(dirname)
	for filename in filenames:
		full_filename = os.path.join(dirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		filelist.append(full_filename)

def readJSON(aPath):
	f = open(aPath, 'r')
	json_text = ""
	while True:
		line = f.readline()
		if not line: break
		json_text += line
	f.close()
	return json_text

def getCellLabelsSize():
	path = DATA_PATH + 'Morphological_Feature/Volume.json'
	json_text = readJSON(path)
	data = json.loads(json_text)
	return len(data)

def process(Labeled_Image, Mask_Image):
	for i in range(0, dimx*dimy):
		# if Mask_Image[i] > 0:
		# 	print Mask_Image[i]	
		# if Labeled_Image[i] > 0:
		# 	print Labeled_Image[i]	
		if Mask_Image[i] > 100 and Labeled_Image[i] > 0:
			LabelStorage[int(Labeled_Image[i])] = 1;

	
LabelsSize = getCellLabelsSize();
print LabelsSize
# search(subregionsPath)
# LabelStorage = [0 for _ in range(LabelsSize+1)]



# for i in range(0, len(filelist)):
# 	start_time = time.time()
# 	for z in range(0, dimz):
# 		if os.path.exists(filelist[i] + "/" + str(0) + "_" + str(0) + "_" + str(z) + ".json") == True:
# 			Mask_Image = Image.open(filelist[i] + "/"+ str(z) + ".tif")
# 			Labeled_Image = Image.open(labeledPath + "/" + str(z) + ".tif")
			
# 			Mask_Numpy = numpy.asarray(Mask_Image, dtype=numpy.uint8).ravel()
# 			Labeled_Numpy = numpy.asarray(Labeled_Image, dtype=numpy.float).ravel()

# 			process(Labeled_Numpy, Mask_Numpy)
# 			print filelist[i].split(subregionsPath)[-1] + " Progress : " + str(z)
	
# 	end_time = time.time()
# 	print filelist[i].split(subregionsPath)[-1] + ":" + str(end_time - start_time)
# 	fp = open(filelist[i] + "/CellLabels.json", "w")
# 	for index in range(0,LabelsSize+1):
# 		if LabelStorage[index] == 1:
# 			fp.write("%d " % index)
