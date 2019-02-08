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

#include <list>


using namespace std;



struct Voxel{
	int x;
	int y;
	int z;
};

struct BoundBox{
	int sX;
	int eX;

	int sY;
	int eY;

	int sZ;
	int eZ;
};

struct Component{
	long int index;
	list<Voxel> voxelArray;
	BoundBox boundingBox;
};


list<Component> gCompList;
long int gIndex = 2;
// int gCompArraySize = 10;

int **gCurrentSlice;
int **gPrevSlice;
int DimX;
int DimY;
char *InPath;
char *OutPath;

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

void readSlice(FILE *fp){
	// printf("readSlice\n");
	unsigned char * TempRawData = new unsigned char[DimX*DimY];
	fread(TempRawData, sizeof(unsigned char)*DimX*DimY, 1, fp);

	// 1D to 2D & Casting
	int idx = 0;
	for(int i=0;i<DimY;++i){
		for(int j=0;j<DimX;++j){	
			gCurrentSlice[i][j] = (int)TempRawData[idx++];
			if(gCurrentSlice[i][j] == 255){
				gCurrentSlice[i][j] = 1;
			}
		}
	}
}

void globalInitialize(){
	gCurrentSlice = new int*[DimY];
	for(int i = 0; i < DimY; ++i)
		gCurrentSlice[i] = new int[DimX];

	gPrevSlice = new int*[DimY];
	for(int i = 0; i < DimY; ++i)
		gPrevSlice[i] = new int[DimX];
}

BoundBox BoundingBoxUpdate(Voxel aV, BoundBox aB){
	if(aB.sX > aV.x){
		aB.sX = aV.x;
	}
	if(aB.eX < aV.x){
		aB.eX = aV.x;
	}
	if(aB.sY > aV.y){
		aB.sY = aV.y;
	}
	if(aB.eY < aV.y){
		aB.eY = aV.y;
	}
	if(aB.sZ > aV.z){
		aB.sZ = aV.z;
	}
	if(aB.eZ < aV.z){
		aB.eZ = aV.z;
	}

	return aB;
}


void checkNeighbor(int x, int y, int z){
	int idxArr[4];
	for(int i=0;i<4;++i){
		idxArr[i] = 0;
	}

	if(y >= 1 && x >= 1)
		idxArr[0] = gCurrentSlice[y-1][x-1];
	if(y >= 1){
		idxArr[1] = gCurrentSlice[y-1][x];
		idxArr[2] = gCurrentSlice[y-1][x+1];
	}
	if(x >= 1)
		idxArr[3] = gCurrentSlice[y][x-1];

	if(idxArr[0] + idxArr[1] + idxArr[2] + idxArr[3] == 0){ // New
		Component mComp;
		Voxel mV;
		BoundBox mBB;

		mV.x = x;
		mV.y = y;
		mV.z = z;

		mBB.sX = x;
		mBB.eX = x;
		mBB.sY = y;
		mBB.eY = y;
		mBB.sZ = z;
		mBB.eZ = z;

		mComp.index = gIndex;
		mComp.voxelArray.push_back(mV);
		mComp.boundingBox = mBB;

		gCompList.push_back(mComp);
		gCurrentSlice[y][x] = gIndex++;
	}
	else{
		long int min = 9999999999;
		for(int i=0;i<4;++i){
			if(idxArr[i] < min && idxArr[i] != 0)
				min = idxArr[i];
		}
		for(int i=0;i<4;++i){
			if(idxArr[i] == min){
				gCurrentSlice[y][x] = min;
				list<Component>::iterator iter;
				for (iter = gCompList.begin(); iter != gCompList.end(); ++iter){
        			if(iter->index == min){
						Voxel mV;
						mV.x = x;
						mV.y = y;
						mV.z = z;
        				iter->voxelArray.push_back(mV);
        				BoundBox mBB = BoundingBoxUpdate(mV, iter->boundingBox);
        				iter->boundingBox = mBB;
    				}
        		}
			}
			else if(idxArr[i] != min && idxArr[i] != 0){
				gCurrentSlice[y][x] = min;
				list<Component>::iterator iter;
				for (iter = gCompList.begin(); iter != gCompList.end(); ++iter){
        			if(iter->index == min){
						Voxel mV;
						mV.x = x;
						mV.y = y;
						mV.z = z;
        				iter->voxelArray.push_back(mV);
        				BoundBox mBB = BoundingBoxUpdate(mV, iter->boundingBox);
        				iter->boundingBox = mBB;
    				}
        		}

        		if(i == 0){

        		}
        		else if(i == 1){

        		}
        		else if(i == 2){

        		}
        		else if(i == 3){

        		}
			}
		}


	}
}

void ConnectedComponent(int zIndex){

	if(zIndex == 0){
		for(int i=0;i<DimY;++i){
			for(int j=0;j<DimX;++j){
				if(gCurrentSlice[i][j] == 1){ // new Component
					checkNeighbor(j, i, zIndex);
				}
			}
		}
	}
	else{
		
	}
}


int main(int argc, char **argv)
{
	//Path1 Path2 dimx dimy
	if(argc != 5){
		printf("Arg Error : InPath OutPath X Y\n");
		return 0;
	}
	InPath = argv[1];
	OutPath = argv[2];
	DimX = atoi(argv[3]);
	DimY = atoi(argv[4]);

	globalInitialize();

	printf("-----------------------------------------------------------------------------------------\n");
	printf("In : %s \n", InPath);
	printf("Out : %s \n", OutPath);
	printf("X : %d \n", DimX);
	printf("Y : %d \n", DimY);
	printf("-----------------------------------------------------------------------------------------\n");

	FILE *fp_seg = fopen(InPath, "rb");
	FILE *fp_ccl = fopen(OutPath, "wb");


	int idx = 0;
	while(!feof(fp_seg)){
		readSlice(fp_seg);
		ConnectedComponent(idx++);
		break;
	}


	list<Component>::iterator iter;
    for (iter = gCompList.begin(); iter != gCompList.end(); ++iter){
        cout << iter->voxelArray.size() << ' ';
    }




	
	// for(int i=0;i<DimY;++i){
	// 	for(int j=0;j<DimX;++j){
	// 		// if(CurSlice[i][j] == 1)
	// 			// printf("(%d, %d)\n", j, i);
	// 		printf("%d", gCurrentSlice[i][j]);

	// 	}
	// }
	// long long index = 0;
	// while(!feof(fp_labeled)){
	// 	float data;
	// 	fread(&data, sizeof(float), 1, fp_labeled);
	// 	int out_data = (int)ReverseFloat(data);
	// 	fwrite(&out_data, 1, sizeof(int), fp_out);
	// }

	return 0;
}

