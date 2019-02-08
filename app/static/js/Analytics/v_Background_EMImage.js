var BackgroundEMViewer = (function(){
	var mCanvasID;	
	var mContext;
	var mCanvas;

	function draw(mImage){
		mContext.drawImage(mImage.data, 0,0, mImage.data.width, mImage.data.height, mImage.posX, mImage.posY , mImage.width, mImage.height);
		// mContext.strokeStyle = 'red';  // some color/style
		// mContext.lineWidth = 2;         // thickness
		// mContext.strokeRect(mImage.posX, mImage.posY , mImage.width, mImage.height);
		// mContext.rect(mImage.posX, mImage.posY , mImage.width, mImage.height);
	}

	function clear(){
		mContext.clearRect(0, 0, mCanvas.width, mCanvas.height);
	}

	function setCanvas(aCanvID){
		mCanvasID = aCanvID;
		mCanvas=document.getElementById(aCanvID);
		mContext = mCanvas.getContext("2d");
	}
	
	return {
		draw : draw,
		clear : clear,
		setCanvas : setCanvas
	}

})();