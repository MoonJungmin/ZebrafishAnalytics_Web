import csv
import numpy, json

PATH = "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/"
OUTPUT = "Morphological_Feature/"
INPUT = "170331_morpho.csv" 
matrix = []
namespace = []


f = open(PATH+INPUT, 'r')
csvReader = csv.reader(f)


index = 0
for row in csvReader:
	del row[0]
	if index == 0:
		namespace.append(row)
	else:
		matrix.append(row)
	index += 1
	

np_matrix = numpy.array(matrix, dtype=numpy.float32)

print namespace

for i in range(1, len(namespace[0])):
	filename = PATH + OUTPUT + namespace[0][i] + ".json"
	fp = open(filename, "wb")
	fp.write(json.dumps(np_matrix[:,i].tolist()))


filename = PATH + OUTPUT + "Namespace.json"
fp = open(filename, "wb")
fp.write(json.dumps(namespace[0]))



f.close()


