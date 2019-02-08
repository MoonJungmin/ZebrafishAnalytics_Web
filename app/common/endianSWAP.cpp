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



#define LABELED_PATH "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/LabeledVolume_XY/170331_LabeledVolume.raw"
#define OUT "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/LabeledVolume_XY/170331_LabeledVolume_endian.raw"

int dst_x = 2048;
int dst_y = 2048;

float ReverseFloat( const float inFloat )
{
   float retVal;
   char *floatToConvert = ( char* ) & inFloat;
   char *returnFloat = ( char* ) & retVal;

   // swap the bytes into a temporary buffer
   returnFloat[0] = floatToConvert[3];
   returnFloat[1] = floatToConvert[2];
   returnFloat[2] = floatToConvert[1];
   returnFloat[3] = floatToConvert[0];

   return retVal;
}

int main(int argc, char **argv)
{
	FILE *fp_labeled = fopen(LABELED_PATH, "rb");
	FILE *fp_out = fopen(OUT, "wb");
	long long index = 0;
	while(!feof(fp_labeled)){
		float data;
		fread(&data, sizeof(float), 1, fp_labeled);
		int out_data = (int)ReverseFloat(data);
		fwrite(&out_data, 1, sizeof(int), fp_out);
	}

	return 0;
}

