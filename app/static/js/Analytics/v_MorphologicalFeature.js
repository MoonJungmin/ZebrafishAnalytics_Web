var MorphologicalFeatureModule = (function(){
	// var gSocket;
	var mSelectionNode = [];
	var node;

	var mTempfeature = new Array();


	function setSocket(){
		// gSocket = aSocket;
		ReqFeatureName();
	}

	function ReqFeatureName(){
		startTime("FeatureName_Loading");
		// gSocket.emit('req_FeatureName');
		// function readTextFile(file, callback) {
		// 	var rawFile = new XMLHttpRequest();
		//     rawFile.overrideMimeType("application/json");
		//     rawFile.open("GET", file, true);
		//     rawFile.onreadystatechange = function() {
		//         if (rawFile.readyState === 4 && rawFile.status == "200") {
		//             callback(rawFile.responseText);
		//         }
		//     }
		//     rawFile.send(null);
		// }

		// readTextFile("../static/MorphologicalFeature/Namespace.json", function(text){
		//     var data = JSON.parse(text);
		//     // setCellLabelsInfoData(data);
		//     console.log(data);
		// });
		var data = ['Volume', 'SurfaceArea', 'Sphericity', 'Eccentricity', 'Intensity'];
    addModalFeatureList(data);
	}

	function ReqFeatureData(aObj){
		startTime("FeatureData_Loading");
		// console.log(aObj);
		gSocket.emit('req_FeatureData', JSON.stringify(aObj));
		// function readTextFile(file, callback) {
		// 	var rawFile = new XMLHttpRequest();
		//     rawFile.overrideMimeType("application/json");
		//     rawFile.open("GET", file, true);
		//     rawFile.onreadystatechange = function() {
		//         if (rawFile.readyState === 4 && rawFile.status == "200") {
		//             callback(rawFile.responseText);
		//         }
		//     }
		//     rawFile.send(null);
		// }

		// readTextFile("../static/MorphologicalFeature/"+aObj.name+".json", function(text){
		//     var data = JSON.parse(text);
		//     console.log(data);
		//     updateFeature({'data':data, 'object':aObj});
		//     // setCellLabelsInfoData(data);
		// });
	}

	function addModalFeatureList(aFeatureNameOBJ){
		gMorphologicalFeature.namespace = aFeatureNameOBJ;
		for(var i=0;i<gMorphologicalFeature.namespace.length;++i){
			var list=document.createElement("li");
			list.innerHTML = "<a onclick='MorphologicalFeatureModule.selectXAxis("+ i +")'>"+ gMorphologicalFeature.namespace[i] + "</a>"
			document.getElementById("operate_feature_list_x").appendChild(list);
			
			var list=document.createElement("li");
			list.innerHTML = "<a onclick='MorphologicalFeatureModule.selectYAxis("+ i +")'>"+ gMorphologicalFeature.namespace[i] + "</a>"
			document.getElementById("operate_feature_list_y").appendChild(list);
			// document.getElementById("csp_add_modal_list").innerHTML += "<a class='list-group-item' data-dismiss='modal' onclick=MorphologicalFeatureModule.addFeatureList("+ i +")>"+ gMorphologicalFeature.namespace[i] +"</a>";
		}
	}

	function selectXAxis(aIdx){
		document.getElementById("operate_diagram_xaxis_name").value = gMorphologicalFeature.namespace[aIdx];
		document.getElementById("operate_diagram_xaxis_index").value = aIdx;
	}
	function selectYAxis(aIdx){
		document.getElementById("operate_diagram_yaxis_name").value = gMorphologicalFeature.namespace[aIdx];
		document.getElementById("operate_diagram_yaxis_index").value = aIdx;	
	}

	function addFeatureList(aIdx){
			var feature = new Object();
			feature.name = gMorphologicalFeature.namespace[aIdx];
			feature.index = aIdx;
			feature.data = null;
			feature.max = null;
			feature.min = null;
			feature.active = false;

			for(var i=0;i<gMorphologicalFeature.feature.length;++i){
				if(gMorphologicalFeature.feature[i].index == feature.index)
					return;
			}
			gMorphologicalFeature.feature.push(feature);
			console.log(feature);
			ReqFeatureData(feature);
	}

	// function changeXAxisFeature(aIndex){
	// 	xAxisFeatureIndex = aIndex;
	//// 	console.log(xAxisFeatureIndex);
	// 	drawScatterPlot();
	// }
	// function changeYAxisFeature(aIndex){
	// 	yAxisFeatureIndex = aIndex;	
	//// 	console.log(yAxisFeatureIndex);
	// 	drawScatterPlot();
	// }

	function removeFeatureItem(aIndex){

		//console.log("removeFeatureItem");
		
		if(gMorphologicalFeature.feature.length > 1){
			var index = 0;		
			for(var i=0;i<gMorphologicalFeature.feature.length;++i){
				if(i == aIndex){
					index = i;
				}
			}

			var elem = document.getElementById("csp_feature_item_" + gMorphologicalFeature.feature[aIndex].index);
			elem.parentNode.removeChild(elem);				

			elem = document.getElementById("csp_x_axis_" + gMorphologicalFeature.feature[aIndex].index);
			elem.parentNode.removeChild(elem);				

			elem = document.getElementById("csp_y_axis_" + gMorphologicalFeature.feature[aIndex].index);
			elem.parentNode.removeChild(elem);				
					

			gMorphologicalFeature.feature.splice(aIndex,1);

		}
	}

	function updateFeature(msg){

		var feature = JSON.parse(msg.object);
		console.log(feature);

		var data = new Array(msg.data.length);
		
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature.index){
				var key = gMorphologicalFeature.feature[i].name.toLowerCase() + "_cell";
				console.log(key);
				for(var i=0;i<data.length;++i){
					data[i] = msg.data[i][key]
				}
				break;
			}
		}
		
		console.log(data);
		
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature.index){
				gMorphologicalFeature.feature[i].data = data;
				gMorphologicalFeature.feature[i].data.unshift(0);
				findMax = a => a.reduce((res,cur) => res < cur ? cur : res , -Infinity);
				findMin = a => a.reduce((res,cur) => res > cur ? cur : res , +Infinity);
				gMorphologicalFeature.feature[i].max = findMax(data);
				gMorphologicalFeature.feature[i].min = findMin(data);
				gMorphologicalFeature.feature[i].active = true;
				document.getElementById("csp_feature_"+ gMorphologicalFeature.feature[i].index.toString()).innerHTML = "<div id='csp_feature_item_" + gMorphologicalFeature.feature[i].index +"'><div style='float:left;'><span class='label label-default' style='display:table-cell; text-align:center; vertical-align:middle; width:100px; height:22px;'>"+gMorphologicalFeature.feature[i].name+"</span></div><svg id='histogram_"+ gMorphologicalFeature.feature[i].index.toString() + "' style='margin-top:5px;'></svg>";

				drawHistogram(gMorphologicalFeature.feature[i].index);

				break;
			}
		}

		

		//// console.log("update Feature");

		// document.getElementById("x_axis_feature").innerHTML += "<li id='csp_x_axis_" + gMorphologicalFeature.feature[idx].index + "'><a onclick=DiagramSelectionModule.changeXAxisFeature("+ gMorphologicalFeature.feature[idx].index +")>" + gMorphologicalFeature.feature[idx].name + "</a></li>";
		// document.getElementById("y_axis_feature").innerHTML += "<li id='csp_y_axis_" + gMorphologicalFeature.feature[idx].index + "'><a onclick=DiagramSelectionModule.changeYAxisFeature("+ gMorphologicalFeature.feature[idx].index +")>" + gMorphologicalFeature.feature[idx].name + "</a></li>";


		// if(gMorphologicalFeature.feature.length < 3){
		// 	DiagramSelectionModule.drawScatterPlot();
		// }
		////console.log(gMorphologicalFeature.feature);
	}

	function getHistogramData(aIdx, aBeanSize, aData){
		// var dataX = new Array(aBeanSize + 1);
		//console.log("getHistogramData");
		var dataY = new Array(aBeanSize + 1);
		for(var i=0;i<=aBeanSize;++i){
			// dataX[i] = i;
			dataY[i] = 0;
		}
		var index = 0;		
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == aIdx){
				index = i;
				break;
			}
		}
	
		findMax = a => a.reduce((res,cur) => res < cur ? cur : res , -Infinity);
		findMin = a => a.reduce((res,cur) => res > cur ? cur : res , +Infinity);
		var max = findMax(mTempfeature);
		var min = findMin(mTempfeature);


		for(var i=0;i<mTempfeature.length;++i){
			var nValue = (mTempfeature[i] - min) / (max-min) * aBeanSize;
			// dataX[parseInt(nValue)] = parseInt(nValue);
			dataY[parseInt(nValue)] += 1;
			//// console.log(nValue);
		}
		return dataY;
	}

	function drawHistogram(aIdx){
		
		var width = window.innerWidth*0.30-30, height = window.innerHeight*0.08;
		var index = 0;		
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == aIdx){
				index = i;
			}
		}

		var chart = d3.horizon()
			.width(width)
			.height(height)
			.bands(5)
			.mode("mirror")
			.interpolate("basis");

		var svg = d3.select("#histogram_"+aIdx)
			.attr("width", width)
			.attr("height", height);

		mTempfeature = new Array(1);
		var selection_index = gFocusedObject.selection_index;
		for(var i=0;i<gMorphologicalFeature.feature[index].data.length;++i){
			if(gSelectionInventory[selection_index].array[i] == 1){
				mTempfeature.push(gMorphologicalFeature.feature[index].data[i]);
			}
		}

		
		var beanSize;
		if(mTempfeature.length<1000)
			beanSize = mTempfeature.length;
		else
			beanSize = 1000;

		var data = getHistogramData(aIdx, beanSize);

		
		// Offset so that positive is above-average and negative is below-average.
		var mean = data.reduce(function(p, v) { return p + v; }, 0) / data.length;

		// Transpose column values to rows.
		data = data.map(function(rate, i) {
			return [i, rate - mean];
		});

		// Render the chart.
		svg.data([data]).call(chart);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {
				return d
			})])
			.range([height, 0]);

		var x = d3.scale.linear()
			.domain([0, beanSize])
			.rangeRound([0, width]);

		// var brush = d3.svg.brush()
		// 	.x(x)
		// 	.on("brush", function(d) {
		//// 			console.log("brushed" + index);
		// 			var e = brush.extent();
		// 			gMorphologicalFeature.feature[index].min_user = (e[0]/1000*(gMorphologicalFeature.feature[index].max-gMorphologicalFeature.feature[index].min))+gMorphologicalFeature.feature[index].min;
		// 			gMorphologicalFeature.feature[index].max_user = (e[1]/1000*(gMorphologicalFeature.feature[index].max-gMorphologicalFeature.feature[index].min))+gMorphologicalFeature.feature[index].min;
		//// 			console.log(gMorphologicalFeature.feature[index]);

		// 			if(gSelectionInventory_EnableIndex.Diagram != -1)
		// 				DiagramSelectionModule.drawScatterPlot();
		// 		});

		// svg.append("g")
		// 	.attr("class", "x brush")
		// 	.call(brush) //call the brush function, causing it to create the rectangles
		// 	.selectAll("rect") //select all the just-created rectangles
		// 	.attr("y", 0)
		// 	.attr("height", (height)) //set their height
		//console.log("drawHistogram done");
	}

	return {
		setSocket : setSocket,
		addModalFeatureList : addModalFeatureList,
		addFeatureList : addFeatureList,
		removeFeatureItem : removeFeatureItem,
		updateFeature : updateFeature,
		selectXAxis : selectXAxis,
		selectYAxis : selectYAxis,
		drawHistogram : drawHistogram

	}


})();
