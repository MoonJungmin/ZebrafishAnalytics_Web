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
#define MASK_PATH "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/"

#define TEXTURESIZE 2048*2048
#define LABELSIZE 313664

int Labeled_Image[TEXTURESIZE];
unsigned char Mask_Image[TEXTURESIZE];

long long int LabelStorage[LABELSIZE+1];




void process(FILE *label, FILE *mask){
	memset(LabelStorage, 0, sizeof(long long int)*(LABELSIZE+1));
	// fseek(label, sizeof(int)*TEXTURESIZE*297, 0);
	int cnt =0;
	while(!feof(label)){
		fread(Labeled_Image, sizeof(int)*TEXTURESIZE, 1, label);
		fread(Mask_Image, sizeof(unsigned char)*TEXTURESIZE, 1, mask);

		for(int i=0;i<TEXTURESIZE;++i)
		{	
			// if(Labeled_Image[i] > 0)
			// 	printf("%d\n", Labeled_Image[i]);

			if(std::min(1,(int)Mask_Image[i]) == 1){
				LabelStorage[(int)Labeled_Image[i] * std::min(1,(int)Mask_Image[i])] += 1;
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
			// if(dir_entry->d_name[0] == 'BrainMask_Erode_50' || dir_entry->d_name[0] == 'BrainMask_Erode_100' || dir_entry->d_name[0] == 'BrainMask_Erode_150'){
		
				MaskName = dir_entry->d_name;
				// MaskPath = MASK_PATH + MaskName + "/RAW.raw";
				MaskPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/DiencephalonHabenulaLeft/RAW.raw";
				// ReportPath = MASK_PATH + MaskName + "/Report.txt";
				ReportPath = "/home/Pearl_Home/ridwan/Data/Subregions/Cropped(2048x2048)/VIS2017/DiencephalonHabenulaLeft/Report.txt";
				
				cout <<"Mask Path : "<< MaskPath <<endl;
				
				FILE *fp_labeled = fopen(LABELED_PATH, "rb");
				FILE *fp_mask = fopen(MaskPath.c_str(), "rb");
				FILE *fp_write = fopen(ReportPath.c_str(), "w");
				
				process(fp_labeled, fp_mask);

				for(int i=1;i<LABELSIZE+1; ++i){
					if(LabelStorage[i] > 0){
						fprintf(fp_write, "%d ", i);
					}
				}

				fclose(fp_mask);
				fclose(fp_write);
				fclose(fp_labeled);
				break;
			}
		}
		closedir( dir_info);
	}   
	
	return 0;
}




