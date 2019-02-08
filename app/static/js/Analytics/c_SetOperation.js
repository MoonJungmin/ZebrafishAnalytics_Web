var SetOperationModule = (function(){
	
	function SetOperationCardUpdate(aIdx) {
		clearSetOperation_DOM()
		document.getElementById("setoperation_area").style.display = "block";

		// SelectionItemModule.drawNametag("subregion_selection_name", gSelectionInventory[aIdx].name, gSelectionInventory[aIdx].color, 3, "dot", -1);
		var name = document.getElementById("setoperation_selection_name");
		var text = document.createElement("p");
		text.innerHTML = gSelectionInventory[aIdx].name;
		name.appendChild(text);

		var operationname = document.getElementById("setoperation_operation_name");
		var text2 = document.createElement("p");
		text2.innerHTML = gSelectionInventory[aIdx].operation_name;
		operationname.appendChild(text2);

		var operatnd1 = document.getElementById("setoperation_operand1_name");
		var text3 = document.createElement("p");
		text3.innerHTML = gSelectionInventory[gSelectionInventory[aIdx].parents_id[0]].name;
		operatnd1.appendChild(text3);

		var operatnd2 = document.getElementById("setoperation_operand2_name");
		var text4 = document.createElement("p");
		text4.innerHTML = gSelectionInventory[gSelectionInventory[aIdx].parents_id[1]].name;
		operatnd2.appendChild(text4);

		var color = document.getElementById("setoperation_color");
		var coloricon = document.createElement("span");
		coloricon.setAttribute("class", "glyphicon glyphicon-one-fine-dot");
		coloricon.setAttribute("style", "color:" + hex2rgba_convert(gSelectionInventory[aIdx].color, 100) +"; top:-5px;");
		color.appendChild(coloricon);

	}


	function clearSetOperation_DOM(){
		document.getElementById("setoperation_selection_name").innerHTML = "";
		document.getElementById("setoperation_operation_name").innerHTML = "";
		document.getElementById("setoperation_operand1_name").innerHTML = "";
		document.getElementById("setoperation_operand2_name").innerHTML = "";
		document.getElementById("setoperation_color").innerHTML = "";
	}


	function updateSetOperand(aNodeList){
		document.getElementById("operate_set_operand1_list").innerHTML = "";
		for(var i=0;i<aNodeList.length;++i){
			var list=document.createElement("li");
			list.innerHTML = "<a onclick=SetOperationModule.selectSetOperand('1','" +aNodeList[i].data.node_name+"','"+aNodeList[i].data.selection_index+"')>"+ aNodeList[i].data.node_name +"</a>"
			document.getElementById("operate_set_operand1_list").appendChild(list);
		}
		document.getElementById("operate_set_operand2_list").innerHTML = "";
		for(var i=0;i<aNodeList.length;++i){
			var list=document.createElement("li");
			list.innerHTML = "<a onclick=SetOperationModule.selectSetOperand('2','" +aNodeList[i].data.node_name+"','"+aNodeList[i].data.selection_index+"')>"+ aNodeList[i].data.node_name +"</a>"
			document.getElementById("operate_set_operand2_list").appendChild(list);
		}
		document.getElementById("operate_set_operation_list").innerHTML = "";
		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=SetOperationModule.selectSetOperation('Union')>Union</a>"
		document.getElementById("operate_set_operation_list").appendChild(list1);

		var list2=document.createElement("li");
		list2.innerHTML = "<a onclick=SetOperationModule.selectSetOperation('Intersection')>Intersection</a>"
		document.getElementById("operate_set_operation_list").appendChild(list2);

		var list3=document.createElement("li");
		list3.innerHTML = "<a onclick=SetOperationModule.selectSetOperation('Subtraction')>Subtraction</a>"
		document.getElementById("operate_set_operation_list").appendChild(list3);


	}
	function selectSetOperand(aOperandIdx, aName, aIndex){
		if(aOperandIdx == 1){
			document.getElementById("operate_set_operand1_name").value = aName;
			document.getElementById("operate_set_operand1_index").value = aIndex;
		}
		else if(aOperandIdx == 2){
			document.getElementById("operate_set_operand2_name").value = aName;
			document.getElementById("operate_set_operand2_index").value = aIndex;
		}
	}

	function selectSetOperation(aName){
		document.getElementById("operate_set_operation_name").value = aName;
	}

	function Union(arr1, arr2){
		var result = new Array(arr1.length);
		for(var i=0;i<arr1.length;++i){
			if(arr1[i] >= 0 || arr2[i] >=0)
				result[i] = 0;
			else
				result[i] = -1;

			if(arr1[i] == 1 || arr2[i] == 1)
				result[i] = 1;

		}
		return result;
	}
	function Subtraction(arr1, arr2){
		var result = new Array(arr1.length);
		for(var i=0;i<arr1.length;++i){
			if(arr1[i] >= 0)
				result[i] = 0;
			else
				result[i] = -1;

			if(arr1[i] == 1 && arr2[i] == 0)
				result[i] = 1;
		}
		return result;	
	}
	function Intersection(arr1, arr2){
		var result = new Array(arr1.length);
		for(var i=0;i<arr1.length;++i){
			if(arr1[i] >= 0 || arr2[i] >=0)
				result[i] = 0;
			else
				result[i] = -1;

			if(arr1[i] == 1 && arr2[i] == 1)
				result[i] = 1;
		}
		return result;	
	}


	return {
		SetOperationCardUpdate : SetOperationCardUpdate,
		updateSetOperand : updateSetOperand,
		selectSetOperand : selectSetOperand,
		selectSetOperation : selectSetOperation,
		Union : Union,
		Subtraction : Subtraction,
		Intersection : Intersection
	}

})();
