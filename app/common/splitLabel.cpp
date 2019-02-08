#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <sstream>
#include <assert.h>
#include <math.h>
#include <unistd.h>
#include <dirent.h>

#define SWAP32(l) \
    ( ((((l) & 0xff000000) >> 24) | \  
     (((l) & 0x00ff0000) >> 8)  | \  
  (((l) & 0x0000ff00) << 8)  | \  
  (((l) & 0x000000ff) << 24)))  

using namespace std;

#define LABELED_PATH "../../Data/160804_240nmpxS1_labeled_int.raw"

int dst_x = 2475;
int dst_y = 2151;
int dst_z = 3703;

int main(int argc, char **argv)
{

	long long index = 0;
	
	for(int j =0; j<dst_x;++j){
		FILE *fp_labeled = fopen(LABELED_PATH, "rb");
		int *dataset = new int[dst_z *dst_y];
		for(int i = 0; i< dst_z *dst_y ;++i){
			int data;
			fseek(fp_labeled, sizeof())
			fread(&data, sizeof(int), 1, fp_labeled);
			dataset[i] = SWAP32(data);
		}
		ostringstream path_buf;
		path_buf << index++;
		string path = "../../Data/XY/" + path_buf.str() + ".tif";
		FILE *fp = fopen(path.c_str(), "wb");
		fwrite(dataset, sizeof(int)*dst_x*dst_y, 1, fp);
	}

	// for(int j =0; j<dst_z;++j){
	// 	int *dataset = new int[dst_x *dst_y];
	// 	for(int i = 0; i< dst_x *dst_y ;++i){
	// 		int data;
	// 		fread(&data, sizeof(int), 1, fp_labeled);
	// 		dataset[i] = SWAP32(data);
	// 	}
	// 	ostringstream path_buf;
	// 	path_buf << index++;
	// 	string path = "../../Data/XY/" + path_buf.str() + ".tif";
	// 	FILE *fp = fopen(path.c_str(), "wb");
	// 	fwrite(dataset, sizeof(int)*dst_x*dst_y, 1, fp);
	// }

	return 0;
}

