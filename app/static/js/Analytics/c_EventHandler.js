$( document ).ready(function() {
	var EventModule = (function(){
		var CanvMouseIn = false;

		var mShiftDown = false;

		document.getElementById(gManualSelectionCanvID).onmousemove = handleCanvMouseMove;
		document.getElementById(gManualSelectionCanvID).onmouseout = handleCanvMouseOut;
		document.getElementById(gManualSelectionCanvID).onmousewheel = handleCanvWheel;
		document.onmouseup = handleCanvMouseUp;
		document.getElementById(gManualSelectionCanvID).onmousedown = handleCanvMouseDown;
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

		function handleCanvMouseOut(event){
			CanvMouseIn = false;
		}

		function handleCanvMouseMove(event){
			CanvMouseIn = true;
			if(gFocusedObject != null){
				if(gFocusedObject.node_type == "Operation" && gFocusedObject.node_operation_type == "Manual"){
					if(event.shiftKey){
						ManualSelectionModule.MouseMoveEvent(event);
						return;
					}
					if(event.ctrlKey){
						ManualSelectionModule.MouseMoveEvent(event);
						return;	
					}
				}				
			}


			if(event.which == 1){
	 			if ( gViewObj.centerX-event.movementX >= 0 && gViewObj.centerX-event.movementX < gDataInfoObj.dimx )
					gViewObj.centerX -= event.movementX*10;

	 			if ( gViewObj.centerY-event.movementY >= 0 && gViewObj.centerY-event.movementY < gDataInfoObj.dimy )
					gViewObj.centerY -= event.movementY*10;
				
				
				TileDataModule.update(false);				
			}
			if(CellLabelsViewer.getReqStatus()){
				CellLabelsViewer.start();	
			}
			SubregionViewer.start();
			
		}

 		function handleCanvWheel(event){
 			var delta;
 			if(event.wheelDelta > 0)
				delta = 1;
			else
				delta = -1;

 			var value = (100.0 * delta); 			
 			
			if(gFocusedObject != null){
	 			if(gFocusedObject.node_type == "Operation" && gFocusedObject.node_operation_type == "Manual"){
		 			if(event.shiftKey){
		 				if(delta > 0)
							ManualSelectionModule.BrushSizeUp();
						else
							ManualSelectionModule.BrushSizeDown();

						return;
		 			}
		 		}
		 	}
 			gViewObj.left += value/2;
 			gViewObj.right += value/2;
 			gViewObj.top += (value*gWindowObj.height/gWindowObj.width)/2;
 			gViewObj.bottom += (value*gWindowObj.height/gWindowObj.width)/2;
 			// gViewObj.zoomLevel += value/1000.0;
 			// printLog(gViewObj.zoomLevel);
			
			TileDataModule.update(true);
			// BackgroundEMViewer.clear();

			// var DrawTileArr = TileDataModule.getDrawTileArr()
			// for(var i=0;i<DrawTileArr.length;++i){
			// 	BackgroundEMViewer.draw(DrawTileArr[i])
			// }
			if(CellLabelsViewer.getReqStatus()){
				CellLabelsViewer.start();	
			}
			SubregionViewer.start();
 		}

 		function handleCanvMouseUp(event){
			// BackgroundEMViewer.clear();
			CellLabelsViewer.clear();
			SubregionViewer.clear();
			// TileDataModule.update(gViewObj, gDataInfoObj, gWindowObj, true);
			
			TileDataModule.update(true);

			CellLabelsViewer.start();
			// if(gSubregionViewerStatus == 1)
			SubregionViewer.start();


			// console.log(gSelectionInventory)
			// console.log(gSelectionInventory_EnableIndex)
			if(gFocusedObject != null){
	 			if(gFocusedObject.node_type == "Operation" && gFocusedObject.node_operation_type == "Manual"){
	 				ManualSelectionModule.ManualCardUpdate(gFocusedObject.selection_index);
					ManualSelectionModule.focused();
				}
				else{
					ManualSelectionModule.unfocused();	
				}
			}
		}

		function handleCanvMouseDown(event){
			// console.log(event.pageX, event.pageY);
			if(CellLabelsViewer.getReqStatus()){
				CellLabelsViewer.Tooltip(event.pageX, event.pageY)
			}

		}

 		function handleKeyDown(event){
 			if(event.code == "ArrowRight"){

 				gViewObj.centerZ += 1


				BackgroundEMViewer.clear();
				CellLabelsViewer.clear();
				SubregionViewer.clear(); 
				TileDataModule.update(true);
 				CellLabelsViewer.start();
 				SubregionViewer.start();
 			}
 			if(event.code == "ArrowLeft"){

 				gViewObj.centerZ -= 1

				BackgroundEMViewer.clear();
				CellLabelsViewer.clear();
				SubregionViewer.clear();
				TileDataModule.update(true);

 				CellLabelsViewer.start();	
				SubregionViewer.start();
 			}
			if(gFocusedObject != null){
	 			if(gFocusedObject.node_type == "Operation" && gFocusedObject.node_operation_type == "Manual"){
		 			if(event.keyCode == 16){
		 				ManualSelectionModule.ShiftKeyDown();
					}
					if(event.keyCode == 17){
		 				ManualSelectionModule.CtrlKeyDown();
					}
	 			}
	 		}
 			if(event.keyCode == 13){
 				var tmpdata = new Array();
 				for(var i=0;i<gSelectionInventory[gSelectionInventory.length-1].array.length;++i){
 					if(gSelectionInventory[gSelectionInventory.length-1].array[i] == 1)
						tmpdata.push(i);
 				}
 				// console.log("Label list : ");
 				// console.log(tmpdata);
 				// console.log(gViewObj);

 			}

 		}
 		function handleKeyUp(event){
 			if(gFocusedObject != null){
	 			if(gFocusedObject.node_type == "Operation" && gFocusedObject.node_operation_type == "Manual"){
		 			if(event.keyCode == 16){
		 				ManualSelectionModule.ShiftKeyUp();
		 			}
					if(event.keyCode == 17){
		 				ManualSelectionModule.CtrlKeyUp();
					}
				}
 			}
 		}



	})();
});