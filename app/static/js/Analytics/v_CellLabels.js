var CellLabelsViewer = (function(){
	var mCanvasID;	
	// var gSocket;
	var mContext;
	var mCanvas;
	var mReqStatus = true;
	var mPrevZoomLevel = 0;

	function setCanvas(aCanvID){
		mCanvasID = aCanvID;
		mCanvas=document.getElementById(mCanvasID);
		mContext = mCanvas.getContext("2d");
	}
	function setSocket(){
		// gSocket = aSocket;
	}

	function start(){
		// console.log(gCellLabelsContour);
		var Idx = checkCellLabelArr();
		if (Idx != -1){
			drawLabels(Idx);
		}
		else{
			if(mReqStatus){
				ReqCellLabelArr();
				mReqStatus = false;
			}
		}	
	}

	function checkCellLabelArr(){
		for(var i=0; i<gCellLabelsContour.length;++i){
			if(gCellLabelsContour[i].index == gViewObj.centerZ && gCellLabelsContour[i].level == gViewObj.zoomLevel){
				return i;
			}
		}
		return -1;
	}

	function drawLabels(Idx){
		mReqStatus = true;
		clear();
		var leftTopPosX = gViewObj.centerX - gViewObj.left;
		var leftTopPosY = gViewObj.centerY - gViewObj.top;
		var rightBottomPosX = gViewObj.centerX + gViewObj.right;
		var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;
		var labelArray = gCellLabelsContour[Idx].labelArray;
		var level = gCellLabelsContour[Idx].level;
		var Scale = gWindowObj.width / (gViewObj.left + gViewObj.right);
		
		// mContext.globalAlpha = 0.5;
		// console.log(level);

		var resolution = Math.pow(2, level);

		mContext.globalAlpha = 0.5;
		for(var k=0;k<gRenderingArray.length;++k){
			for(var i=0;i<labelArray.length;++i){
				var color = "#CCC";
				var label = parseInt(labelArray[i].id);
				// console.log(label);
				if(gSelectionInventory[parseInt(gRenderingArray[k])].array[label] == 1){
					var flag = true;
					for(var h=k+1;h<gRenderingArray.length;++h){
						if(gSelectionInventory[parseInt(gRenderingArray[h])].array[label] == 1){
							flag = false;
						}
					}
					if(flag){
						color = hex2rgba_convert(gSelectionInventory[gRenderingArray[k]].color, 100);
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
				
				

			}
			
		}
	}

	function ManualSelection(cx, cy, radius, aBool){
		var leftTopPosX = gViewObj.centerX - gViewObj.left;
		var leftTopPosY = gViewObj.centerY - gViewObj.top;
		var rightBottomPosX = gViewObj.centerX + gViewObj.right;
		var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;
		var Idx = checkCellLabelArr();
		var labelArray = gCellLabelsContour[Idx].labelArray;
		var Scale = gWindowObj.width / (gViewObj.left + gViewObj.right);
		
		// console.log(cx/Scale+leftTopPosX, cy/Scale+leftTopPosY);
		for(var i=0;i<labelArray.length;++i){
			var contour = labelArray[i].contour;
			var sum_x = 0;
			var sum_y = 0;
			for(var j=0;j<contour.length;j+=2){
				sum_x += (contour[j] - leftTopPosX) * Scale; 
				sum_y += (contour[j+1] - leftTopPosY) * Scale;
			}
			sum_x = sum_x/(contour.length/2);
			sum_y = sum_y/(contour.length/2);

			// console.log(sum_x, sum_y, cx, cy);

			var d_x = sum_x - cx;
			var d_y = sum_y - cy;
			var distance = Math.sqrt( d_x*d_x + d_y*d_y );
			// console.log(distance);
			var aIndex = gFocusedObject.selection_index;
			
			if(distance < radius){
				// console.log("Hit");
				var label = parseInt(labelArray[i].id);
				if(gSelectionInventory[aIndex].array[label] != -1){
					if(aBool)
						gSelectionInventory[aIndex].array[label] = 1;
					else
						gSelectionInventory[aIndex].array[label] = 0;
				}
			}	
		}
		NavigationModule.setCellLabelHistColor(gFocusedObject.selection_index);
		NavigationModule.redraw();

	}

	function Tooltip(cx, cy){
		var leftTopPosX = gViewObj.centerX - gViewObj.left;
		var leftTopPosY = gViewObj.centerY - gViewObj.top;
		var rightBottomPosX = gViewObj.centerX + gViewObj.right;
		var rightBottomPosY = gViewObj.centerY + gViewObj.bottom;
		var Idx = checkCellLabelArr();
		var labelArray = gCellLabelsContour[Idx].labelArray;
		var Scale = gWindowObj.width / (gViewObj.left + gViewObj.right);

		for(var i=0;i<labelArray.length;++i){
			var contour = labelArray[i].contour;
			
			var boundBox = new Object();
			
			for(var j=0;j<contour.length;j+=2){
				if(j == 0){
					boundBox.x_min = (contour[j] - leftTopPosX) * Scale; 
					boundBox.x_max = (contour[j] - leftTopPosX) * Scale; 
					boundBox.y_min = (contour[j+1] - leftTopPosY) * Scale;
					boundBox.y_max = (contour[j+1] - leftTopPosY) * Scale;
				}
				else{
					var mx = (contour[j] - leftTopPosX) * Scale; 
					var my = (contour[j+1] - leftTopPosY) * Scale;
					if(boundBox.x_min > mx)
						boundBox.x_min = mx;
					else if(boundBox.x_max < mx)
						boundBox.x_max = mx;

					if(boundBox.y_min > my)
						boundBox.y_min = my;
					else if(boundBox.y_max < my)
						boundBox.y_max = my;

				}
			}
			
			if(boundBox.x_min < cx && boundBox.x_max > cx && boundBox.y_min < cy && boundBox.y_max > cy){
				// console.log("Hit: " + labelArray[i].label);
				document.getElementById("cell_infomation_tooltip").setAttribute("class", "cellinfo_tooltip_enable");
				// makeTooltip();
				document.getElementById("cell_infomation_tooltip").setAttribute("style", "left : "+ cx + "px; top:" + cy +"px;");
			
				mContext.beginPath();
				for(var j=0;j<contour.length;j+=2){
					var x = (contour[j] - leftTopPosX) * Scale; 
					var y = (contour[j+1] - leftTopPosY) * Scale;
					mContext.lineTo(x, y);
				}
				mContext.closePath();
				mContext.lineWidth = 2;
				
				
				mContext.strokeStyle = 'red';
				mContext.stroke();

				var cell_label = labelArray[i].id;
				document.getElementById("cell_infomation_contents_label").innerHTML = cell_label;	
				document.getElementById("cell_infomation_contents_location").innerHTML = gCellLabelsRange[cell_label].minZ + " ~ " + gCellLabelsRange[cell_label].maxZ

				if(gMorphologicalFeature.feature.length > 0){
						// <div style="display: inline-flex; margin-bottom: 10px; padding-left: 20px">
						// 	<b>&bull; Selected cells infomation : </b><div style="padding-left: 10px;word-break: break-all;"></div>
						// </div>

					document.getElementById("cell_infomation_contents_feature").innerHTML = "";
					
					for(var k=0;k<gMorphologicalFeature.feature.length;++k){
						var feature_div = document.createElement("div");
						feature_div.setAttribute("style", "display: inline-flex; margin-bottom: 10px; padding-left: 20px");
						
						var feature_title = document.createElement("b");
						feature_title.innerHTML = "&bull; " + gMorphologicalFeature.feature[k].name + " : ";
						feature_div.appendChild(feature_title);

						var feature_value = document.createElement("div");
						feature_value.setAttribute("style", "padding-left: 10px;word-break: break-all;");
						feature_value.innerHTML = gMorphologicalFeature.feature[k].data[cell_label].toFixed(4);
						feature_div.appendChild(feature_value);

						document.getElementById("cell_infomation_contents_feature").appendChild(feature_div);						
					}


					// console.log("It has feature")

				}

				return 0;
			}	
		}

		document.getElementById("cell_infomation_tooltip").setAttribute("class", "cellinfo_tooltip_disable");
	}

	function makeTooltip(){

		var div_area = document.getElementById("cell_infomation_tooltip");
		div_area.setAttribute("class", "cellinfo_tooltip_enable");

		var div_panel = document.createElement("div");
		div_panel.setAttribute("class", "panel panel-default");

		var div_panel_head = document.createElement("div");
		div_panel_head.setAttribute("class", "panel-heading");
		div_panel_head.innerHTML = "<b>Cell Infomation</b>"
		div_panel.appendChild(div_panel_head);

		var div_panel_body = document.createElement("div");
		div_panel_body.innerHTML = "Test";
		div_panel.appendChild(div_panel_body);

		div_area.appendChild(div_panel);
		
	}


	function clear(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
	}

	function ReqCellLabelArr(){
		startTime("Cell_Label_Loading");
		// if(gEMSliceIndex){
		console.log("cell loading : " + gViewObj.centerZ)
		// // var call_index = gEMSliceIndex[gViewObj.centerZ];

		// // // gViewObj.zoomLevel = 0;
		// // if(gViewObj.left + gViewObj.right < 1024*Math.pow(2, gViewObj.zoomLevel)){

		// // 	if(gViewObj.zoomLevel - 1 >= 0){
		// // 		gViewObj.zoomLevel --;
		// // 		mPrevZoomLevel = -1;						
		// // 	}
		// // }
		// // else if(gViewObj.left + gViewObj.right > 2*1024*Math.pow(2, gViewObj.zoomLevel)){
		// // 	if(gViewObj.zoomLevel + 1 <= 4){

		// // 		gViewObj.zoomLevel ++;
		// // 		mPrevZoomLevel = 1;				
		// // 	}
		// // }
		// // else{		
		// // 	mPrevZoomLevel = 0;
		// // }
		// console.log("zoomlevel : " + gViewObj.zoomLevel)
		// console.log("zoomlevel : " + mPrevZoomLevel)


		gSocket.emit('req_CellLabelsContour', 1, gViewObj.centerZ, gViewObj.zoomLevel);
		// }
		// else{
			// gSocket.emit('req_CellLabelsContour_DB', 2013);	
		// }
	}

	function getReqStatus(){
		return mReqStatus;
	}

	return {
		setCanvas : setCanvas,
		setSocket : setSocket,
		clear : clear,
		start : start,
		drawLabels : drawLabels,
		ManualSelection : ManualSelection,
		Tooltip : Tooltip,
		getReqStatus : getReqStatus,
		mReqStatus : mReqStatus
	}

})();