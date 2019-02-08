import os, sys
import numpy, json
from scipy import misc
import base64
from PIL import Image
from io import StringIO
import io

import time
from skimage import measure

import pymysql


from util import *
	

DATA_PATH = "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/"


PATH_ROOT = "/home/SharedHDD_2/VisualAnalytics_ZB/"
# PATH_LabeledVolume = "/home/SharedHDD_2/VisualAnalytics_ZB/LabeledVolume/"
# PATH_SaveFile = "/home/SharedHDD_2/VisualAnalytics_ZB/SaveFile/"



# SUBREGION_PATH = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/"
EM_IMAGE_X = 2048
EM_IMAGE_Y = 2048
EM_IMAGE_Z = 3701

TOP_DIM_Z = 409

def makeCropBox(x, y, w, h, origW, origH):
	left = x-w
	top = y-h
	right = x+h
	bottom = y+h

	if(left < 0):
		AdjValue = (-1) * left
		left += AdjValue
		right += AdjValue
	if(right > origW):
		AdjValue = right - origW
		left -= AdjValue
		right -= AdjValue
	if(top < 0):
		AdjValue = (-1) * top
		top += AdjValue
		bottom += AdjValue
	if(bottom > origH):
		AdjValue = bottom - origH
		top -= AdjValue
		bottom -= AdjValue

	return left, top, right, bottom

def readEMImage(viewObjArr):
	imgArr = []
	for viewObj in viewObjArr:

		level = viewObj['level']
		x = viewObj['indexX']
		y = viewObj['indexY']
		z = viewObj['indexZ']

		path = DATA_PATH + 'EMVolume_XY/level'+ str(level) + '/' + str(x) + '_' + str(y) + '_' + str(z) + '.jpg';
		pic = Image.open(path)

		buffer = io.StringIO()
		pic.save(buffer, format="jpeg")
		imgArr.append(base64.b64encode(buffer.getvalue()))

	# print (len(imgArr))

	return imgArr

def readTopEMImage():
	dataset = []
	for i in range(0,TOP_DIM_Z):
		path = PATH_ROOT+"TopView/EM_1200nm(409_409_740)/" + str(i).zfill(3) + ".jpg"
		# print path
		pic = Image.open(path)
		buffer = io.StringIO()
		pic.save(buffer, format="jpeg")
		imgData = base64.b64encode(buffer.getvalue())
		dataset.append(imgData)

	return dataset

def readTopCellLabelsArr(aIndex, aConnection):
	# dataset = []
	# filelist = getDirList(PATH_ROOT+"TopView/Subregion_1200nm/VIS2017/", "")
	# filelist.sort();
	# for i in range(0,TOP_DIM_Z):
	# 	try:
	# 		path = filelist[aIndex] + "/" + str(i) + ".json";
	# 		dataset.append(readJSON(path))
	# 	except:
	# 		dataset.append("empty")

	# return dataset

	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT FLOOR(vx_subregion/5), FLOOR(vy_subregion/5), FLOOR(vz_subregion/5) FROM VisualAnalytics.subregion_data WHERE id_subregion="+str(aIndex)+" and (vx_subregion%5)=0 and (vy_subregion%5)=0 and (vz_subregion%5)=0;"
	# print (sql, (aIndex))
	cursor.execute(sql)
	aConnection.commit()
	rows = cursor.fetchall()
	print (rows)
	cursor.close()
	# for row in rows:
	# 	index = 0
	# 	for d in data:
	# 		if d['label'] == row['status_subregion']:
	# 			break
	# 		index+=1
	# 	if len(data) == index:
	# 		points = []
	# 		points.append((row['vx_subregion'], row['vy_subregion']))
	# 		item = {
	# 			'points' : points,
	# 			'label' : row['status_subregion']
	# 		}
	# 		data.append(item)	
	# 	else:
	# 		data[index]['points'].append((row['vx_subregion'], row['vy_subregion']))

	
	# print ("connection close")
	return json.dumps(rows)

	
def readLabeledData(aIndex):	
	path = PATH_ROOT + 'LabeledVolume/JSON/' + str(aIndex) + '.json';
	return readJSON(path);
	
def readSubregionData(aIndex, aSubRegionIdx, aConnection):	
	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT DISTINCT * FROM subregion_data WHERE vz_subregion = %s and id_subregion = %s;"
	cursor.execute(sql, (aIndex, aSubRegionIdx))
	aConnection.commit()
	rows = cursor.fetchall()
	print (rows)
	if len(rows) == 0:
		return "empty"

	# for row in rows:
	# 	index = 0
	# 	for d in data:
	# 		if d['label'] == row['status_subregion']:
	# 			break
	# 		index+=1
	# 	if len(data) == index:
	# 		points = []
	# 		points.append((row['vx_subregion'], row['vy_subregion']))
	# 		item = {
	# 			'points' : points,
	# 			'label' : row['status_subregion']
	# 		}
	# 		data.append(item)	
	# 	else:
	# 		data[index]['points'].append((row['vx_subregion'], row['vy_subregion']))

	
	# print ("subregion return" + str(len(data)));

	else:
		return json.dumps(rows)

