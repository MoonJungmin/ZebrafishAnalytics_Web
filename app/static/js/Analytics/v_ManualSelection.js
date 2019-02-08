var ManualSelectionModule = (function(){
	var mCanvasID;	
	var mContext;
	var mCanvas;

	var mBrushSize = 20;
	var mShiftPressed = false;
	var mCtrlPressed = false;

	function setCanvas(aCanvID){
		mCanvasID = aCanvID;
		mCanvas=document.getElementById(mCanvasID);
		mContext = mCanvas.getContext("2d");
	}
	function focused(){
		// mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
		mContext.globalAlpha = 1.0;
		mContext.shadowBlur=0;

		
		mContext.beginPath();
		mContext.rect(0,0,mCanvas.width,mCanvas.height);
		mContext.closePath();
		mContext.strokeStyle = "red";
		mContext.lineWidth = 4;
		mContext.stroke();
		// mContext.fillStyle = gSequentialColors[1];
		// mContext.fill();
		// for(var i=0;i<parseInt(mCanvas.height);++i){
		// 	mContext.globalAlpha = 1.0;
		// 	mContext.beginPath();
		// 	mContext.rect(0, gCellLabelsHistogram.step*i,20, gCellLabelsHistogram.step);	
		// 	mContext.closePath();
		// 	var color = interpolateRGB(gSequentialColors[1], gQualitativeColors[1], 
		// 			(gCellLabelsHistogram.array[i].value-gCellLabelsHistogram.min)
		// 			/(gCellLabelsHistogram.max-gCellLabelsHistogram.min)*10, 10);

		// 	mContext.fillStyle = color.toString();
		// 	mContext.fill();
		// }
	}
	function unfocused(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
	}

	function ShiftKeyDown(){
		if(!mShiftPressed){
			drawCircle();
			setCursorByID(mCanvasID, "crosshair");
			mShiftPressed = true;
		}
	}
	function ShiftKeyUp(){
		setCursorByID(mCanvasID, "default");
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
		mShiftPressed = false;
	}
	function CtrlKeyDown(){
		drawCircle();
		setCursorByID(mCanvasID, "crosshair");
		mCtrlPressed = true;
	}
	function CtrlKeyUp(){
		setCursorByID(mCanvasID, "default");
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
		mCtrlPressed = false;
	}

	function setCursorByID(id,cursorStyle) {
		var elem;
		if (document.getElementById && (elem=document.getElementById(id)) ) {
			if (elem.style) 
				elem.style.cursor=cursorStyle;
		}
	}

	function BrushSizeUp(){
		mBrushSize += 1;
		if(mBrushSize > 100){
			mBrushSize = 100;
		}
		drawCircle();
	}

	function BrushSizeDown(){
		mBrushSize -= 1;
		if(mBrushSize < 1){
			mBrushSize = 1;
		}
		drawCircle();
	}

	function drawCircle(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
		mContext.beginPath();
		mContext.arc(event.pageX, event.pageY, mBrushSize, 0, 2 * Math.PI, false);
		mContext.lineWidth = 1;
		mContext.strokeStyle = '#000000';
		mContext.stroke();
		// console.log("drawCircle");
		focused();
	}
	function drawLine(){
		// mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
		mContext.beginPath();
		mContext.arc(event.pageX, event.pageY, 0.5, 0, 2 * Math.PI, false);
		mContext.lineWidth = 1;
		mContext.strokeStyle = 'red';
		mContext.stroke();
	}

	function MouseMoveEvent(event){
		drawCircle();
		if(event.which == 1){
			if(mShiftPressed){
				// drawLine();
				CellLabelsViewer.ManualSelection(event.pageX, event.pageY, mBrushSize, true);
			}

			if(mCtrlPressed){
				CellLabelsViewer.ManualSelection(event.pageX, event.pageY, mBrushSize, false);	
			}

			CellLabelsViewer.start();	
		}
	}

	function ManualCardUpdate(aIdx) {
		clearManual_DOM()
		document.getElementById("manual_selection_area").style.display = "block";

		// SelectionItemModule.drawNametag("subregion_selection_name", gSelectionInventory[aIdx].name, gSelectionInventory[aIdx].color, 3, "dot", -1);
		var name = document.getElementById("manual_selection_name");
		var text = document.createElement("p");
		text.innerHTML = gSelectionInventory[aIdx].name;
		name.appendChild(text);

		var count=0;
		var size=0;
		for(var i=0;i<gSelectionInventory[aIdx].array.length;++i){
			if(gSelectionInventory[aIdx].array[i] == 1){
				count += 1;
			}
			if(gSelectionInventory[aIdx].array[i] != -1){
				size += 1;
			}
		}


		var countinfo = document.getElementById("manual_selection_count");
		var text = document.createElement("p");
		text.innerHTML = count + " / " + size;
		countinfo.appendChild(text);

		var color = document.getElementById("manual_selection_color");
		var coloricon = document.createElement("span");
		coloricon.setAttribute("class", "glyphicon glyphicon-one-fine-dot");
		coloricon.setAttribute("style", "color:" + hex2rgba_convert(gSelectionInventory[aIdx].color, 100) +"; top:-5px;");
		color.appendChild(coloricon);
	}


	function clearManual_DOM(){
		document.getElementById("manual_selection_name").innerHTML = "";
		
		document.getElementById("manual_selection_count").innerHTML = "";
		
		document.getElementById("manual_selection_color").innerHTML = "";
		
	}




	return {
		setCanvas : setCanvas,
		MouseMoveEvent : MouseMoveEvent,
		ShiftKeyDown : ShiftKeyDown,
		ShiftKeyUp : ShiftKeyUp,
		CtrlKeyDown : CtrlKeyDown,
		CtrlKeyUp : CtrlKeyUp,

		BrushSizeUp : BrushSizeUp,
		BrushSizeDown : BrushSizeDown,

		focused : focused,
		unfocused : unfocused,

		ManualCardUpdate : ManualCardUpdate,
		clearManual_DOM : clearManual_DOM
	}

})();