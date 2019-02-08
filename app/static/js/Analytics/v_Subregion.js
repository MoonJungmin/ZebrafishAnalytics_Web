var SubregionViewer = (function(){
	
	var mCanvasID;	
	var mContext;
	var mCanvas;

	// var gSocket;
	

	var mReqStatus = true;
	
	function setCanvas(aCanvID){
		mCanvasID = aCanvID;
		mCanvas=document.getElementById(mCanvasID);
		mContext = mCanvas.getContext("2d");
	}

	function setSocket(){
		// gSocket = aSocket;
	}


	function start(){
		clear();
		for(var k=0;k<gRenderingArray.length;++k){
			if (gSelectionInventory[gRenderingArray[k]].type == "Subregion"){
				var aSubregionsIndex = gSelectionInventory[gRenderingArray[k]].subregion_index;
				var Idx = checkSubregionArr(gRenderingArray[k]);
				if (Idx != -1){
					drawSubregion(gRenderingArray[k], Idx);
				}
				else{
					if(mReqStatus){
						reqSubregionArr(gViewObj.centerZ, (aSubregionsIndex));
						mReqStatus = false;
					}
				}	
			}
		}
	}

	function checkSubregionArr(aInvenIndex){
		for(var i=0; i<gSelectionInventory[aInvenIndex].contour_array.length;++i){
			if(gSelectionInventory[aInvenIndex].contour_array[i].index == gViewObj.centerZ && gSelectionInventory[aInvenIndex].contour_array[i].level == gViewObj.zoomLevel){
				return i;
			}
		}
		return -1;
	}

	function drawSubregion(Iven_Idx, ZIdx){
		mReqStatus = true;
		var leftTopPosX = gViewObj.centerX - gViewObj.left;
		var leftTopPosY = gViewObj.centerY - gViewObj.top;
		var rightBottomPosX = gViewObj.centerX + gViewObj.right;
		var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;
		var labelArray = gSelectionInventory[Iven_Idx].contour_array[ZIdx].Array;
		var Scale = gWindowObj.width / (gViewObj.left + gViewObj.right);
		var level = gSelectionInventory[Iven_Idx].contour_array[ZIdx].level;
		var resolution = Math.pow(2, level);

		mContext.globalAlpha = 0.5;
		var color;
		// console.log(labelArray)
		color = hex2rgba_convert(gSelectionInventory[Iven_Idx].color, 100);
		for(var i=0;i<labelArray.length;++i){
			//// console.log("test");
			var contour = labelArray[i].contour;
			mContext.beginPath();
			for(var j=0;j<contour.length;j+=2){
				var x = (contour[j]*resolution - leftTopPosX) * Scale; 
				var y = (contour[j+1]*resolution - leftTopPosY) * Scale;
				mContext.lineTo(x, y);
			}
			mContext.closePath();

			mContext.lineWidth = 2;
			mContext.fillStyle = color;
			mContext.fill();
			mContext.strokeStyle = color;
			mContext.stroke();
		}
	}

	function clear(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
	}

	function reqSubregionArr(aIndex, aSubregionIndex){
		startTime("Subregion_Loading");
		console.log("Subregion_Loading");
		gSocket.emit('req_SubregionContour', aSubregionIndex, aIndex, gViewObj.zoomLevel);
	}

	return {
		clear : clear,
		start : start,
		setCanvas : setCanvas,
		setSocket : setSocket,
		drawSubregion : drawSubregion
	}

})();