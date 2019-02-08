#!/usr/bin/env python
from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
from model import *
import pymysql
import json

# from gevent import monkey
# monkey.patch_all()

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the applicationlication to choose
# the best option based on installed packages.
# import eventlet
# eventlet.monkey_patch()
# from gevent import monkey
# monkey.patch_all()

# async_mode = "gevent"
async_mode = None

application = Flask(__name__)
application.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(application, async_mode=async_mode)
# socketio = SocketIO(application)


@application.route('/')
def index():
	return render_template('index.html')

@socketio.on('connect', namespace='/index')
def connect():
	print ("connected.")

@socketio.on('disconnect', namespace='/index')
def disconnect():
	print('Client disconnected', request.sid)

@socketio.on('req_Savelist', namespace='/index')
def req_Savelist():
	# print "req_Savelist"
	mlist = getSaveList()
	emit('res_Savelist', {'data': mlist});


@application.route('/SubregionViewer/<aName>')
def subregionViewer(aName):
	size = getCellLabelsSize(connection)

	return render_template('subregionViewer.html', async_mode=socketio.async_mode, size=size, name=aName)
	# return render_template('subregionViewer.html')


@application.route('/VisualAnalytics/<aName>')
def visualAnalytics(aName):

	connection = pymysql.connect(host='10.20.13.66',
								user='jmmoon',
								password='132435a@',
								db='VisualAnalytics',
								charset='utf8',
								cursorclass=pymysql.cursors.DictCursor,
								port=17771)


	size = getCellLabelsSize(connection)
	# print(size)
	connection.close()
	return render_template('visualAnalytics.html', async_mode=socketio.async_mode, size=size, name=aName)

@application.route('/SubregionGenerator/<aName>')
def SubregionGenerator(aName):
	return render_template('SubregionGenerator.html', async_mode=socketio.async_mode, name=aName)


@socketio.on('req_BackgroundEMImage', namespace='/visualanlaytics')
def req_BackgroundEMImage(tileObj):
	print ("req_BackgroundEMImage")
	pyTileObj = json.loads(tileObj)
	img = readEMImage(pyTileObj)
	# print img

	emit('res_BackgroundEMImage', {'data': img, 'tileObj': tileObj});


@socketio.on('req_CellLabelsContour', namespace='/visualanlaytics')
def req_CellLabelsContour(aGId, aZIdx, aLv):
	print ("req_CellLabelsContour_DB")
	connection = pymysql.connect(host='10.20.13.66',
							user='jmmoon',
							password='132435a@',
							db='VisualAnalytics',
							charset='utf8',
							cursorclass=pymysql.cursors.DictCursor,
							port=17771)
	
	cursor = connection.cursor()
	# Read a single record
	sql = "SELECT json_cell FROM VisualAnalytics.cell_contourXY WHERE vz_cell = %s and level_cell = %s and group_id_cell = %s;"
	cursor.execute(sql, (int(aZIdx), int(aLv), int(aGId)))
	connection.commit()

	data = cursor.fetchall()
	cursor.close()

	# ZIndex = aIndex

	# start_time = time.time() 
	# print (data)
	rtdata = data[0]['json_cell'];
	connection.close();
	emit('res_CellLabelsContour', {'data': rtdata, 'index': aZIdx , 'level': aLv});

@socketio.on('req_SubregionContour', namespace='/visualanlaytics')
def req_SubregionContour(aSubregionId, aZIdx, aLv):
	print ("req_SubregionContour")
	connection = pymysql.connect(host='10.20.13.66',
								user='jmmoon',
								password='132435a@',
								db='VisualAnalytics',
								charset='utf8',
								cursorclass=pymysql.cursors.DictCursor,
								port=17771)
	
	cursor = connection.cursor()
	# Read a single record
	print(aSubregionId)
	sql = "SELECT json_subregion FROM VisualAnalytics.subregion_contourXY WHERE vz_subregion = %s and level_subregion = %s and id_subregion = %s;"
	cursor.execute(sql, (int(aZIdx), int(aLv), int(aSubregionId+1)))
	connection.commit()

	data = cursor.fetchall()
	cursor.close()

	arrlength = len(data);
	
	subregion = []

	if arrlength > 0:
		subregion = data[0]['json_subregion'];
	# print (subregion)
	connection.close();

	emit('res_SubregionContour', {'index': aZIdx, 'subregion': subregion, 'subregionIndex':aSubregionId, 'arraylength': arrlength, 'level':aLv});

