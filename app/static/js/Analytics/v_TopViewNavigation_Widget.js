var TopviewNavigation = (function(){
	var mCanvasID;	
	var mContext;
	var mCanvas;
	// var gSocket;
	
	var mTopViewDataObj = {
		dimx: 800,
		dimy: 512,
		dimz: 460
	}
	var mTopViewWindowObj = {
		width: parseInt(800/3),
		height: parseInt(512/3)
	}
	var mTopViewObj = {
		centerX: parseInt(mTopViewWindowObj.width*(1-(gViewObj.centerZ/gDataInfoObj.dimz))),
		centerZ: parseInt(mTopViewDataObj.dimz/2),
	}


	var mBackgroundEMImageArr = new Array();
	var mSubregionContourArr = new Array(512);

	var EM_CutSize = 297/gDataInfoObj.dimz


	function setCanvas(aCanvasID){
		mCanvasID = aCanvasID;
		mCanvas=document.getElementById(aCanvasID);
		mContext = mCanvas.getContext("2d");

		eventHandlerThis()
	}

	function setSocket(){
		// gSocket = aSocket;
		startTime("Topview_Loading");
		// gSocket.emit('req_TopviewWidget');
		setImageData();
	}

	function setSubregionData(aData){
		var index = gSelectionInventory.length-1;
		var dataArr = new Array();
		var mData = JSON.parse(aData);
		console.log(mData.length)
		for (var i=0;i<mData.length;++i){
			var x = mData[i]['FLOOR(vx_subregion/5)'];
			var y = mData[i]['FLOOR(vy_subregion/5)'];
			var z = mData[i]['FLOOR(vz_subregion/5)'];
			var points = new Object();
			// if(gSubregionInfoData[gSelectionInventory[index].subregion_index].Version == 1){
			points.x = x+40;
			points.y = y;

			// 	// console.log("Topview - old version");
			// }
			// else{
			// 	points.x = x;
			// 	points.y = y;	
			// 	console.log("Topview - new version");
			// }
			points.z = mTopViewDataObj.dimx - z;
			dataArr.push(points);
		}

		gSelectionInventory[index].top_contour_array = dataArr;
		// console.log(mData);

	}

	function zeroPad(n,length){
		var s=n+"",needed=length-s.length;
		if (needed>0) s=(Math.pow(10,needed)+"").slice(1)+s;
		return s;
	}

	function setImageData(){
		var imageCount = mTopViewDataObj.dimz;
		var imagesLoaded = 0;
		
		for(var i=0;i<mTopViewDataObj.dimz;++i){
			mBackgroundEMImageArr[i] = new Image();
			mBackgroundEMImageArr[i].src = "/static/Topview/160515_SWiFT_1200nmpx_singles_reslice_top/" + zeroPad(i,3) +".jpg";
			mBackgroundEMImageArr[i].onload = function() {
		        imagesLoaded++;
		        if(imagesLoaded == imageCount){
					draw();
				}
			};			
		}
	}

	function draw(){
		//// console.log(mSubregionContourArr);
		// if(gViewObj.centerZ > 297){
		mTopViewObj.centerX = parseInt(mTopViewWindowObj.width*(1-(gViewObj.centerZ/gDataInfoObj.dimz)));
		//// 	console.log(mTopViewObj.centerX);
		// }
		// else
		// 	mTopViewObj.centerX = 0;


		aImage = mBackgroundEMImageArr[mTopViewObj.centerZ];
		//console.log(mTopViewObj.centerZ);
		mContext.globalAlpha = 1.0;
		// mContext.scale(-1,1);
		mContext.drawImage(aImage, 0,0, mTopViewWindowObj.width, mTopViewWindowObj.height);
		mContext.beginPath();
		mContext.moveTo(mTopViewObj.centerX, 0);
		mContext.lineTo(mTopViewObj.centerX, mTopViewWindowObj.height);
		mContext.closePath();
		mContext.strokeStyle = gQualitativeColors[5];
		mContext.stroke();


		mContext.globalAlpha = 0.5;
		
		for(var k=0;k<gRenderingArray.length;++k){
			var aIndex = gRenderingArray[k];
			if (gSelectionInventory[aIndex].type == "Subregion"){

				var contourArr = gSelectionInventory[aIndex].top_contour_array;
				for(var i=0;i<contourArr.length;++i){
					// console.log(contourArr[i].y, mTopViewObj.centerZ)
					if(contourArr[i].y == mTopViewObj.centerZ){
						// console.log("find");
						mContext.beginPath();
						// for(var j=0;j<contourArr[i].points.length;++j){
						var x;
						var y;

						// if(gSubregionInfoData[gSelectionInventory[aIndex].subregion_index].Version == 1){
						// 	x = (contourArr[i].z)/mTopViewDataObj.dimx*mTopViewWindowObj.width; 
						// 	y = (contourArr[i].x)/mTopViewDataObj.dimy*mTopViewWindowObj.height;
						// }
						// else{
							
						// }
						x = (contourArr[i].z)/mTopViewDataObj.dimx*mTopViewWindowObj.width; 
						y = (contourArr[i].x)/mTopViewDataObj.dimy*mTopViewWindowObj.height;	
				  		mContext.fillRect(x,y,2,2);
						// mContext.lineTo(x, y);
						// }
						mContext.closePath();
						var color = hex2rgba_convert(gSelectionInventory[aIndex].color, 100);


						mContext.lineWidth = 2;
						mContext.fillStyle = color;
						mContext.fill();
						mContext.strokeStyle = color;
						mContext.stroke();
						
					}
				}	

				// if(gSelectionInventory[aIndex].top_contour_array['v'][mTopViewObj.centerZ] != "empty" && gSelectionInventory[aIndex].top_contour_array[mTopViewObj.centerZ] != null){				

				// if(gSelectionInventory[aIndex].top_contour_array[mTopViewObj.centerZ] != "empty" && gSelectionInventory[aIndex].top_contour_array[mTopViewObj.centerZ] != null){
				// 	contourArr = JSON.parse(gSelectionInventory[aIndex].top_contour_array[mTopViewObj.centerZ])
				// 	//console.log(contourArr);
				// 	for(var i=0;i<contourArr.length;++i){
				// 		mContext.beginPath();
				// 		for(var j=0;j<contourArr[i].points.length;++j){
				// 			var x = (contourArr[i].points[j][0])/mTopViewDataObj.dimx*mTopViewWindowObj.width; 
				// 			var y = (contourArr[i].points[j][1])/mTopViewDataObj.dimy*mTopViewWindowObj.height;;
				// 			mContext.lineTo(x, y);
				// 		}
				// 		mContext.closePath();
				// 		var color = hex2rgba_convert(gSelectionInventory[aIndex].color, 100);


				// 		mContext.lineWidth = 2;
				// 		mContext.fillStyle = color;
				// 		mContext.fill();
				// 		mContext.strokeStyle = color;
				// 		mContext.stroke();
				// 	}
				// }
			}
		}
		


		// mContext.globalAlpha = 1.0;
		// mContext.beginPath();
		// mContext.arc(mTopViewObj.centerX, mTopViewObj.centerZ/mTopViewDataObj.dimz*mTopViewWindowObj.height, 5, 0, 2 * Math.PI, false);
		// mContext.closePath();
		// mContext.fillStyle = gQualitativeColors[5];
		// mContext.fill();
		
	}

	function reqSubregionData(aIdx) {
		startTime("Topview_Subregion_Loading");
		console.log("Topview_Subregion_Loading");
		// gSocket.emit('req_TopviewWidget_subregion', aIdx);	
	}

	function eventHandlerThis(){
		document.getElementById(mCanvasID).onmousemove = handleCanvMouseMove;
		function handleCanvMouseMove(event){
			if(event.which == 1){
				if(mTopViewObj.centerZ+event.movementY < mTopViewDataObj.dimz && mTopViewObj.centerZ+event.movementY > 0){
					mTopViewObj.centerZ += event.movementY;
					draw();
				}
			}
		}			

	}
	return {
		setSocket : setSocket,
		setCanvas : setCanvas,
		setSubregionData : setSubregionData,
		setImageData : setImageData,
		reqSubregionData : reqSubregionData,
		draw : draw
	}

})();