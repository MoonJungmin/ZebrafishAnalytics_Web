import os, math
import numpy, json
from PIL import Image
from scipy import misc
from skimage import measure

dimx = 2048
dimy = 2048
dimz = 3701


input_data_path = "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/LabeledVolume_XY/XY/"
output_data_path = "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/LabeledVolume_XY/JSON/"

for z in range(0, dimz):
	mImage = Image.open(input_data_path + str(z).zfill(4) + ".tif")

	contours = measure.find_contours(mImage, 1, fully_connected='high', positive_orientation='low')

	dataset = []
	pixels = mImage.load()
	for j in range(0, len(contours)):
		label = 0
		value = 0

		for h in range(0, len(contours[j])-1):
			p1 = contours[j][h]
			p2 = contours[j][h+1]
		
			vec1 = numpy.array([p2[0]-p1[0], p2[1]-p1[1], 0])
			vec2 = numpy.array([0,0,-1])
			vec3 = numpy.cross(vec1, vec2)
			
		

			p1 = numpy.array(p1)
			p1[0] = math.ceil(p1[0])
			p1[1] = math.ceil(p1[1])
			vec3[0] = math.ceil(vec3[0])
			vec3[1] = math.ceil(vec3[1])

			label =  pixels[p1[1]+vec3[1], p1[0]+vec3[1]];
			if(label > 0):
				break

		
		# try:
		# 	value[0] = pixels[p3[1]+3, p3[0]]
		# except:
		# 	pass

		# try:
		# 	value[1] = pixels[p3[1]+3, p3[0]-3]
		# except:
		# 	pass

		# try:
		# 	value[2] = pixels[p3[1], p3[0]-3]
		# except:
		# 	pass

		# try:
		# 	value[3] = pixels[p3[1]-3, p3[0]-3]
		# except:
		# 	pass

		# try:
		# 	value[4] = pixels[p3[1]-3, p3[0]]
		# except:
		# 	pass

		# try:
		# 	value[5] = pixels[p3[1]-3, p3[0]+3]
		# except:
		# 	pass

		# try:
		# 	value[6] = pixels[p3[1], p3[0]+3]
		# except:
		# 	pass

		# try:
		# 	value[7] = pixels[p3[1]+3, p3[0]+3]
		# except:
		# 	pass

		# for v in value:
		# 	if v > 0 :
		# 		label = v
		# 		break

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
			'label': label,
			'points' : points
		}
		
		if label != 0.0:
			dataset.append(data)


	filename = output_data_path + str(z) + ".json"
	fp = open(filename, "wb")
	fp.write(json.dumps(dataset))
	
	print "level1 : " + str(z)





# for i in range(0, dimz):
# 	image = Image.open(dataPath + str(i) + ".tif")
# 	contours = measure.find_contours(image, 1, fully_connected='high')
	
# 	dataset = []
# 	pixels = image.load()
# 	for j in range(0, len(contours)):
# 		label = 0
# 		value = [0,0,0,0,0,0,0,0]
# 		value[0] = pixels[contours[j][0][1]+2, contours[j][0][0]]
# 		value[1] = pixels[contours[j][0][1]+2, contours[j][0][0]-2]
# 		value[2] = pixels[contours[j][0][1], contours[j][0][0]-2]
# 		value[3] = pixels[contours[j][0][1]-2, contours[j][0][0]-2]
# 		value[4] = pixels[contours[j][0][1]-2, contours[j][0][0]]
# 		value[5] = pixels[contours[j][0][1]-2, contours[j][0][0]+2]
# 		value[6] = pixels[contours[j][0][1], contours[j][0][0]+2]
# 		value[7] = pixels[contours[j][0][1]+2, contours[j][0][0]+2]

# 		# print contours[j][0][0], contours[j][0][1]
# 		for v in value:
# 			if v > 0 :
# 				label = v
# 				break

# 		points = []
# 		for h in range(0, len(contours[j])):
# 			points.append((contours[j][h][1], contours[j][h][0]))

# 		data = {
# 			'label': label,
# 			'points' : points
# 		}		
# 		dataset.append(data)

# 	fp = open(dataPath + str(i) + ".json", "wb")
# 	fp.write(json.dumps(dataset))
# 	print i
