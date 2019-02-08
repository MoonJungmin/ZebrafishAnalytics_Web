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



DataPath = '../../Data/240nmpxS1_Morphology_Feature.bin'

conn = pymysql.connect(host='localhost', user='jmmoon', password='132435a', db='VisualAnalytics_Web', charset='utf8')
curs = conn.cursor()

dst_x = 2475
dst_y = 2151
dst_z = 3703

maxsize = len(filelist)

bar = progressbar.ProgressBar(maxval=maxsize, widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
fp = open(DataPath)
bar.start()
Feature = []
for index in range(0, 18):
    #print file.split('/')[-1].split('.')[0]
    datas = fp.read(4*179066)
    datas = [datas[i:i+4] for i in range(0, len(datas), 4)]

    feature = []
    for i in range(0, len(datas)):
        feature.append(struct.unpack('f', datas[i])[0])

    Feature.append(feature)


for index in range(0,len(Feature[0])):
    curs.execute("INSERT INTO `Feature`(`Label`, `Volume`, `SurfaceArea`, `Sphericity`, `EulerNumber`, `Elli.Center.X`, `Elli.Center.Y`, `Elli.Center.Z`, `Elli.R1`, `Elli.R2`, `Elli.R3`, `Elli.Azim`, `Elli.Elev`, `Elli.Roll`, `InscrBall.Center.X`, `InscrBall.Center.Y`, `InscrBall.Center.Z`, `InscrBall.Radius`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (str(Feature[0][index]), str(Feature[1][index]),str(Feature[2][index]),str(Feature[3][index]),str(Feature[4][index]),str(Feature[5][index]),str(Feature[6][index]),str(Feature[7][index]),str(Feature[8][index]),str(Feature[9][index]),str(Feature[10][index]),str(Feature[11][index]),str(Feature[12][index]),str(Feature[13][index]),str(Feature[14][index]),str(Feature[15][index]),str(Feature[16][index]),str(Feature[17][index])))
    conn.commit()
    bar.update(index)

    
bar.finish()
conn.close()
