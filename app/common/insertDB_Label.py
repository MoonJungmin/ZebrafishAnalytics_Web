import pymysql, struct, progressbar, os
import numpy, json

filelist = []
def search(dirname):
    filenames = os.listdir(dirname)
    for filename in filenames:
        full_filename = os.path.join(dirname, filename)
        ext = os.path.splitext(full_filename)[-1]
        if ext == '.txt': 
            filelist.append(full_filename)


search('../../Data/LabeledData/')

conn = pymysql.connect(host='localhost', user='jmmoon', password='132435a', db='VisualAnalytics_Web', charset='utf8')
curs = conn.cursor()

dst_x = 2475
dst_y = 2151
dst_z = 3703

maxsize = len(filelist)
bar = progressbar.ProgressBar(maxval=maxsize, widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
index = 0
bar.start()
for file in filelist:
    #print file.split('/')[-1].split('.')[0]
    value = file.split('/')[-1].split('.')[0]
    raw = open(file).readlines()
    Points = []
    for elem in raw:
        vals = [int(val) for val in elem.split(' ')]
        Points.append(vals)

    data = numpy.array(Points, dtype=numpy.int32)
    json_data = json.dumps(data.tolist())
    #print ("INSERT INTO `Labeled`(`Label`, `PositionData`) VALUES (%s,%s)", (str(int(value)), json_data))
    curs.execute("INSERT INTO `Labeled`(`Label`, `PositionData`) VALUES (%s,%s)", (str(int(value)), json_data))
    conn.commit()
    index += 1
    bar.update(index)
    
bar.finish()
conn.close()
