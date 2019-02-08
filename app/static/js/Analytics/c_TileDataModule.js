var TileDataModule = (function(){
	var mTileArr;
	var ReqTileArr;
	var DrawTileArr;

	// var gSocket;
	
	var mPrevZoomLevel = 0;
	var mLoadingTile = 0;
	

	var mPrepatchingQueue = new Array();
	var mPrepatchingWorker;


	function setSocket(){
		// gSocket = aSocket;
		mTileArr = new Array();
		ReqTileArr = new Array();
		DrawTileArr = new Array();

		
		RenderingQuality(true);
		// CheckLoadingTile();
		console.log("Tile Loading : " + gViewObj.centerZ);
		// PrepatchImage(gViewObj.zoomLevel);
	}

	// function PrepatchImage(aLevel){
	// 	// printLog("Level : " + aLevel);
	// 	var tileVal = 1024*Math.pow(2, aLevel);
	// 	// printLog(tileVal);
	// 	var leftTopPosX = gViewObj.centerX - gViewObj.left;
	// 	var leftTopPosY = gViewObj.centerY - gViewObj.top;
	// 	var rightBottomPosX = gViewObj.centerX + gViewObj.right;
	// 	var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;

	// 	var TileIndexRange = new Object();
	// 	TileIndexRange.startX = parseInt(leftTopPosX/tileVal);
	// 	TileIndexRange.startY = parseInt(leftTopPosY/tileVal);
	// 	TileIndexRange.endX = parseInt(rightBottomPosX/tileVal)+1;
	// 	TileIndexRange.endY = parseInt(rightBottomPosY/tileVal)+1;
	// 	if(!mPrepatchingWorker){
	// 		for(var x=TileIndexRange.startX;x<TileIndexRange.endX;x++){
	// 			for(var y=TileIndexRange.startY;y<TileIndexRange.endY;y++){
					
	// 				var startZ = gViewObj.centerZ;
	// 				if(startZ < 0)
	// 					startZ = 0;
	// 				var endZ = startZ;
	// 				if(endZ > gDataInfoObj.dimz)
	// 					endZ = gDataInfoObj.dimz;

	// 				printLog("PrepatchingQueue start : " + startZ);
	// 				printLog("PrepatchingQueue end : " + endZ);
	// 				for(var tarZ=startZ+1;tarZ<=endZ;++tarZ){
	// 					var TileObj = new Object();
	// 					TileObj.level = aLevel;
	// 					TileObj.indexX = x;
	// 					TileObj.indexY = y;
	// 					TileObj.indexZ = tarZ;

	// 					var TileIndex = findTileObj(TileObj, mTileArr);
	// 					var Src;
						
	// 					Src = "http://hildebrand16.s3-website-us-east-1.amazonaws.com/130201zf142/EM/SWiFT/XY_56.4x56.4x60.0/latest/"+ gEMSliceIndex[tile.indexZ] +"/"+ parseInt(TileObj.level) +"/" +TileObj.indexY +  "_"+ TileObj.indexX+".png";
					
	// 					console.log(Src);
	// 					var QueueStatus = findPrepatchingQueue(Src);

	// 					if(TileIndex < 0 && QueueStatus == 0){
	// 						mPrepatchingQueue.push(Src);
	// 					}
	// 				}
	// 			}
	// 		}
		
	// 	// printLog("PrepatchingQueue : " + mPrepatchingQueue);

	// 		mPrepatchingWorker = new Worker("../static/js/Analytics/Worker/w_Prepatching_Z.js");
			
	// 		mPrepatchingWorker.onmessage = function (e) {
	// 			mPrepatchingQueue = new Array();
	// 			printLog("Done");
	// 			mPrepatchingWorker = false;
	// 		};		
	// 		mPrepatchingWorker.postMessage(mPrepatchingQueue);
	// 	}
	// }


	function MinusLoadingTile(){
		printLog("MinusLoadingTile : " + mLoadingTile);		
		if(mLoadingTile > 0){
			mLoadingTile--;
		}
		
		if(mLoadingTile == 0){
			DrawTileArr = new Array();
			ReqTileArr = new Array();
			calculateTile(gViewObj.zoomLevel, true);
			for(var i=0;i<DrawTileArr.length;++i){
				BackgroundEMViewer.draw(DrawTileArr[i])
			}	
		}
	}

	function RenderingQuality(ReqFlag){
		
		if(mLoadingTile == 0){
			ReqTileArr = new Array();
						
			if(gViewObj.left + gViewObj.right < 1024*Math.pow(2, gViewObj.zoomLevel)){

				if(gViewObj.zoomLevel - 1 >= 0){
					gViewObj.zoomLevel --;
					mPrevZoomLevel = -1;						
				}
			}
			else if(gViewObj.left + gViewObj.right > 2*1024*Math.pow(2, gViewObj.zoomLevel)){
				if(gViewObj.zoomLevel + 1 <= 4){

					gViewObj.zoomLevel ++;
					mPrevZoomLevel = 1;				
				}
			}
			else{		
				mPrevZoomLevel = 0;
			}

			BackgroundEMViewer.clear();
			DrawTileArr = new Array();
			calculateTile(gViewObj.zoomLevel, ReqFlag);

			for(var i=0;i<DrawTileArr.length;++i){
				BackgroundEMViewer.draw(DrawTileArr[i])
			}	
		}
		else{
			BackgroundEMViewer.clear();
			DrawTileArr = new Array();
			if(mPrevZoomLevel > 0){
				calculateTile(gViewObj.zoomLevel-1, ReqFlag);
			}
			else if(mPrevZoomLevel < 0){
				calculateTile(gViewObj.zoomLevel+1, ReqFlag);
			}
			else{			
				calculateTile(gViewObj.zoomLevel, ReqFlag);
			}

			for(var i=0;i<DrawTileArr.length;++i){
				BackgroundEMViewer.draw(DrawTileArr[i])
			}	

			printLog("N Draw")
		}
	}

	function update(ReqFlag){
		RenderingQuality(ReqFlag);
		// console.log("Tile Loading : " + gEMSliceIndex[gViewObj.centerZ]);
		// PrepatchImage(gViewObj.zoomLevel);
	}
	
	function getTileArr(){
		return mTileArr;
	}
	function getDrawTileArr(){
		return DrawTileArr;
	}	
	function getReqTileArr(){
		return ReqTileArr;
	}	
	function addTileObj(aTileObj){
		mTileArr.push(aTileObj);
	}

	function calculateTile(aLevel, ReqFlag){

		printLog("Level : " + aLevel);
		var tileVal = 1024*Math.pow(2, aLevel);
		// printLog(tileVal);
		var leftTopPosX = gViewObj.centerX - gViewObj.left;
		var leftTopPosY = gViewObj.centerY - gViewObj.top;
		var rightBottomPosX = gViewObj.centerX + gViewObj.right;
		var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;

		var TileIndexRange = new Object();
		TileIndexRange.startX = parseInt(leftTopPosX/tileVal);
		TileIndexRange.startY = parseInt(leftTopPosY/tileVal);
		TileIndexRange.endX = parseInt(rightBottomPosX/tileVal)+1;
		TileIndexRange.endY = parseInt(rightBottomPosY/tileVal)+1;


		for(var x=TileIndexRange.startX;x<TileIndexRange.endX;x++){
			for(var y=TileIndexRange.startY;y<TileIndexRange.endY;y++){
				var Scale = gWindowObj.width / (gViewObj.left + gViewObj.right);
				

				iWidth = tileVal * Scale;
				iHeight = tileVal * Scale;
				iPosX = (iWidth * x) - leftTopPosX*Scale;
				iPosY = (iHeight * y) - leftTopPosY*Scale;

				var TileObj = new Object();
				TileObj.width = iWidth;
				TileObj.height = iHeight;
				TileObj.posX = iPosX;  
				TileObj.posY = iPosY;
				

				TileObj.level = aLevel;
				TileObj.indexX = x;
				TileObj.indexY = y;
				TileObj.indexZ = gViewObj.centerZ;
				TileObj.data = null;

				var TileIndex = findTileObj(TileObj, mTileArr);

				// printLog(TileIndex);
				if(TileIndex >= 0){
					TileObj.data = mTileArr[TileIndex].data;
					DrawTileArr.push(TileObj);
					
				}
				else{
						ReqTileArr.push(TileObj);
				}
			}
		}
		mLoadingTile = ReqTileArr.length;
		requestTileArr();
		
	}


	function findTileObj(aTileObj, aTileArr){
		for(var i=0;i<aTileArr.length;++i){
			if( aTileArr[i].level == aTileObj.level &&
				aTileArr[i].indexX == aTileObj.indexX &&
				aTileArr[i].indexY == aTileObj.indexY &&
				aTileArr[i].indexZ == aTileObj.indexZ ){
				return i;
			}
		}
		return -1;
	}

	function findPrepatchingQueue(aSrc){
		for(var i=0;i<mPrepatchingQueue.length;++i){
			if(mPrepatchingQueue[i] == aSrc){
				return 1;
			}
		}
		return 0;
	}

	function requestTileArr(){
		// printLog("EM_Tile_Loading"+ ReqTileArr.length);

		for(var i=0;i<ReqTileArr.length;++i){
			setImage(ReqTileArr[i])
			function setImage(tile){
				var mImage;
				mImage = new Image();
				mImage.onload = function() {
					// printLog(mTile)
					// printLog("Draw");
					tile.data = mImage;
					// BackgroundEMViewer.draw(tile);
					addTileObj(tile);
					MinusLoadingTile();
				};	
				// console.log(gEMSliceIndex);
		
				console.log("Tile Loading : " + gEMSliceIndex[tile.indexZ] + "   /////     Tile Loading : " + tile.indexZ);

				
				mImage.src = "http://hildebrand16.s3-website-us-east-1.amazonaws.com/130201zf142/EM/SWiFT/XY_56.4x56.4x60.0/latest/"+ gEMSliceIndex[tile.indexZ] +"/"+ parseInt(tile.level) +"/" +tile.indexY +  "_"+ tile.indexX+".png";
				
				// console.log(mImage.src);

			}	
		}
		// ReqTileArr = new Array();
	}

	return {
		setSocket : setSocket,
		update : update,
		getTileArr : getTileArr,
		getDrawTileArr : getDrawTileArr,
		getReqTileArr : getReqTileArr,
		addTileObj : addTileObj,
	}
})();