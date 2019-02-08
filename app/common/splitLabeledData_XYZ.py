import os
import numpy
from PIL import Image




x = 2475
y = 2151
z = 3703

# fp_front_path = "../../Data/XY/"
# for i in range(0, z):
# 	data = numpy.fromstring(fp.read(4*x*y), dtype=numpy.float32).reshape(y,x)
# 	mImage = Image.fromarray(data)
# 	filename = fp_front_path + '{0:04}'.format(i) + ".tif"
# 	mImage.save(filename)
# 	#print data.shape		
# 	print i

# fp_front_path = "../../Data/ZX/"



# #print data

# for iy in range(0, y):
# 	fp = open("../../Data/160804_240nmpxS1_labeled.raw", "rb")
# 	image_str = ""
# 	for iz in range(0, z):
# 		fp.seek(x*(iy)*4, 1)
# 		image_str += fp.read(4*x)
# 		#line_data = numpy.fromstring(fp.read(4*x), dtype=numpy.float32)
# 		fp.seek(x*(y-iy-1)*4, 1)
		
		
	
# 	data=numpy.fromstring(image_str, dtype=numpy.float32).reshape(z,x)
# 	data = numpy.rot90(data)
# 	mImage = Image.fromarray(data)
# 	filename = fp_front_path + '{0:04}'.format(iy) + ".tif"
# 	mImage.save(filename)
# 	print iy	
	
	



fp_front_path = "../../Data/ZY/"



#print data

for ix in range(0, x):
	fp = open("../../Data/160804_240nmpxS1_labeled.raw", "rb")
	image_str = ""
	for iz in range(0, z):
		for iy in range(0, y):
			fp.seek(ix*4, 1)
			image_str += fp.read(4)
			fp.seek((x-ix-1)*4, 1)
		
	data=numpy.fromstring(image_str, dtype=numpy.float32).reshape(z,y)
	data = numpy.rot90(data)
	mImage = Image.fromarray(data)
	filename = fp_front_path + '{0:04}'.format(iy) + ".tif"
	mImage.save(filename)
	print ix	
	
	

