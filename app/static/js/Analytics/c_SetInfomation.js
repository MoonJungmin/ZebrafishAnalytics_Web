var SetInfomationModule = (function(){
	
	function SetInfomationCardUpdate(aIdx, aParentsId) {
		clearSetInfomation_DOM()
		document.getElementById("set_infomation_area").style.display = "block";


		// SelectionItemModule.drawNametag("subregion_selection_name", gSelectionInventory[aIdx].name, gSelectionInventory[aIdx].color, 3, "dot", -1);
		var name = document.getElementById("set_infomation_name");
		var text = document.createElement("p");
		text.innerHTML = gSelectionInventory[aIdx].name;
		name.appendChild(text);

		var parentname = document.getElementById("set_infomation_parents_operation");
		var text = document.createElement("p");
		if(gFocusedObject.node_type == "Default")
			text.innerHTML = "None";
		else
			text.innerHTML = gSelectionInventory[aIdx].type;

		parentname.appendChild(text);

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


		var cellinfo = document.getElementById("set_infomation_cellsinfo");
		var text = document.createElement("p");
		text.innerHTML = count + " / " + size;
		cellinfo.appendChild(text);
		var color = document.getElementById("set_infomation_color");
		var coloricon = document.createElement("span");
		coloricon.setAttribute("class", "glyphicon glyphicon-one-fine-dot");
		coloricon.setAttribute("style", "color:" + hex2rgba_convert(gSelectionInventory[aIdx].color, 100) +"; top:-5px;");
		color.appendChild(coloricon);

		updateMorphologicalFeature();				
	}


	function clearSetInfomation_DOM(){
		var feature_item = document.getElementById("set_infomation_name");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
		var feature_item = document.getElementById("set_infomation_parents_operation");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
		var feature_item = document.getElementById("set_infomation_cellsinfo");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
		var feature_item = document.getElementById("set_infomation_color");
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
	}

	function updateMorphologicalFeature(){
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			MorphologicalFeatureModule.drawHistogram(gMorphologicalFeature.feature[i].index);
			// console.log("test", gMorphologicalFeature.feature[i].index);
		}
	}


	return {
		SetInfomationCardUpdate : SetInfomationCardUpdate,
		updateMorphologicalFeature : updateMorphologicalFeature
	}

})();
