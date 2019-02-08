var NavigationModule = (function(){
	var mCanvasID;	
	var mContext;
	var mCanvas;
	// var gSocket;
	
	var mLabelsCountData;
	
	var mCellLabelsInfoData = new Object();
	mCellLabelsInfoData.cellLabelsInfoHistogram = null;
	mCellLabelsInfoData.cellLabelsInfoHistMax = 0;
	mCellLabelsInfoData.cellLabelsInfoHistMin = 0;
	mCellLabelsInfoData.cellLabelsInfoHistStep = 0;
	mCellLabelsInfoData.cellLabelsInfoArray = null;
	mCellLabelsInfoData.cellLabelsInfoArrayLength = 0;
	
	var mPicker;
	var mSubregionData;


	
	function setCanvas(aCanvasID){
		mCanvasID = aCanvasID;
		mCanvas=document.getElementById(aCanvasID);
		mContext = mCanvas.getContext("2d");
		mPicker = new Object();
		mPicker.y = (gViewObj.centerZ/gDataInfoObj.dimz)*mCanvas.height;
		mPicker.x = 0;
		mPicker.width = 20;
		mPicker.height = 14;
		mPicker.hit = false;
		eventHandlerThis()
	}

	function setSocket(){
		// gSocket = aSocket;
		startTime("CellInfo_Loading");
		gSocket.emit('req_CellLabelsInfo');
		// function readTextFile(file, callback) {
		// 	var rawFile = new XMLHttpRequest();
		//     rawFile.overrideMimeType("application/json");
		//     rawFile.open("GET", file, true);
		//     rawFile.onreadystatechange = function() {
		//         if (rawFile.readyState === 4 && rawFile.status == "200") {
		//             callback(rawFile.responseText);
		//         }
		//     }
		//     rawFile.send(null);
		// }

		// readTextFile("../static/countLabels.json", function(text){
		//     var data = JSON.parse(text);
		//     setCellLabelsInfoData(data);
		//     // console.log(data);
		// });
	}

	function interpolateRGB(startRGB, endRGB, a, e) {
		var rgb = {
			r: Math.round((endRGB.r - startRGB.r) * a / e + startRGB.r),
			g: Math.round((endRGB.g - startRGB.g) * a / e + startRGB.g),
			b: Math.round((endRGB.b - startRGB.b) * a / e + startRGB.b)
		}

		return new RGB(rgb.r, rgb.g, rgb.b)
	}


	function drawBackground(){
		//// console.log("Navi", gFocusedObject);
		mContext.clearRect(0, 0, 30, mCanvas.height);
		mContext.globalAlpha = 1.0;
		mContext.shadowBlur=0;

		
		mContext.beginPath();
		mContext.rect(0,0,20,mCanvas.height);
		mContext.closePath();
		mContext.fillStyle = gSequentialColors[1];
		mContext.fill();
		for(var i=0;i<parseInt(mCanvas.height);++i){
			mContext.globalAlpha = 1.0;
			mContext.beginPath();
			mContext.rect(0,  gCellLabelsHistogram.step*i,20,  gCellLabelsHistogram.step);	
			mContext.closePath();
			var color = interpolateRGB(gSequentialColors[1], gQualitativeColors[1], 
					(gCellLabelsHistogram.array[i].value-gCellLabelsHistogram.min)
					/(gCellLabelsHistogram.max-gCellLabelsHistogram.min)*10, 10);
			mContext.fillStyle = color.toString();
			mContext.fill();
		}
		for(var i=0;i<parseInt(mCanvas.height);++i){
			if(gCellLabelsHistogram.array[i].selection == 1){
				mContext.globalAlpha = 0.8;
				mContext.beginPath();
				mContext.rect(5, gCellLabelsHistogram.step*i,8, gCellLabelsHistogram.step);	
				mContext.closePath();
				var color = gFocusedObject.node_color;
				mContext.fillStyle = color.toString();
				mContext.fill();
			}
		}

	}


	function drawPicker(){
		mContext.globalAlpha = 1.0;
		mContext.beginPath();
		mContext.rect(mPicker.x,mPicker.y,mPicker.width,mPicker.height);
		mContext.closePath();
		mContext.shadowBlur=5;
		mContext.shadowColor="black";
		mContext.fillStyle = gInitialColors[0];
		mContext.fill();
		mContext.beginPath();
		mContext.moveTo(2, mPicker.y + 7);
		mContext.lineTo(18, mPicker.y + 7);
		mContext.strokeStyle = "white";
		mContext.stroke();

		
	}

	function eventHandlerThis(){
		document.getElementById(mCanvasID).onmousedown = handleCanvMouseDown;
		document.getElementById(mCanvasID).onmousemove = handleCanvMouseMove;
		document.getElementById(mCanvasID).onmouseup = handleCanvMouseUp;

		function handleCanvMouseMove(event){
			if(mPicker.hit == true){
				mPicker.y += event.movementY;
				gViewObj.centerZ = parseInt(((mPicker.y+mPicker.height/2) /mCanvas.height) * gDataInfoObj.dimz);
				redraw();
				TopviewNavigation.draw();
			}
		}			

		function handleCanvMouseUp(event){
			if(event.which == 1){
				mPicker.hit = false;
				
			}
			TileDataModule.update(true);
		}
		function handleCanvMouseDown(event){
			if(event.which == 1){
				checkPickerHit(event)
			}
		}

		function checkPickerHit(event){
			var adj = 1;
			if(mPicker.x-adj < event.clientX && mPicker.x+mPicker.width+adj > event.clientX && mPicker.y-adj < event.clientY && mPicker.y+mPicker.height+adj > event.clientY ){
				mPicker.hit = true;
				//// console.log("hit");
			}
		}	

	}

	function setCellLabelHistColor(aIndex){
		//console.log("setCellLabelHistColor", aIndex);
		for(var i=0;i<gCellLabelsHistogram.array.length;++i){
			gCellLabelsHistogram.array[i].selection = false;
		}

		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				var min = (gCellLabelsRange[i].minZ / gDataInfoObj.dimz) * parseInt(mCanvas.height);
				var max = (gCellLabelsRange[i].maxZ / gDataInfoObj.dimz) * parseInt(mCanvas.height);
				for(var j=parseInt(min);j<=parseInt(max);++j){
					gCellLabelsHistogram.array[j].selection = true;
				}		
			}
		}		
	}

	function setCellLabelsInfoData(data){
		var array_data = JSON.parse(data);
		// console.log(array_data);
		// console.log(flask_size);
		for(var i=0;i<mCanvas.height;++i){
			var obj = new Object()
			obj.value = 0;
			obj.selection = false;
			gCellLabelsHistogram.array.push(obj);
		}
		
		
		for(var i=0;i<array_data.length;++i){
			// console.log("TEST");
			var min = ((array_data[i]['minZ_cell']) / gDataInfoObj.dimz) * parseInt(mCanvas.height);
			var max = ((array_data[i]['maxZ_cell']) / gDataInfoObj.dimz) * parseInt(mCanvas.height);

			gCellLabelsRange[i][0] = array_data[i]['minZ_cell'];
			gCellLabelsRange[i][1] = array_data[i]['maxZ_cell'];

			if(min <= max){
				for(var j=parseInt(min);j<=parseInt(max);++j){
					if(j > 0){
						gCellLabelsHistogram.array[j].value+=1;
					}
				}
			}
		}
	    
		function findMax(Arr){
			var Max = -Infinity;
			for(var i=0;i<Arr.length;++i){
				if(Arr[i].value > Max)
					Max = Arr[i].value
			}
			return Max;
		}
		function findMin(Arr){
			var Min = Infinity;
			for(var i=0;i<Arr.length;++i){
				if(Arr[i].value < Min)
					Min = Arr[i].value
			}
			return Min;
		}

	    
		gCellLabelsHistogram.max = findMax(gCellLabelsHistogram.array);
		gCellLabelsHistogram.min = findMin(gCellLabelsHistogram.array);
		
		drawBackground();
		drawPicker();
	}


	function clearall(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
	}

	function redraw(){
			document.getElementById("navi_current_index").value = gEMSliceIndex[gViewObj.centerZ];
			drawBackground();
			// drawDiagramSelection();
			// drawCellLabelsInfo();
			// drawSubregionSelection();
			// drawSubregionInfo();
			drawPicker();
	}

	function setZIndex(){
		console.log(document.getElementById("navi_current_index").value);

		var value;// = gEMSliceIndex.indexOf((document.getElementById("navi_current_index").value));

		for(var i=0;i<gEMSliceIndex.length;++i){
			if(gEMSliceIndex[i] == parseInt(document.getElementById("navi_current_index").value)){
				value = i;
			}
		}
		console.log(value)
		if(value > 0 && value < gDataInfoObj.dimz){
			gViewObj.centerZ = value;
			mPicker.y = (gViewObj.centerZ/gDataInfoObj.dimz)*mCanvas.height;
		}
		redraw();
	}

	return {
		setSocket : setSocket,
		setCanvas : setCanvas,
		clearall : clearall,
		setCellLabelsInfoData : setCellLabelsInfoData,
		setCellLabelHistColor : setCellLabelHistColor,
		redraw : redraw,
		setZIndex : setZIndex
	}

})();