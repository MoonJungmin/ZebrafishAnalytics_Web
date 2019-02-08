var SaveLoadModule = (function(){
	
	// var gSocket;

	function setSocket(){
		// gSocket = aSocket;
	}

	function PopSaveModal(){
		$("#save_modal").modal('show');		
	}

	function Save(){
		var aName = document.getElementById("save_name").value;
		gSocket.emit('req_Save',aName, gSelectionInventory);
	}

	function Load(){
		// console.log("load savefile", gSaveFileName);
		if(gSaveFileName != null){
			gSocket.emit('req_Load', gSaveFileName);
			
		}
		// GraphInterfaceModule.LoadFile(Data)
	}




	return {
		setSocket : setSocket,
		PopSaveModal : PopSaveModal,
		Save : Save,
		Load : Load
	}

})();
