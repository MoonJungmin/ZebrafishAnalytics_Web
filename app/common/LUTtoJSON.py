import json, os, sys

target_path = sys.argv[1]

f = open(target_path, 'r')
lines = f.readlines()
# print lines
f.close()
arr = []
for line in lines:
	arr.append(line.split('\t')[0])


jsonString = json.dumps(arr)

print jsonString

f = open(target_path.split('LUT')[0]+"60nmpx_slice_table.json", "w")
f.write(jsonString);

