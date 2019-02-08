import os
import numpy, json

Subregion_Data_Path = "/home/Pearl_Home/David/160515_SWiFT_60nmpx_singles/"


def search(aDirname, aType):
	filelist = []
	filenames = os.listdir(aDirname)
	for filename in filenames:
		full_filename = os.path.join(aDirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		if ext == aType: 
			filelist.append(full_filename)

	return filelist


filelist = search(Subregion_Data_Path, ".png")



filelist.sort()

fp_out = open("/home/ridwan/LUT.txt", "w")


index = 0;
prev_index = 0
jump_size = 0;
for file in filelist:
	# print file	
	
	if index == 0:
		em_index = int(file.split(Subregion_Data_Path)[-1].split(".png")[0])
		prev_index = em_index
		fp_out.write(str(em_index) + "\t" + str(index) + "\n")
		index+=1

	else:
		em_index = int(file.split(Subregion_Data_Path)[-1].split(".png")[0])
		if prev_index+1 != em_index:
			jump_size += 1
			print index
			dist = em_index - prev_index - 1
			index += dist
			prev_index = em_index

			fp_out.write(str(em_index) + "\t" + str(index) + "\n")
			index+=1
		else:
			prev_index = em_index
			fp_out.write(str(em_index) + "\t" + str(index) + "\n")
			index+=1


print jump_size