import os
import numpy, json

dimx = 2048
dimy = 2048
dimz = 3701

input_data_path = "/home/SharedHDD_2/VisualAnalytics_ZB/LabeledVolume/JSON/"
output_data_path = "/home/SharedHDD_2/VisualAnalytics_ZB/LabeledVolume/"

DATA_PATH = "/home/SharedHDD_2/VisualAnalytics_ZB/"

def readJSON(filename) :
	f = open(filename, 'r')
	js = json.loads(f.read())
	f.close()
	return js

def getLabelSize():
	path = DATA_PATH + 'MorphologicalFeature/Volume.json'
	f = open(path, 'r')
	json_text = ""
	while True:
		line = f.readline()
		if not line: break
		json_text += line
	f.close()
	data = json.loads(json_text)
	return len(data)


dataset = []

LabelSize = getLabelSize()
print (LabelSize)
	

for i in range(0, LabelSize+1):
	data = [dimz, 0]
	dataset.append(data)

for z in range(0, dimz):
	filename = input_data_path + str(z) + ".json"
	mJSON = readJSON(filename);

	labelArr = []
	for obj in mJSON:
		labelArr.append(int(obj['label']))
	labelArr = list(set(labelArr))

	for label in labelArr:
		if(dataset[int(label)][0] > z):
			dataset[int(label)][0] = z
		if(dataset[int(label)][1] < z):
			dataset[int(label)][1] = z

	print ("progress : " + str(z))

filename = output_data_path + "countLabels.json"
fp = open(filename, "wb")
fp.write(json.dumps(dataset).encode())