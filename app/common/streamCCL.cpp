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
	//Path1 Path2 dimx dimy
	if(argc != 5){
		printf("Arg Error : InPath OutPath X Y\n");
		return 0;
	}
	char *InPath = argv[1];
	char *OutPath = argv[2];
	int DimX = atoi(argv[3]);
	int DimY = atoi(argv[4]);

	printf("-----------------------------------------------------------------------------------------\n");
	printf("In : %s \n", InPath);
	printf("Out : %s \n", OutPath);
	printf("X : %d \n", DimX);
	printf("Y : %d \n", DimY);
	printf("-----------------------------------------------------------------------------------------\n");

	FILE *fp_seg = fopen(InPath, "rb");
	FILE *fp_ccl = fopen(OutPath, "wb");
	
	// long long index = 0;
	// while(!feof(fp_labeled)){
	// 	float data;
	// 	fread(&data, sizeof(float), 1, fp_labeled);
	// 	int out_data = (int)ReverseFloat(data);
	// 	fwrite(&out_data, 1, sizeof(int), fp_out);
	// }

	return 0;
}

