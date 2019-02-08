import os
import numpy, json

Subregion_Data_Path = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/"


def search(aDirname, aType):
	filelist = []
	filenames = os.listdir(aDirname)
	for filename in filenames:
		full_filename = os.path.join(aDirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		if ext == aType: 
			filelist.append(full_filename)

	return filelist


filelist = search(Subregion_Data_Path, "")

# print filelist
SubregionList = []
filelist.sort();
for file in filelist:
	fname = file.split("Cropped(2048x2048)/VIS2017/")[-1]
	if fname != "SubregionInfo.json":
		Obj = {
			'Name': "",
			'minZ': 4000,
			'maxZ': 0,
			'Volume': 0
		}
		
		Obj['Name'] = file.split("Cropped(2048x2048)/VIS2017/")[-1]
		Obj['Volume'] = int(open(file + "/Volume.txt", "r").readline())

		JSONList = search(file, ".json")
		# JSONList.sort()
		if len(JSONList) == 0:
			break

		Obj['minZ'] = JSONList[0].split(file)[-1].split(".json")[0].split("/")[-1]
		Obj['maxZ'] = JSONList[-1].split(file)[-1].split(".json")[0].split("/")[-1]
		
		print Obj

		SubregionList.append(Obj);


filename = Subregion_Data_Path + "SubregionInfo.json"
fp = open(filename, "wb")
fp.write(json.dumps(SubregionList))
