var SubregionSelectionModule = (function(){
	// var gSocket;

	function setSocket(){
		// gSocket = ;
		startTime("Subregion_Info_Loading");
		gSocket.emit('req_SubregionInfo');
	}

	function reqSubregionSelection(aIdx, aSelectionIdx){
		startTime("Subregion_Selection_Loading");
		// gSocket.emit('req_SubregionSelection', aIdx, aSelectionIdx);		
	}

	function subregionSelectionCardUpdate(aIdx) {
		clearSubregionSelection_DOM()
		document.getElementById("subregion_selection_area").style.display = "block";

		// SelectionItemModule.drawNametag("subregion_selection_name", gSelectionInventory[aIdx].name, gSelectionInventory[aIdx].color, 3, "dot", -1);
		var name = document.getElementById("subregion_selection_name");
		var text = document.createElement("p");
		text.innerHTML = gSelectionInventory[aIdx].name;
		name.appendChild(text);

		var subregion_name = document.getElementById("subregion_selection_subregionname");
		var text = document.createElement("p");
		text.innerHTML = gSubregionInfoData[gSelectionInventory[aIdx].subregion_index].Name;
		subregion_name.appendChild(text);

		var subregion_color = document.getElementById("subregion_selection_color");
		var coloricon = document.createElement("span");
		coloricon.setAttribute("class", "glyphicon glyphicon-one-fine-dot");
		coloricon.setAttribute("style", "color:" + hex2rgba_convert(gSelectionInventory[aIdx].color, 100) +"; top:-5px;");

		subregion_color.appendChild(coloricon);				
	}


	function clearSubregionSelection_DOM(){
		var feature_item = document.getElementById("subregion_selection_name");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
		var feature_item = document.getElementById("subregion_selection_subregionname");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
		var feature_item = document.getElementById("subregion_selection_color");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
	}

	function selectSubregion(aIdx){
		document.getElementById("operate_subregion_name").value = gSubregionInfoData[aIdx].Name;
		document.getElementById("operate_subregion_index").value = aIdx;
	}


	function setSubregionInfoData(data){
		gSubregionInfoData = JSON.parse(data);	
		for(var i=0;i<gSubregionInfoData.length;++i){
			gSubregionInfoData[i].minZ = parseInt(gSubregionInfoData[i].minZ);
			gSubregionInfoData[i].maxZ = parseInt(gSubregionInfoData[i].maxZ);
			gSubregionInfoData[i].Volume = parseInt(gSubregionInfoData[i].Volume);
			gSubregionInfoData[i].Version = parseInt(gSubregionInfoData[i].Version);

			var list=document.createElement("li");
			list.innerHTML = "<a onclick='SubregionSelectionModule.selectSubregion("+ i +")'>"+ gSubregionInfoData[i].Name + "</a>"
			document.getElementById("operate_subregion_list").appendChild(list);
		}
	}

	return {
		setSocket : setSocket,
		setSubregionInfoData : setSubregionInfoData,
		selectSubregion : selectSubregion,
		subregionSelectionCardUpdate : subregionSelectionCardUpdate,
		reqSubregionSelection : reqSubregionSelection
		
	}

})();