@socketio.on('req_CellLabelsInfo', namespace='/visualanlaytics')
def req_CellLabelsInfo():
	print ("req_CellLabelsInfo")
	connection = pymysql.connect(host='10.20.13.66',
							user='jmmoon',
							password='132435a@',
							db='VisualAnalytics',
							charset='utf8',
							cursorclass=pymysql.cursors.DictCursor,
							port=17771)
	data = getCellLabelsInfoData(connection)
	# print(data);
	connection.close()
	emit('res_CellLabelsInfo', {'data': data});
	print ("res_CellLabelsInfo Done")

@socketio.on('req_SubregionInfo', namespace='/visualanlaytics')
def req_SubregionInfo():

	print ("req_Subregion info")
	connection = pymysql.connect(host='10.20.13.66',
								user='jmmoon',
								password='132435a@',
								db='VisualAnalytics',
								charset='utf8',
								cursorclass=pymysql.cursors.DictCursor,
								port=17771)
	data = getSubregionInfoData(connection)
	connection.close();
	emit('res_SubregionInfo', {'data': data});



@socketio.on('req_SubregionSelection', namespace='/visualanlaytics')
def req_SubregionSelection(aSubRegionIdx, aArrIndex):
	# data = getSubregionSelection(aSubRegionIdx, connection)
	data = []
	emit('res_SubregionSelection', {'data': data, 'index':aArrIndex});

@socketio.on('req_FeatureData', namespace='/visualanlaytics')
def req_FeatureData(aObj):
	pyObj = json.loads(aObj);
	connection = pymysql.connect(host='10.20.13.66',
								user='jmmoon',
								password='132435a@',
								db='VisualAnalytics',
								charset='utf8',
								cursorclass=pymysql.cursors.DictCursor,
								port=17771)


	data = readFeature(pyObj, connection);
	emit('res_FeatureData', {'data': data, 'object': aObj});


@socketio.on('req_TopviewWidget', namespace='/visualanlaytics')
def req_TopviewWidget_EM():
	emdata = readTopEMImage()
	emit('res_TopviewWidget', {'image': emdata});


@socketio.on('req_TopviewWidget_subregion', namespace='/visualanlaytics')
def req_TopviewWidget_subregion(aIndex):
	subregion = readTopCellLabelsArr(aIndex, connection)
	emit('res_TopviewWidget_subregion', {'subregion': subregion});

@socketio.on('req_Save', namespace='/visualanlaytics')
def req_Save(aName, aData):
	Save(aName, aData);

@socketio.on('req_Load', namespace='/visualanlaytics')
def req_Load(aName):
	Data = getSaveFile(aName);
	# print Data
	emit('res_Load', {'data': Data});	


@socketio.on('connect', namespace='/visualanlaytics')
def connect():
	print ("connected.")

@socketio.on('disconnect', namespace='/visualanlaytics')
def disconnect():
	print('Client disconnected', request.sid)

@socketio.on('disconnect_request', namespace='/test')
def disconnect_request():
	session['receive_count'] = session.get('receive_count', 0) + 1
	emit('my_response',{'data': 'Disconnected!', 'count': session['receive_count']})
	disconnect()

if __name__ == '__main__':
	socketio.run(application, debug=True, host='0.0.0.0', port=8000);
	# socketio.run(application, debug=False, host='0.0.0.0', port=17772);
