import os
import numpy, json
from PIL import Image
from scipy import misc
from skimage import measure

dimx = 2048
dimy = 2048
dimz = 3701
input_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/"


# dimx = 811
# dimy = 464
# dimz = 404
# input_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/TopView_1200nm/"


filelist = []
def search(dirname):
	filenames = os.listdir(dirname)
	for filename in filenames:
		full_filename = os.path.join(dirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		filelist.append(full_filename)


search(input_data_path)

# print len(filelist)
# for i in range(0, len(filelist)):
filelist.sort()
for file in filelist:
	filename = file.split(input_data_path)[-1]
	if filename == "DiencephalonHabenulaRight":
		fp = open(file + "/RAW.raw", 'rb');
		for z in range(0, dimz):
			mImageRaw = numpy.fromstring(fp.read(dimx*dimy), dtype=numpy.uint8).reshape(dimy,dimx)
			mImage = Image.fromarray(mImageRaw)
			
			contours = measure.find_contours(mImage, 100, fully_connected='high')

			dataset = []
			pixels = mImage.load()
			for j in range(0, len(contours)):
				
				points = []
				prvx = 0
				prvy = 0
				for h in range(0, len(contours[j])-1):
					if prvx == int(round(contours[j][h][1])) and prvy == int(round(contours[j][h][0])):
						continue
					else:
						prvx = int(round(contours[j][h][1]))
						prvy = int(round(contours[j][h][0]))
						points.append((prvx, prvy))

				data = {
					'points' : points
				}		
				dataset.append(data)

			if(len(dataset) != 0):
				filename = file + "/" + str(z) + ".json"
				
				fp_out = open(filename, "wb")
				fp_out.write(json.dumps(dataset))
				
			print file.split(input_data_path)[-1] + " Progress : " + str(z)