def getSubregionSelection(aSubRegionIdx, aConnection):
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT included_id_cell FROM subregion_selection WHERE id_subregion = %s;"
	cursor.execute(sql, (aSubRegionIdx))
	aConnection.commit()
	rows = cursor.fetchall()

	if len(rows) == 0:
		return "empty"

	else:
		return json.dumps(rows)

	# filelist = getDirList(PATH_ROOT+"Subregions/Cropped(2048x2048)/VIS2017/", "")
	# filelist.sort()
	# path = filelist[aSubRegionIdx] + "/Report.txt";
	# try:
	# 	return readIntegerArray(path);
	# except:
	# 	return "empty"
		

def readFeature(aObj, aConnection):
	name = aObj['name']
	name = name.lower() + "_cell"



	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT "+ name + " FROM VisualAnalytics.cell_master WHERE group_id_cell=1"
	cursor.execute(sql)
	aConnection.commit()
	rows = cursor.fetchall()
	cursor.close()
	# print()

	# path = PATH_ROOT + 'MorphologicalFeature/' + name + '.json'

	return rows;

def getCellLabelsSize(aConnection):
	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT MAX(id_cell) FROM VisualAnalytics.cell_master WHERE group_id_cell=1"
	cursor.execute(sql)
	aConnection.commit()
	rows = cursor.fetchall()
	cursor.close()
	# print()

	# path = PATH_ROOT + 'MorphologicalFeature/Volume.json'
	# json_text = readJSON(path)
	# data = json.loads(json_text)
	# return len(data)
	# print(rows[0]['MAX(id_cell)'])
	return rows[0]['MAX(id_cell)'];

def getCellLabelsInfoData(aConnection):
	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT id_cell, minZ_cell, maxZ_cell FROM VisualAnalytics.cell_master WHERE group_id_cell=1;"
	cursor.execute(sql)
	aConnection.commit()
	rows = cursor.fetchall()
	cursor.close()
	# for row in rows:
	# 	item = []
	# 	item.append(row['id_cell']);
	# 	item.append(row['minZ_cell']);
	# 	item.append(row['maxZ_cell']);
	# 	data.append(item)	
		
	# print ("connection close")
	return json.dumps(rows)

	# print()

	# path = PATH_ROOT + 'MorphologicalFeature/Volume.json'
	# json_text = readJSON(path)
	# data = json.loads(json_text)
	# return len(data)
	# return rows;


	# path = PATH_ROOT + 'LabeledVolume/countLabels.json'
	# return readJSON(path);

def getSubregionInfoData(aConnection):
	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT * FROM subregion_master;"
	cursor.execute(sql)
	aConnection.commit()
	rows = cursor.fetchall()
	cursor.close()
	# print (rows)

	for row in rows:
		item = {
				'maxZ': row['maxZ_subregion'],
				'minZ': row['minZ_subregion'],
				'Volume' : 10000,
				'Name' : row['name_subregion'],
				'Version' : row['version_subregion']
			}

		if row['version_subregion'] == 1:
			item['Name'] = "Old_" + item['Name']
		
		else:
			item['Name'] = "New_" + item['Name']
		

		data.append(item)	
		
	# print ("connection close")
	return json.dumps(data)


	# "maxZ": "2806", "Volume": 139758219, "minZ": "2145", "Name": "MesencephalonTecumNeuropil"
	# path = PATH_ROOT + "Subregions/Cropped(2048x2048)/VIS2017/SubregionInfo.json"
	# return readJSON(path);
	
def Save(aName, aData):
	path = PATH_ROOT + "SaveFile/" + aName + ".json"
	fp = open(path, "wb");	
	json.dump(aData, fp);

def getSaveList():
	path = PATH_ROOT + "SaveFile/"
	filelist = getDirList(path, ".json")
	mList = []
	for file in filelist:
		mList.append(file.split(path)[-1].split(".json")[0])
	return mList
	# return readJSON(path);
	
def getSaveFile(aName):
	path = PATH_ROOT + "SaveFile/" + aName + ".json"
	try:
		return readJSON(path);
	except:
		return "empty"





	
def readLabeledData_DB(aIndex, aConnection):	
	# conn = pymysql.connect(host='diamond.unist.ac.kr', user='jmmoon', password='132435a', db='VisualAnalytics', charset='utf8')
	# cursor = mysql.connect().cursor()
	
	# conn.commit()
    # rows = curs.fetchone()
    # print (rows)
 
	data = []
	cursor = aConnection.cursor()
	# Read a single record
	sql = "SELECT id_cell FROM cell_master WHERE group_id_cell=1 and maxZ_cell > %s and minZ_cell < %s;"
	cursor.execute(sql, (int(aIndex), int(aIndex)))
	aConnection.commit()
	rows = cursor.fetchall()
	cursor.close()
	# print (rows)
	# import time
	# t = time.time()

	# for row in rows:
	# 	index = 0
	# 	for d in data:
	# 		if d['label'] == row['id_cell'] and d['status'] == row['tag_cell']:
	# 			break
	# 		index+=1
	# 	if len(data) == index:
	# 		points = []
	# 		points.append((row['vx_cell'], row['vy_cell']))
	# 		item = {
	# 			'label': row['id_cell'],
	# 			'status' : row['tag_cell'],
	# 			'points' : points
	# 		}
	# 		data.append(item)	
	# 	else:
	# 		data[index]['points'].append((row['vx_cell'], row['vy_cell']))

	
	# print ("connection close")


	# t2 =time.time()
	# mt = t2 - t
	# print ("Data processing time {0}".format(mt))
	return json.dumps(rows)



