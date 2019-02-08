import os
import numpy, json
from PIL import Image


dimx = 2048
dimy = 2048
dimz = 3703


input_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/"
output_data_path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/"


filelist = []
def search(dirname):
	filenames = os.listdir(dirname)
	for filename in filenames:
		full_filename = os.path.join(dirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		filelist.append(full_filename)


search(input_data_path)

print len(filelist)

for i in range(0, len(filelist)):
	for z in range(0, dimz):
		if os.path.exists(filelist[i] + "/" + str(0) + "_" + str(0) + "_" + str(z) + ".json") == True:		
			mImage = Image.open(filelist[i] + "/"+ str(z) + ".tif")
			width, height = mImage.size;
			pixel = mImage.load()
			positions = []
			for w in range(0, width):
				for h in range(0, height):
					if pixel[w, h] > 100:
						positions.append([w, h]);
			


			# if(len(dataset) != 0):
			filename = filelist[i] + "/" + str(z) + ".txt"
			fp = open(filename, "w")
			for item in positions:
				fp.write("%d %d\n"%(item[0], item[1]))
				
		print filelist[i].split("Cropped(2048x2048)/")[-1] + " Progress : " + str(z)
