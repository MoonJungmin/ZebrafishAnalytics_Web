import pymysql
import time
import random





connection = pymysql.connect(host='10.20.13.66',
							user='jmmoon',
							password='132435a@',
							db='VisualAnalytics',
							charset='utf8',
							cursorclass=pymysql.cursors.DictCursor,
							port=3306)




aIndex = random.randrange(0, 1000)
print("Z Index : " + str(aIndex));
data = []
cursor = connection.cursor()
# Read a single record
sql = "SELECT id_cell, minX_cell, maxX_cell, minY_cell, maxY_cell, minZ_cell, maxZ_cell FROM cell_master WHERE group_id_cell=1 and maxZ_cell > %s and minZ_cell < %s;"
cursor.execute(sql, (int(aIndex), int(aIndex)))
connection.commit()

#rows = cursor.fetchall()
cursor.close()

ZIndex = aIndex

start_time = time.time() 

for row in cursor.fetchall():
	# data.append(id_cell['id_cell'])
	path = "/home/SharedHDD/Cell/Cell_1/"+ str(row['id_cell']) +"/bit_volume.raw"
	f = open(path, 'rb')
	sliceSize = (row['maxX_cell'] - row['minX_cell'] + 1) * (row['maxY_cell'] - row['minY_cell'] + 1)
 

	# print(sliceSize)
	# break
	f.seek(sliceSize * (ZIndex-row['minZ_cell']))

	mSlice = f.read(sliceSize)

	data.append(mSlice)

#    print(id_cell['id_cell'])


	# for m in mdata:
	# 	# print(m['id_cell'])


	# 	path = "/home/SharedHDD/Cell/Cell_1/"+ str(m['id_cell']) +".dat"
	# 	f = open(path, 'r')
	# 	while True:
	# 		line = f.readline()
	# 		if not line: break
			
	# 		line_split = line.split(" ")
	# 		# print(line_split[4])
	# 		if line_split[4] == aIndex and line_split[1] == '1':
	# 			# print (([m['id_cell'], line_split[2], line_split[3], line_split[4], 0, 0]))
	# 			vdata.append([m['id_cell'], line_split[2], line_split[3], line_split[4], 0, 0])

	# 		# json_text += line
	
	# 	f.close()

# print((data))
print("--- %s seconds ---" %(time.time() - start_time))
