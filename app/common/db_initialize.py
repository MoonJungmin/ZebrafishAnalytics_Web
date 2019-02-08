import pymysql, struct, progressbar


conn = pymysql.connect(host='localhost', user='jmmoon', password='132435a', db='VisualAnalytics_Web', charset='utf8')
 
curs = conn.cursor()
#160804_240nmpxS1_labeled.raw  160804_240nmpxS1_median.raw  240nmpxS1_Morphology_Feature.bin  Data.tar.gz

fp = open("../../Data/160804_240nmpxS1_labeled.raw", 'rb')
maxsize = 78855014704/4;
dst_x = 2475
dst_y = 2151
dst_z = 3703
bar = progressbar.ProgressBar(maxval=maxsize, widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
bar.start()
value = fp.read(4)
index = 0
while value != "":
    value = struct.unpack('f', value)[0]
    if value > 0:
    	z = index/(dst_x*dst_y)
    	y = (index%(dst_x*dst_y))/dst_x
    	x = (index%(dst_x*dst_y))%dst_x
    	#print str(value) + " " + str(x) + " " + str(y) + " " + str(z)

    	# + (str(int(value)), str(x), str(y), str(z)
    	curs.execute("INSERT INTO `Labeled`(`Label`, `Position.X`, `Position.Y`, `Position.Z`) VALUES (%s,%s,%s,%s)", (str(int(value)), str(x), str(y), str(z)))
    	conn.commit()

    value = fp.read(4)
    index += 1
    bar.update(index)

bar.finish()



# sql = "select * from Feature"
# curs.execute(sql)
 
# rows = curs.fetchall()
# print(rows)

conn.close()
