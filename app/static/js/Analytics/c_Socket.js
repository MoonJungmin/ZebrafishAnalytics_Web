$( document ).ready(function() {
   printLog("socket ready")
   var __bool = true;
	// namespace = '/visualanlaytics';
	// var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
	gSocket.on('connect', function() {
		console.log("connected!");
		if(__bool){
			CellLabelsViewer.start();
			SaveLoadModule.Load();
			MorphologicalFeatureModule.setSocket();
			TileDataModule.setSocket();
			CellLabelsViewer.setSocket();
			NavigationModule.setSocket();
			SubregionViewer.setSocket();
			TopviewNavigation.setSocket();
			SubregionSelectionModule.setSocket();
			SaveLoadModule.setSocket();
			__bool = false;
		}
	});

	// SubregionViewer.start();

	gSocket.on('res_BackgroundEMImage', function(msg) {
		endTime("EM_Tile_Loading");
		// printLog(tile)
		
		// printLog(tile)
		var mTile = JSON.parse(msg.tileObj)
		for(var i=0;i<msg.data.length;++i){
			setImage(mTile[i], msg.data[i]);
		}

		function setImage(tile, data){
			var mImage;
			mImage = new Image();
			mImage.src = 'data:image/jpeg;base64, ' + data;
			mImage.onload = function() {
				// printLog(mTile)
				tile.data = mImage;
				BackgroundEMViewer.draw(tile);
				TileDataModule.addTileObj(tile);
			};	
		}
	});

	gSocket.on('res_CellLabelsContour', function(msg) {
		endTime("Cell_Label_Loading");
		console.log("res_CellLabelsContour");

		// console.log(msg.data)
		var cellLabelObj = new Object();
		cellLabelObj.index = parseInt(JSON.parse(msg.index));
		cellLabelObj.level = parseInt(JSON.parse(msg.level));
		cellLabelObj.labelArray = JSON.parse(msg.data)['data'];

		// var LabelArr = new Array();
	
		// var data = JSON.parse(msg.data);
		// console.log(data);
		// for(var i=0;i<data.length;++i){
		// 	if(data[i].label != 0){
		// 		var LabelObj = new Object();
		// 		LabelObj.label = data[i].label;

		// 		var contourArr = new Array();
		// 		for(var j=0;j<data[i].points.length;j+=2){
		// 			contourArr.push((data[i].points[j][0]+200)*4);
		// 			contourArr.push(data[i].points[j][1]*4);
		// 		}

		// 		LabelObj.contour = contourArr;
		// 		LabelArr.push(LabelObj);	
		// 	}
		// }
		
	// # for row in rows:
	// # 	index = 0
	// # 	for d in data:
	// # 		if d['label'] == row['id_cell'] and d['status'] == row['tag_cell']:
	// # 			break
	// # 		index+=1
	// # 	if len(data) == index:
	// # 		points = []
	// # 		points.append((row['vx_cell'], row['vy_cell']))
	// # 		item = {
	// # 			'label': row['id_cell'],
	// # 			'status' : row['tag_cell'],
	// # 			'points' : points
	// # 		}
	// # 		data.append(item)	
	// # 	else:
	// # 		data[index]['points'].append((row['vx_cell'], row['vy_cell']))


		// for(var i=0;i<data.length;++i){
		// 	var index = 0;
		// 	for(var j=0;j<LabelArr.length;++j){
		// 		if(LabelArr[j].label == data[i][0] && LabelArr[j].tag == data[i][4]){
		// 			break;
		// 		}
		// 		index++;
		// 	}
		// 	// console.log(index);
		// 	if(LabelArr.length == index){
		// 		var LabelObj = new Object();
		// 		var contourArr = new Array();
		// 		LabelObj.label = data[i][0];
		// 		// for(var j=0;j<data[i].points.length;j+=2){
		// 		contourArr.push((data[i][1]));
		// 		contourArr.push(data[i][2]);
		// 		// }				
		// 		LabelObj.contour = contourArr;
		// 		LabelObj.tag = data[i][4];
		// 		LabelArr.push(LabelObj);	
		// 	}
		// 	else{
		// 		LabelArr[index].contour.push(data[i][1]);
		// 		LabelArr[index].contour.push(data[i][2]);
		// 	}
		// 	// if(data[i].label != 0){


		// 	// }
		// }
		// // console.log(LabelArr);


		// cellLabelObj.labelArray = LabelArr;


 		gCellLabelsContour.push(cellLabelObj);

		CellLabelsViewer.drawLabels(gCellLabelsContour.length-1);
		CellLabelsViewer.mReqStatus = true;
	});

	gSocket.on('res_SubregionContour', function(msg) {
		endTime("Subregion_Loading");
		
		var subregionObj = new Object();
		subregionObj.index = parseInt(JSON.parse(msg.index));
		subregionObj.subregionIndex = parseInt(JSON.parse(msg.subregionIndex));
		subregionObj.level = parseInt(JSON.parse(msg.level));

		var aIndex = -1;
		for(var i=0;i<gSelectionInventory.length;++i){
			if(gSelectionInventory[i].type == "Subregion"){
				if(gSelectionInventory[i].subregion_index == subregionObj.subregionIndex){
					aIndex = i;
					break;
				}
			}
		}

		console.log(parseInt(JSON.parse(msg.arraylength)))
		if(parseInt(JSON.parse(msg.arraylength)) > 0){
			console.log("slice!")
			subregionObj.Array = JSON.parse(msg.subregion)['data'];		
 			gSelectionInventory[aIndex].contour_array.push(subregionObj);
			SubregionViewer.drawSubregion(aIndex, gSelectionInventory[aIndex].contour_array.length-1);
		}
		else{
			console.log("empty slice")
			subregionObj.Array = new Array();
			gSelectionInventory[aIndex].contour_array.push(subregionObj);
		}


		
		// console.log(gSubregionInfoData[subregionObj.subregionIndex].Version);
		// var subArr = new Array();
		// if(msg.subregion != "empty"){
		// 	var subregion = JSON.parse(msg.subregion);
		// 	console.log(subregion);
			
		// 	for(var i=0;i<subregion.length;++i){
		// 		var index = 0;
		// 		for(var j=0;j<subArr.length;++j){
		// 			if(subArr[j].label == subregion[i].status_subregion){
		// 				break;
		// 			}
		// 			index ++;
		// 		}
		// 		if(subArr.length == index){
		// 			var Obj = new Object();
		// 			var contourArr = new Array();
		// 			// if(gSubregionInfoData[subregionObj.subregionIndex].Version == 1){
		// 			// 	contourArr.push((subregion[i].vx_subregion)*4*1.1111111111111112);
		// 			// 	contourArr.push((subregion[i].vy_subregion)*4*0.9);
		// 			// }
		// 			// else{
		// 				contourArr.push((subregion[i].vx_subregion)*4);
		// 				contourArr.push((subregion[i].vy_subregion)*4);	
		// 			// }
		// 			Obj.contour = contourArr;
		// 			Obj.label = subregion[i].status_subregion;
		// 			subArr.push(Obj);
		// 		}
		// 		else{
		// 			// if(gSubregionInfoData[subregionObj.subregionIndex].Version == 1){
		// 			// 	subArr[index].contour.push((subregion[i].vx_subregion)*4*1.1111111111111112);
		// 			// 	subArr[index].contour.push((subregion[i].vy_subregion)*4*0.9);
		// 			// }
		// 			// else{
		// 				subArr[index].contour.push((subregion[i].vx_subregion)*4);
		// 				subArr[index].contour.push((subregion[i].vy_subregion)*4);	
		// 			// }
		// 		}
		// 	}

		// 	// for row in rows:
		// 	// 	index = 0
		// 	// 	for d in data:
		// 	// 		if d['label'] == row['status_subregion']:
		// 	// 			break
		// 	// 		index+=1
		// 	// 	if len(data) == index:
		// 	// 		points = []
		// 	// 		points.append((row['vx_subregion'], row['vy_subregion']))
		// 	// 		item = {
		// 	// 			'points' : points,
		// 	// 			'label' : row['status_subregion']
		// 	// 		}
		// 	// 		data.append(item)	
		// 	// 	else:
		// 	// 		data[index]['points'].append((row['vx_subregion'], row['vy_subregion']))

			
		// 	// print ("subregion return" + str(len(data)));





		// 	// for(var i=0;i<subregion.length;++i){	
		// 	// 	var Obj = new Object();
				
		// 	// 	var contourArr = new Array();
		// 	// 	for(var j=0;j<subregion[i].points.length;j+=2){
		// 	// 		contourArr.push((subregion[i].points[j][0])*4*1.1111111111111112);
		// 	// 		contourArr.push((subregion[i].points[j][1])*4*0.9);
		// 	// 	}

		// 	// 	Obj.contour = contourArr;
		// 	// 	subArr.push(Obj);	
		// 	// }			
		// }

		// subregionObj.Array = subArr;

		// // console.log(subregionObj);


	});

	gSocket.on('res_FeatureName', function(msg) {
		// endTime("FeatureName_Loading");
		MorphologicalFeatureModule.addModalFeatureList(JSON.parse(msg.name));
	});

	gSocket.on('res_FeatureData', function(msg) {
		// console.log("res_FeatureData");
		// endTime("FeatureData_Loading");
		MorphologicalFeatureModule.updateFeature(msg);
	});

	gSocket.on('res_CellLabelsInfo', function(msg) {
		console.log("res_CellLabelsInfo");
		// endTime("CellInfo_Loading");
		
		NavigationModule.setCellLabelsInfoData(msg.data);
	});

	gSocket.on('res_SubregionInfo', function(msg) {
		endTime("Subregion_Info_Loading");
		SubregionSelectionModule.setSubregionInfoData(msg.data);
	});

	gSocket.on('res_TopviewWidget', function(msg) {
		endTime("Topview_Loading");
		// TopviewNavigation.setImageData(msg.image);
		// TopviewNavigation.draw();
	});
	gSocket.on('res_TopviewWidget_subregion', function(msg) {
		// endTime("Topview_Subregion_Loading");
		console.log("res_TopviewWidget_subregion");
		TopviewNavigation.setSubregionData(msg.subregion);
		TopviewNavigation.draw();
	});

	gSocket.on('res_SubregionSelection', function(msg) {
		// console.log(msg.data)
		// for(var i=0;i<gLabelsSize;++i){
		// 	NavigationModule.setCellLabelHistColor(i, false, 2); 
		// }
		var mData = JSON.parse(msg.data);


		console.log("Subregion_Selection_Loading");
		console.log(mData);
		// for(var i=0;i<gSelectionInventory[parseInt(msg.index)].array.length;++i){
		// 	if(mData[i] != ""){

		// 		if(gSelectionInventory[parseInt(msg.index)].array[parseInt(mData[i]['included_id_cell'])] != -1){
		// 			gSelectionInventory[parseInt(msg.index)].array[parseInt(mData[i]['included_id_cell'])] = 1;
		// 			// NavigationModule.setCellLabelHistColor(parseInt(msg.data[i]), true, 2); 
		// 		}
		// 	}
		// }
		for(var i=0;i<mData.length;++i){
			// if(mData[i] != ""){
			gSelectionInventory[parseInt(msg.index)].array[parseInt(mData[i]['included_id_cell'])] = 1;

			// if(gSelectionInventory[parseInt(msg.index)].array[parseInt(mData[i]['included_id_cell'])] != -1){
			// 	// NavigationModule.setCellLabelHistColor(parseInt(msg.data[i]), true, 2); 
			// }
			// }
		}
		NavigationModule.redraw();
		SubregionViewer.start();
		CellLabelsViewer.start();
	});

	gSocket.on('res_Load', function(msg) {
		// console.log("res_Load");
		if(msg.data != "empty"){
			var data = JSON.parse(msg.data);
			GraphInterfaceModule.LoadFile(data);
		}
		else{
			GraphInterfaceModule.initData();
		}
	});
	
});