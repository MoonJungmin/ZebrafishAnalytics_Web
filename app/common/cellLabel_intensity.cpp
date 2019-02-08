#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <assert.h>
#include <math.h>

#include <unistd.h>
#include <dirent.h>
/*

/home/Pearl/ridwan/ZB_VisualAnalytics/160512_ZBtoEM_xf160512bigwarp_EMformat_1200nmIso_8bit_Diencephalon.raw | SendTelgram -m
/home/Pearl/ridwan/ZB_VisualAnalytics/160512_ZBtoEM_xf160512bigwarp_EMformat_1200nmIso_8bit_Mesencephalon.raw
/home/Pearl/ridwan/ZB_VisualAnalytics/160512_ZBtoEM_xf160512bigwarp_EMformat_1200nmIso_8bit_Rhombencephalon.raw
/home/Pearl/ridwan/ZB_VisualAnalytics/160512_ZBtoEM_xf160512bigwarp_EMformat_1200nmIso_8bit_SpinalCord.raw
/home/Pearl/ridwan/ZB_VisualAnalytics/160512_ZBtoEM_xf160512bigwarp_EMformat_1200nmIso_8bit_Telencephalon.raw

*/

using namespace std;

#define LABELED_PATH "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/LabeledVolume_XY/170331_LabeledVolume_endian.raw"
#define EM_PATH "/home/Pearl_Home/ridwan/Data/170201_SWiFT_60nmpx_downsample/EMVolume_crop(2048x2048x3701).raw"
#define RESULT_PATH "/home/Pearl_Home/ridwan/Data/Intensity.json"

#define TEXTURESIZE 2048*2048
#define LABELSIZE 313664

int Labeled_Image[TEXTURESIZE];
unsigned char EM_Image[TEXTURESIZE];
long long int CellVolumeStorage[LABELSIZE+1];
long long int CellIntensityStorage[LABELSIZE+1];




void process(FILE *label, FILE *em){
	memset(CellVolumeStorage, 0, sizeof(long long int)*(LABELSIZE+1));
	memset(CellIntensityStorage, 0, sizeof(long long int)*(LABELSIZE+1));
	
	int cnt =0;
	while(!feof(label)){
		fread(Labeled_Image, sizeof(int)*TEXTURESIZE, 1, label);
		fread(EM_Image, sizeof(unsigned char)*TEXTURESIZE, 1, em);

		for(int i=0;i<TEXTURESIZE;++i)
		{	
			if(Labeled_Image[i] > 0){
				CellVolumeStorage[Labeled_Image[i]] ++;
				CellIntensityStorage[Labeled_Image[i]] += EM_Image[i];
			}
		}
		printf("Progress : %d\n", cnt++);
	}
}

int main(int argc, char **argv)
{

	string MaskPath;
	string MaskName;
	string ReportPath;
				
	FILE *fp_labeled = fopen(LABELED_PATH, "rb");
	FILE *fp_em = fopen(EM_PATH, "rb");
	
	FILE *fp_write = fopen(RESULT_PATH, "w");
		
	process(fp_labeled, fp_em);

	fprintf(fp_write, "[");
	for(int i=1;i<LABELSIZE+1; ++i){
		if(CellVolumeStorage[i] > 0){
			if(i>1)
				fprintf(fp_write, ",");
			fprintf(fp_write, "%lf", (double)CellIntensityStorage[i]/(double)CellVolumeStorage[i]);
		}
	}
	fprintf(fp_write, "]");

	fclose(fp_em);
	fclose(fp_write);
	fclose(fp_labeled);

	return 0;
}




