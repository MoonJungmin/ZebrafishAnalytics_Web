#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <assert.h>
#include <math.h>

#include <unistd.h>
#include <dirent.h>

using namespace std;

#define MASK_PATH "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/"

#define TEXTURESIZE 2048*2048

int Labeled_Image[TEXTURESIZE];
unsigned char Mask_Image[TEXTURESIZE];

long long int Subregion_Volume = 0;




void process(FILE *mask){

	while(!feof(mask)){
		fread(Mask_Image, sizeof(unsigned char)*TEXTURESIZE, 1, mask);

		for(int i=0;i<TEXTURESIZE;++i)
		{	
			if(Mask_Image[i] > 0){
				// printf("%d\n", Mask_Image[i]);
				Subregion_Volume++;
			}
		}
	}
}

int main(int argc, char **argv)
{

	DIR *dir_info;
	struct dirent *dir_entry;

	dir_info = opendir(MASK_PATH);
	if ( NULL != dir_info) {
		string MaskPath;
		string MaskName;
		string ReportPath;
		while( dir_entry = readdir(dir_info)) {
			if(dir_entry->d_name[0] != '.'){
				MaskName = dir_entry->d_name;
				// MaskPath = MASK_PATH + MaskName + "/RAW.raw";
				MaskPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/DiencephalonHabenulaRight/RAW.raw";
				// ReportPath = MASK_PATH + MaskName + "/Volume.txt";
				ReportPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/DiencephalonHabenulaRight/Volume.txt";

				cout <<"Mask Path : "<< MaskPath <<endl;
				
				FILE *fp_mask = fopen(MaskPath.c_str(), "rb");
				FILE *fp_write = fopen(ReportPath.c_str(), "w");
				
				Subregion_Volume = 0;
				process(fp_mask);
				fprintf(fp_write, "%ld ", Subregion_Volume);
		

				fclose(fp_mask);
				fclose(fp_write);
				break;
				
			}
		}
		closedir( dir_info);
	}   
	
	return 0;
}




