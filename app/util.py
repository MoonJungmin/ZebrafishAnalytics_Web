import os
import numpy, json


def getDirList(aDirname, aType):
	filelist = []
	filenames = os.listdir(aDirname)
	for filename in filenames:
		full_filename = os.path.join(aDirname, filename)
		ext = os.path.splitext(full_filename)[-1]
		if ext == aType: 
			filelist.append(full_filename)

	return filelist

def readJSON(aPath):
	f = open(aPath, 'r')
	json_text = ""
	while True:
		line = f.readline()
		if not line: break
		json_text += line
	f.close()
	return json_text

def readIntegerArray(aPath):
	f = open(aPath, 'r')
	Arr = f.readline().split(" ")
	return Arr
