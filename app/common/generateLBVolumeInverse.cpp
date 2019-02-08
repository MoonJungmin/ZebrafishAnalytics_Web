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


using namespace std;

#define LABELED_PATH "../../../Data/160804_240nmpxS1_labeled.raw"

int dst_x = 2475;
int dst_y = 2151;

int main(int argc, char **argv)
{
	FILE *fp_labeled = fopen(LABELED_PATH, "rb");

	long long index = 0;
	while(!feof(fp_labeled)){
		float data;
		fread(&data, sizeof(float), 1, fp_labeled);
		if(data > 0.0){
			int z = index/(dst_x*dst_y);
			int y = (index%(dst_x*dst_y))/dst_x;
			int x = (index%(dst_x*dst_y))%dst_x;
			ostringstream path_buf;
			path_buf << (int)data;
			string path = "../../Data/LabeledData/" + path_buf.str() + ".txt";
			FILE *fp = fopen(path.c_str(), "a");

			fprintf(fp, "%d %d %d\n", x, y, z);
			fclose(fp);
		}
		index++;
	}

	return 0;
}

