var GraphInterfaceModule = (function(){
	
	var mCytoscape;
	var mEdgeId = 0;
	var mNodeId = 1;
	var mStatId = 0;

	var StartPosition = new Object();
	StartPosition.x = 100;
	StartPosition.y = 110;
	var GridLayout = new Array();

	function init(aId){
		mCytoscape = cytoscape({
			container: document.getElementById(aId),
			elements: [ /* ... */ ],
			layout: { name: 'grid' },

			// initial viewport state:
			zoom: 1.5,
			pan: { x: 0, y: 0 },

			// interaction options:
			minZoom: 1e-50,
			maxZoom: 1e50,
			zoomingEnabled: true,
			userZoomingEnabled: true,
			panningEnabled: true,
			userPanningEnabled: true,
			boxSelectionEnabled: true,
			selectionType: 'single',
			touchTapThreshold: 8,
			desktopTapThreshold: 4,
			autolock: false,
			autoungrabify: false,
			autounselectify: false,


			// rendering options:
			headless: false,
			styleEnabled: true,
			hideEdgesOnViewport: false,
			hideLabelsOnViewport: false,
			textureOnViewport: false,
			motionBlur: false,
			motionBlurOpacity: 0.2,
			wheelSensitivity: 0.5,
			pixelRatio: 'auto'
		});
		
		


		


		// var rootNode = mCytoscape.nodes("[id = "+ (mNodeId-1) + "]");
		// mLayoutOption.roots = rootNode;
		// mCytoscape.layout( mLayoutOption );



		mCytoscape.style()
			.selector('node')
			.style({
				'background-color': 'data(node_color)',
				'content' : 'data(node_name)',
				'shape': 'data(node_shape)',
				'text-valign': 'bottom',
				'font-size' : '12px',
				// 'font-style' : 'normal',
				'font-weight' : 'bold',
				'font-family' : 'Helvetica Neue, Helvetica, Arial, sans-serif',
    			// 'text-outline-width': 1,
        		// 'text-outline-color': '#111',
        		'text-margin-y' : '4px',
		        'color': '#111'
			})

		mCytoscape.style()
			.selector('edge')
			.style({
				'width': 2,
				'target-arrow-shape': 'triangle',
				'line-color': '#9dbaea',
				'target-arrow-color': '#9dbaea',
				'curve-style': 'bezier'
			})

		.update()
		mCytoscape.style()
			.selector(':selected')
			.style({
				'border-width': 3,
        		'border-color': '#333'
			})
		.update()
		
		mCytoscape.on('tap', function(event){
			// cyTarget holds a reference to the originator
			// of the event (core or element)
			var evtTarget = event.cyTarget;

			if( evtTarget === mCytoscape ){
				//// console.log('tap on background', event.cyTarget);

			} else {
				var obj = event.cyTarget.data();
				//// console.log(obj);
				updateChange(obj);
				if(obj.node_type == "Operation"){
					gFocusedObject = obj;
					//// console.log("Operation", gFocusedObject)
					updateTabEvent();
				}
				else if(obj.node_type == "Subset" || obj.node_type == "Default"){
					gFocusedObject = obj;
					//// console.log("Set", gFocusedObject)
					updateTabEvent();
				}
				else if(obj.node_type == "Statistics"){
					gFocusedObject = obj;	
					updateTabEvent();
				}
			}
		});

	}

	function LoadFile(aData){
		for(var i=0;i<aData.length;++i){
			if(aData[i].type == "Default"){
				mCytoscape.add({
					group: "nodes",
					data: { 
						node_name: "InitialSelection",
						node_shape: "ellipse",
						node_color: gQualitativeColorsHEX[1],
						node_type: "Default",
						id: mNodeId++,
						selection_index : 0,
					},
					position: { x: StartPosition.x, y: StartPosition.y }
				});
				GridLayout.push(0);
				gSelectionInventory.push(aData[i]);
				gFocusedObject = mCytoscape.getElementById(mNodeId-1).data();
				addRenderingOrderList(0);
			}
			else if(aData[i].type == "Diagram"){
				addScatterPlot(aData[i]);
			}
			else if(aData[i].type == "Subregion"){
				addSubregion(aData[i])
			}
			else if(aData[i].type == "Manual"){
				addManual(aData[i])	
			}
			else if(aData[i].type == "Set-Operation"){
				addSetOperation(aData[i])
			}
		}

		for(var i=0;i<aData.length;++i){
			if(aData[i].statistics.length != 0){
				addStatistics(aData[i]);
				//// console.log("TEst");
			}
		}
	}
	function initData(){
		//// console.log(gLabelsSize);

		mCytoscape.add({
		group: "nodes",
		data: { 
			node_name: "InitialSelection",
			node_shape: "ellipse",
			node_color: gQualitativeColorsHEX[1],
			node_type: "Default",
			id: mNodeId++,
			selection_index : 0,
			},
		position: { x: StartPosition.x, y: StartPosition.y }
		});
		GridLayout.push(0);

		var selection = new Object()
		selection.index = 0;
		selection.name = "InitialSelection";
		selection.color = gQualitativeColorsHEX[1];
		selection.type = "Default"
		selection.array = new Array(gLabelsSize);
		selection.graph_node_index = 1;
		selection.statistics = new Array();

		selection.parents_id = new Array(2);
		selection.child_id = new Array();
		selection.depth = 0;

		selection.parents_id[0] = -1;
		selection.parents_id[1] = -1;

		
		for(var i=0;i<gLabelsSize;++i){
			// -1: disable,  0: enable, 1:selected, 
			selection.array[i] = 1;
		}
		gSelectionInventory.push(selection);

		// gSelectionInventory.push(aData[i]);
		gFocusedObject = mCytoscape.getElementById(mNodeId-1).data();
		addRenderingOrderList(0);
	}

	function updateTabEvent(){
		document.getElementById("Subregion").setAttribute("class", "graphinterface_content_disable");
		document.getElementById("Manual").setAttribute("class", "graphinterface_content_disable");
		document.getElementById("Statistics").setAttribute("class", "graphinterface_content_disable");
		document.getElementById("Rendering").setAttribute("class", "graphinterface_content_disable");
		document.getElementById("Diagram").setAttribute("class", "graphinterface_content_disable");	
		document.getElementById("SetInfomation").setAttribute("class", "graphinterface_content_disable");
		document.getElementById("SetOperation").setAttribute("class", "graphinterface_content_disable");

		if(gFocusedObject.node_type  == "Operation"){
			var mNowObject = gFocusedObject;

			if(mNowObject.node_operation_type == "Subregion"){
				document.getElementById("Subregion").setAttribute("class", "graphinterface_content_enable");
				SubregionSelectionModule.subregionSelectionCardUpdate(mNowObject.selection_index);
			}
			else if(mNowObject.node_operation_type == "Diagram"){
				var pid = gSelectionInventory[gFocusedObject.selection_index].parents_id[0];
				gFocusedObject = mCytoscape.getElementById(gSelectionInventory[pid].graph_node_index).data();
				SetInfomationModule.updateMorphologicalFeature();
				document.getElementById("Diagram").setAttribute("class", "graphinterface_content_enable");
				DiagramSelectionModule.drawScatterPlot(mNowObject.selection_index);
			}
			else if(mNowObject.node_operation_type == "Manual"){
				document.getElementById("Manual").setAttribute("class", "graphinterface_content_enable");
				ManualSelectionModule.focused();
				ManualSelectionModule.ManualCardUpdate(mNowObject.selection_index);
			}
			
			else if(mNowObject.node_operation_type == "Rendering"){
				document.getElementById("Rendering").setAttribute("class", "graphinterface_content_enable");
			}
			else if(mNowObject.node_operation_type == "Set-Operation"){
				document.getElementById("SetOperation").setAttribute("class", "graphinterface_content_enable");				
				SetOperationModule.SetOperationCardUpdate(mNowObject.selection_index);
			}

		}
		else if(gFocusedObject.node_type == "Subset" || gFocusedObject.node_type == "Default"){
			document.getElementById("SetInfomation").setAttribute("class", "graphinterface_content_enable");
			var parents_id = gSelectionInventory[gFocusedObject.selection_index].parents_id;
			SetInfomationModule.SetInfomationCardUpdate(gFocusedObject.selection_index, parents_id);
			NavigationModule.setCellLabelHistColor(gFocusedObject.selection_index);
			NavigationModule.redraw();

		}
		else if(gFocusedObject.node_type == "Statistics"){
				SetInfomationModule.updateMorphologicalFeature();
				document.getElementById("Statistics").setAttribute("class", "graphinterface_content_enable");
				StatisticsModule.setStatisticsValue(gFocusedObject.selection_index);
				// for(var i=0;i<gMorphologicalFeature.feature.length;++i){
				//// 	// console.log(gMorphologicalFeature.feature[i].index);
				// }
				StatisticsModule.StatisticsCardUpdate(gFocusedObject.selection_index, gFocusedObject.index);

		}
				
	}


	function setOperateFuncList(aType){
		//// console.log("setOperateFuncList");
		document.getElementById("operate_func_list").innerHTML = "";
		
		if(aType == "One-InitialSelection"){
			var list1=document.createElement("li");
			list1.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Subregion','" + aType + "')>Subregion</a>"
			document.getElementById("operate_func_list").appendChild(list1);
			var list2=document.createElement("li");
			list2.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Manual','" + aType + "')>Manual</a>"
			document.getElementById("operate_func_list").appendChild(list2);
			var list3=document.createElement("li");
			list3.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Diagram','" + aType + "')>Diagram</a>"
			document.getElementById("operate_func_list").appendChild(list3);
		}
		else if(aType == "One-SubsetSelection"){
			var list1=document.createElement("li");
			list1.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Manual','" + aType + "')>Manual</a>"
			document.getElementById("operate_func_list").appendChild(list1);
			var list2=document.createElement("li");
			list2.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Diagram','" + aType + "')>Diagram</a>"
			document.getElementById("operate_func_list").appendChild(list2);
		}
		else if(aType == "Multi-Selection"){
			var list1=document.createElement("li");
			list1.innerHTML = "<a onclick=GraphInterfaceModule.callOperateFunc('Set-Operation','" + aType + "')>Set-Operation</a>"
			document.getElementById("operate_func_list").appendChild(list1);
		}
	}
	function setStatisticsFuncList(aType){
		//// console.log("setOperateFuncList");
		document.getElementById("statistics_func_list").innerHTML = "";

		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Maximum')>Maximum</a>"
		document.getElementById("statistics_func_list").appendChild(list1);

		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Minimum')>Minimum</a>"
		document.getElementById("statistics_func_list").appendChild(list1);
		
		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Count')>Count</a>"
		document.getElementById("statistics_func_list").appendChild(list1);

		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Sum')>Sum</a>"
		document.getElementById("statistics_func_list").appendChild(list1);

		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Mean')>Mean</a>"
		document.getElementById("statistics_func_list").appendChild(list1);

		var list1=document.createElement("li");
		list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Median')>Median</a>"
		document.getElementById("statistics_func_list").appendChild(list1);
		
		if(aType == "Subregion"){
			var list1=document.createElement("li");
			list1.innerHTML = "<a onclick=GraphInterfaceModule.callStatisticsFunc('Density')>Density</a>"
			document.getElementById("statistics_func_list").appendChild(list1);
		}

	}

	function callStatisticsFunc(aName){
		document.getElementById("statistics_feature").setAttribute("class", "operate_func_disable");
		if(aName == "Count"){
			document.getElementById("statistics_func_name").value = aName;
		}
		else if(aName == "Density"){
			document.getElementById("statistics_func_name").value = aName;	
		}
		else{
			document.getElementById("statistics_feature").setAttribute("class", "operate_func_enable");		
			document.getElementById("statistics_func_name").value = aName;


			for(var i=1;i<gMorphologicalFeature.namespace.length;++i){
				var list1=document.createElement("li");
				list1.innerHTML = "<a onclick=StatisticsModule.selectFeature('"+ i +"')>"+ gMorphologicalFeature.namespace[i] +"</a>"
				document.getElementById("statistics_feature_list").appendChild(list1);
			}
		}
	}

	function callOperateFunc(aName, aType){
		document.getElementById("operate_func_manual").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_subregion").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_diagram").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_set").setAttribute("class", "operate_func_disable");

		document.getElementById("operate_func_manual_button").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_subregion_button").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_diagram_button").setAttribute("class", "operate_func_disable");
		document.getElementById("operate_func_set_button").setAttribute("class", "operate_func_disable");

		if(aName == "Subregion"){
			document.getElementById("operate_func_subregion").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_subregion_button").setAttribute("class", "operate_func_enable");
		}
		else if(aName == "Diagram"){
			document.getElementById("operate_func_diagram").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_diagram_button").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_diagram_type").value = aType;
		}
		else if(aName == "Manual"){
			document.getElementById("operate_func_manual").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_manual_button").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_manual_type").value = aType;
		}
		else if(aName == "Set-Operation"){
			document.getElementById("operate_func_set").setAttribute("class", "operate_func_enable");
			document.getElementById("operate_func_set_button").setAttribute("class", "operate_func_enable");
		}
	}

	function initOperateFunc(){
		var NodeList = mCytoscape.$(':selected').jsons();

		for(var i=0;i<NodeList.length;++i){
			if(NodeList[i].data.node_type == "Operation"){
				NodeList.splice(i, 1);
			}
		}
		var len = NodeList.length;
		if(len == 1){
			var selection = gSelectionInventory[NodeList[0].data.selection_index];
			if(selection.name == "InitialSelection"){
				//// console.log("InitialSelection");
				$("#operate_func_modal").modal('show');
				setOperateFuncList("One-InitialSelection");
			}
			else{
				//// console.log("not InitialSelection");
				$("#operate_func_modal").modal('show');
				setOperateFuncList("One-SubsetSelection");
			}
		}
		else if(len > 1){
			//// console.log("Multi Selection");

			SetOperationModule.updateSetOperand(NodeList);
			$("#operate_func_modal").modal('show');
			setOperateFuncList("Multi-Selection");
		}
	}

	function initStatisticsFunc(){
		var NodeList = mCytoscape.$(':selected').jsons();

		for(var i=0;i<NodeList.length;++i){
			if(NodeList[i].data.node_type == "Operation"){
				NodeList.splice(i, 1);
			}
		}
		var len = NodeList.length;
		if(len == 1){
			if(NodeList[0].data.node_type == "Default" || NodeList[0].data.node_type == "Subset"){
				$("#statistics_func_modal").modal('show');
				setStatisticsFuncList(gSelectionInventory[NodeList[0].data.selection_index].type);
			}
		}
		else if(len > 1){
			//// console.log("Multi Selection");
		}
	}

	function addOneOperationNode(aOperate, aIndex){
		//// console.log("addOneOperationNode");
		// var NodeList = mCytoscape.getElementById(gSelectionInventory[aIndex].graph_node_index);
		//console.log(gSelectionInventory[aIndex].graph_node_index);
		var curNode = mCytoscape.getElementById(gSelectionInventory[gSelectionInventory[aIndex].parents_id[0]].graph_node_index);
		//console.log(curNode);
		var selection = gSelectionInventory[curNode.data().selection_index];
		var curDepth = selection.depth;
		var curPosition = curNode.position();
		//console.log(curNode.position());
		var mHeight = 0;
		if(GridLayout.length != curDepth+1){
			mHeight = GridLayout[curDepth+1] + 1;
			GridLayout[curDepth+1]++;
			
		}
		else{
			GridLayout.push(0)
			
		}

		var color;
		if(aOperate == "Subregion")
			color = gQualitativeColorsHEX[9];
		else if(aOperate == "Diagram")
			color = gQualitativeColorsHEX[7];
		else if(aOperate == "Manual")
			color = gQualitativeColorsHEX[5];

		mCytoscape.add({
			group: "nodes",
			data: { 
				node_name: aOperate + "_" + aIndex,
				node_shape: "triangle",
				node_color: color,
				node_type: "Operation",
				node_operation_type: aOperate,
				id: mNodeId++,
				selection_index : aIndex
			},
			position: { x: curPosition.x+150, y: StartPosition.y+mHeight*100}
			});

		mCytoscape.add({
			group: "edges",
			data: { 
				source: parseInt(curNode.data().id),
				target: mNodeId-1,
				edge_index: mEdgeId++
			}
			});

		mCytoscape.add({
			group: "nodes",
			data: { 
				node_name: gSelectionInventory[aIndex].name,
				node_shape: "ellipse",
				node_color: gSelectionInventory[aIndex].color,
				node_type: "Subset",
				id: mNodeId++,
				selection_index : aIndex
			},
			position: { x: curPosition.x+300, y: StartPosition.y+mHeight*100}
			});


		mCytoscape.add({
			group: "edges",
			data: { 
				source: mNodeId-2,
				target: mNodeId-1,
				edge_index: mEdgeId++
			}
			});	
	}
	function addMultiOperationNode(aOperate, aIndex){
		//console.log("addMultiOperationNode");
		var mNode = gSelectionInventory[aIndex];
		var parentsNode = new Array(2);
		parentsNode[0] = gSelectionInventory[mNode.parents_id[0]];
		parentsNode[1] = gSelectionInventory[mNode.parents_id[1]];
		
		var parentsGraphNode = new Array(2);
		var curDepth;
		var curPosition;
		parentsGraphNode[0] = mCytoscape.getElementById(parentsNode[0].graph_node_index);
		parentsGraphNode[1] = mCytoscape.getElementById(parentsNode[1].graph_node_index);
		
		if(parentsNode[0] > parentsNode[1]){
			curDepth = parentsNode[0].depth;
			curPosition = parentsGraphNode[0].position();
		}
		else{
			curDepth = parentsNode[1].depth;
			curPosition = parentsGraphNode[1].position();
		}
		var curHeight = 0;
		if(GridLayout.length != curDepth+1){
			curHeight = GridLayout[curDepth+1] + 1;
			GridLayout[curDepth+1]++;
		}
		else{
			GridLayout.push(0)	
		}

		//console.log(curDepth, curHeight, curPosition);

		mCytoscape.add({
			group: "nodes",
			data: { 
				node_name: aOperate + "_" + aIndex,
				node_shape: "triangle",
				node_color: gQualitativeColorsHEX[11],
				node_type: "Operation",
				node_operation_type: aOperate,
				id: mNodeId++,
				selection_index : aIndex
			},
			position: { x: curPosition.x+150, y: StartPosition.y+curHeight*100}
			});

		mCytoscape.add({
			group: "edges",
			data: { 
				source: parseInt(parentsGraphNode[0].data().id),
				target: mNodeId-1,
				edge_index: mEdgeId++
			}
			});

		mCytoscape.add({
			group: "edges",
			data: { 
				source: parseInt(parentsGraphNode[1].data().id),
				target: mNodeId-1,
				edge_index: mEdgeId++
			}
			});


		mCytoscape.add({
			group: "nodes",
			data: { 
				node_name: gSelectionInventory[aIndex].name,
				node_shape: "ellipse",
				node_color: gSelectionInventory[aIndex].color,
				node_type: "Subset",
				id: mNodeId++,
				selection_index : aIndex
			},
			position: { x: curPosition.x+300, y: StartPosition.y+curHeight*100}
			});


		mCytoscape.add({
			group: "edges",
			data: { 
				source: mNodeId-2,
				target: mNodeId-1,
				edge_index: mEdgeId++
			}
			});	
		


	}

	function addResultNode(aOperate, aIndex, statistics_id){
		//// console.log("addResultNode");
		var parentsNode = gSelectionInventory[aIndex];		
		//// console.log(aIndex);
		var	parentsGraphNode = mCytoscape.getElementById(parentsNode.graph_node_index);
		// var myDepth = 
		var curDepth = statistics_id;
		var curPosition = parentsGraphNode.position();
		var curHeight = 0;
		

		mCytoscape.add({
			group: "nodes",
			data: { 
				node_name: aOperate + "_" + mStatId,
				node_shape: "rectangle",
				node_color: gQualitativeColorsHEX[3],
				node_type: "Statistics",
				node_operation_type: aOperate,
				id: "s" + (mStatId++),
				selection_index : aIndex,
				index: statistics_id
			},
			position: { x: curPosition.x+curDepth*75, y: curPosition.y+50}
			});

		mCytoscape.add({
			group: "edges",
			data: { 
				source: parseInt(parentsGraphNode.data().id),
				target: "s" + (mStatId-1),
				edge_index: mEdgeId++
			}
			});

	}

	function addNode(aType, aOperate ,aIndex, statistics_id){
		if(aType == "One-InitialSelection" || aType == "One-SubsetSelection"){
			addOneOperationNode(aOperate, aIndex);
		}
		else if(aType == "Multi-Selection"){
			addMultiOperationNode(aOperate, aIndex);
		}
		else if(aType == "Statistics"){
			addResultNode(aOperate, aIndex, statistics_id);
		}
	}

	function updateChange(aObj){
		
		// var joblist = new Array();
		// joblist.unshift(aObj.selection_index);
		// var pID = aObj.parents_id;
		// while(true){
		// 	if(parseInt(pID) == -1)
		// 		break;

		//// 	console.log(mCytoscape.getElementById(pID).data().node_type);
		// 	if( mCytoscape.getElementById(pID).data().node_type == "Operation"){
		// 		pID = mCytoscape.getElementById(pID).data().parents_id;
		// 	}
		// 	else{
		// 		joblist.unshift(mCytoscape.getElementById(pID).data().selection_index)
		// 		pID = mCytoscape.getElementById(pID).data().parents_id;
		// 	}

		// }
		// for(var i=0;i<joblist.length-1;++i){
		// 	var pre = i;
		// 	var cur = i+1;
		// 	for(var j=0;j<gSelectionInventory[cur].array.length;++j){
		// 		if(gSelectionInventory[pre].array[j] == 0 || gSelectionInventory[pre].array[j] == -1){
		// 			gSelectionInventory[cur].array[j] = -1;
		// 		}
		// 		else if(gSelectionInventory[pre].array[j] == 1){
		// 			if(gSelectionInventory[cur].array[j] == -1){
		// 				gSelectionInventory[cur].array[j] = 0;
		// 			}
		// 		}
		// 	}
		// }
		//// console.log(joblist);
	}

	function addStatistics(aSelection){
		if(aSelection){
			for(var i=0;i<aSelection.statistics.length;++i){
				if(aSelection.statistics[i].function_name == "Density"){
					aSelection.statistics[i].feature_name = "Volume"
					aSelection.statistics[i].feature_index = 1;
				}

				if(aSelection.statistics[i].function_name != "Count" && aSelection.statistics[i].feature_name != null)
					MorphologicalFeatureModule.addFeatureList(aSelection.statistics[i].feature_index);
			


				addNode("Statistics", "Statistics", aSelection.statistics[i].selection_index, i);
				//console.log("addNodeTEst");
			}
			
		}
		else{
			var aName = document.getElementById("statistics_func_name").value;
			var aFeatureName = document.getElementById("statistics_feature_name").value; 
			var aFeatureIndex = document.getElementById("statistics_feature_index").value; 
			
			var NodeList = mCytoscape.$(':selected').jsons();

			statistic = new Object();
			statistic.index = gSelectionInventory[NodeList[0].data.selection_index].statistics.length;
			statistic.function_name = aName;
			statistic.feature_name = aFeatureName;
			statistic.feature_index = aFeatureIndex;
			statistic.value = 0;
			statistic.node_type = "Statistics";
			statistic.selection_index = NodeList[0].data.selection_index;


			gSelectionInventory[NodeList[0].data.selection_index].statistics.push(statistic);

			if(aName == "Density"){
				aFeatureName = "Volume"
				aFeatureIndex = 1;
				statistic.feature_name = "Volume";
			}

			if(aName != "Count" && aFeatureName != null)
				MorphologicalFeatureModule.addFeatureList(aFeatureIndex);

			addNode("Statistics", "Statistics", NodeList[0].data.selection_index, gSelectionInventory[NodeList[0].data.selection_index].statistics.length-1);			
		}



		// updateTabEvent()
	}

	function addScatterPlot(aSelection){
		var aType;
		var aXAxis;
		var aYAxis;
		if(aSelection){
			// mNodeId = aSelection.graph_node_index-1;
			aType = "One-InitialSelection";
			aXAxis = aSelection.axis.x;
			aYAxis = aSelection.axis.y;
			gSelectionInventory.push(aSelection);
			addRenderingOrderList(aSelection.index);

		}
		else{
			aXAxis = parseInt(document.getElementById("operate_diagram_xaxis_index").value);
			aYAxis = parseInt(document.getElementById("operate_diagram_yaxis_index").value);
			aType = document.getElementById("operate_func_diagram_type").value;

			var aName = document.getElementById("operate_name").value;
			var aColor = document.getElementById("operate_color").value; 
			var NodeList = mCytoscape.$(':selected').jsons();
			
			selection = new Object()
			selection.index = gSelectionInventory.length
			selection.name = aName;
			selection.color = aColor;
			selection.type = "Diagram"
			selection.axis = new Object();
			selection.axis.x = aXAxis;
			selection.axis.y = aYAxis;
			selection.array = new Array(gLabelsSize);
			selection.graph_node_index = mNodeId+1;
			selection.statistics = new Array();

			selection.parents_id = new Array(2);
			selection.child_id = new Array();
			selection.depth = gSelectionInventory[NodeList[0].data.selection_index].depth+1;

			selection.parents_id[0] = gSelectionInventory[NodeList[0].data.selection_index].index;
			selection.parents_id[1] = -1;

			gSelectionInventory[NodeList[0].data.selection_index].child_id.push(selection.index);


			for(var i=0;i<gSelectionInventory[NodeList[0].data.selection_index].array.length;++i){
				// -1: disable,  0: enable, 1:selected, 
				if(gSelectionInventory[NodeList[0].data.selection_index].array[i] < 1)
					selection.array[i] = -1;
				else
					selection.array[i] = 0;
			}
			gSelectionInventory.push(selection);
			addRenderingOrderList(selection.index);

		}

		if(aXAxis == aYAxis)
			MorphologicalFeatureModule.addFeatureList(aXAxis);
		else{
			MorphologicalFeatureModule.addFeatureList(aXAxis);
			MorphologicalFeatureModule.addFeatureList(aYAxis);
		}

		addNode(aType, "Diagram" ,gSelectionInventory.length-1, 0);
	}

	function addSubregion(aSelection){
		var aIdx;
		if(aSelection){
			// mNodeId = aSelection.graph_node_index-1;
			aIdx = aSelection.subregion_index;
			gSelectionInventory.push(aSelection);
			addRenderingOrderList(aSelection.index);

		}
		else{
			var aName = document.getElementById("operate_name").value;
			var aColor = document.getElementById("operate_color").value; 
			aIdx = parseInt(document.getElementById("operate_subregion_index").value);
			// var aType = document.getElementById("operate_func_subregion_type").value;
			var NodeList = mCytoscape.$(':selected').jsons();


			selection = new Object()
			selection.index = gSelectionInventory.length;
			selection.subregion_index = aIdx;
			selection.contour_array = new Array();
			selection.top_contour_array = new Array();
			selection.name = aName;
			selection.color = aColor;
			selection.type = "Subregion"
			selection.array = new Array(gLabelsSize);
			selection.graph_node_index = mNodeId+1;
			selection.statistics = new Array();

			selection.parents_id = new Array(2);
			selection.child_id = new Array();
			selection.depth = gSelectionInventory[NodeList[0].data.selection_index].depth+1;

			selection.parents_id[0] = gSelectionInventory[NodeList[0].data.selection_index].index;
			selection.parents_id[1] = -1;

			gSelectionInventory[NodeList[0].data.selection_index].child_id.push(selection.index);



			for(var i=0;i<gSelectionInventory[NodeList[0].data.selection_index].array.length;++i){
				// -1: disable,  0: enable, 1:selected, 
				if(gSelectionInventory[NodeList[0].data.selection_index].array[i] < 1)
					selection.array[i] = -1;
				else
					selection.array[i] = 0;
			}
			gSelectionInventory.push(selection);
			addRenderingOrderList(selection.index);

		}


		// gSubregionViewerStatus = 1;

		SubregionViewer.start();
		TopviewNavigation.reqSubregionData(aIdx);		
		SubregionSelectionModule.reqSubregionSelection(aIdx, gSelectionInventory.length-1);
		addNode("One-InitialSelection", "Subregion" ,gSelectionInventory.length-1, 0);
		// updateTabEvent()
	}

	function addManual(aSelection){
		var aType;
		if(aSelection){
			// mNodeId = aSelection.graph_node_index-1;
			aType = "One-InitialSelection";
			gSelectionInventory.push(aSelection);
			addRenderingOrderList(aSelection.index);
		}
		else{
			var aName = document.getElementById("operate_name").value;
			var aColor = document.getElementById("operate_color").value; 
			aType = document.getElementById("operate_func_manual_type").value;
			var NodeList = mCytoscape.$(':selected').jsons();

			selection = new Object()
			selection.index = gSelectionInventory.length;
			selection.name = aName;
			selection.color = aColor;
			selection.type = "Manual"
			selection.array = new Array(gLabelsSize);
			selection.graph_node_index = mNodeId+1;
			selection.parents_id = new Array(2);
			selection.child_id = new Array();
			selection.depth = gSelectionInventory[NodeList[0].data.selection_index].depth+1;
			selection.statistics = new Array();

			selection.parents_id[0] = gSelectionInventory[NodeList[0].data.selection_index].index;
			selection.parents_id[1] = -1;

			gSelectionInventory[NodeList[0].data.selection_index].child_id.push(selection.index);


			for(var i=0;i<gSelectionInventory[NodeList[0].data.selection_index].array.length;++i){
				// -1: disable,  0: enable, 1:selected, 
				if(gSelectionInventory[NodeList[0].data.selection_index].array[i] < 1)
					selection.array[i] = -1;
				else
					selection.array[i] = 0;
			}
			gSelectionInventory.push(selection);
			addRenderingOrderList(selection.index);
		}

		// SelectionItemModule.drawNametag("manual_item_area", aName, aColor, 5, "eye", gSelectionInventory.length-1);
		addNode(aType, "Manual", gSelectionInventory.length-1, 0);
		// updateTabEvent();
	}

	function addSetOperation(aSelection){
		var aType;
		if(aSelection){
			// mNodeId = aSelection.graph_node_index-1;
			aType = "One-InitialSelection";
			gSelectionInventory.push(aSelection);
			addRenderingOrderList(aSelection.index);
		}
		else{
			var aName = document.getElementById("operate_name").value;
			var aColor = document.getElementById("operate_color").value; 

			var aOperation = document.getElementById("operate_set_operation_name").value;  
			var aOperand1 = document.getElementById("operate_set_operand1_index").value; 
			var aOperand2 = document.getElementById("operate_set_operand2_index").value; 
				
			selection = new Object()
			selection.index = gSelectionInventory.length;
			selection.name = aName;
			selection.color = aColor;
			selection.operation_name = aOperation;
			selection.statistics = new Array();
			selection.type = "Set-Operation"
			selection.array = new Array(gLabelsSize);
			selection.graph_node_index = mNodeId+1;
			selection.parents_id = new Array(2);
			selection.child_id = new Array();

			if(gSelectionInventory[aOperand1].depth > gSelectionInventory[aOperand2].depth)
				selection.depth = gSelectionInventory[aOperand1].depth+1;
			else
				selection.depth = gSelectionInventory[aOperand2].depth+1;
			
			selection.parents_id[0] = aOperand1;
			selection.parents_id[1] = aOperand2;

			gSelectionInventory[aOperand1].child_id.push(selection.index);
			gSelectionInventory[aOperand2].child_id.push(selection.index);


			if(aOperation == "Union")
				selection.array = SetOperationModule.Union(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);
			else if(aOperation == "Subtraction")
				selection.array = SetOperationModule.Subtraction(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);
			else if(aOperation == "Intersection")
				selection.array = SetOperationModule.Intersection(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);

			gSelectionInventory.push(selection);
			addRenderingOrderList(selection.index);
		}
		// SelectionItemModule.drawNametag("manual_item_area", aName, aColor, 5, "eye", gSelectionInventory.length-1);
		addNode("Multi-Selection", "Set-Operation", gSelectionInventory.length-1, 0);
		// updateTabEvent();
	}




	function addRenderingOrderList(aIndex){
		gRenderingArray.push(aIndex);

		var row = document.createElement("tr");
		row.setAttribute("id", "rendering_order_" + aIndex)

		var checkbox = document.createElement("td");
		checkbox.setAttribute("class", "col-xs-1");
		checkbox.innerHTML = "<input type='checkbox' id='rendering_order_chbox_"+ aIndex + "' value='"+ aIndex +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+aIndex+") checked>"
		row.appendChild(checkbox);

		var name = document.createElement("td");
		name.setAttribute("class", "col-xs-9");
		name.innerHTML = gSelectionInventory[aIndex].name + " <span class='glyphicon glyphicon-stop' style='color:" + gSelectionInventory[aIndex].color + "'></span>";
		row.appendChild(name);

		var up = document.createElement("td");
		up.setAttribute("class", "col-xs-1");
		up.innerHTML = "<span id='rendering_order_up_" + aIndex + "' onclick=GraphInterfaceModule.RenderingOrder_Up("+ aIndex +") class='glyphicon glyphicon-triangle-top'></span>"
		row.appendChild(up);

		var down = document.createElement("td");
		down.setAttribute("class", "col-xs-1");
		down.innerHTML = "<span id='rendering_order_down_" + aIndex + "' onclick=GraphInterfaceModule.RenderingOrder_Down("+ aIndex +") class='glyphicon glyphicon-triangle-bottom'></span>"
		row.appendChild(down);

		var e = document.getElementById("rendering_order_list")
		e.insertBefore(row, e.firstChild);
		optimize_rendering_order_DOM();
	}


	function swap(arr, i, j){
		var tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;

		arr[i].setAttribute("id", "rendering_order_"+i);
		arr[j].setAttribute("id", "rendering_order_"+j);

		var v = arr[i].childNodes[0].childNodes[0].value;
		if (arr[i].childNodes[0].childNodes[0].checked){
			arr[i].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ i + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+i+") checked>"
		}
		else
			arr[i].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ i + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+i+") >"
		arr[i].childNodes[2].innerHTML="<span id='rendering_order_up_" + i + "' onclick=GraphInterfaceModule.RenderingOrder_Up("+ i +") class='glyphicon glyphicon-triangle-top'></span>"
		arr[i].childNodes[3].innerHTML="<span id='rendering_order_down_" + i + "' onclick=GraphInterfaceModule.RenderingOrder_Down("+ i +") class='glyphicon glyphicon-triangle-bottom'></span>"

		var v = arr[j].childNodes[0].childNodes[0].value;
		if (arr[j].childNodes[0].childNodes[0].checked)
			arr[j].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ j + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+j+") checked>"
		else
			arr[j].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ j + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+j+") >"
		arr[j].childNodes[2].innerHTML="<span id='rendering_order_up_" + j + "' onclick=GraphInterfaceModule.RenderingOrder_Up("+ j +") class='glyphicon glyphicon-triangle-top'></span>"
		arr[j].childNodes[3].innerHTML="<span id='rendering_order_down_" + j + "' onclick=GraphInterfaceModule.RenderingOrder_Down("+ j +") class='glyphicon glyphicon-triangle-bottom'></span>"

		return arr;
		
	}
	function optimize_rendering_order_DOM(){
		var list = document.getElementById('rendering_order_list');
		var items = list.childNodes;
		var itemsArr = [];
		for (var i in items) {
		    if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
				items[i].setAttribute("id", "rendering_order_"+i);
				var v = items[i].childNodes[0].childNodes[0].value;
				if (items[i].childNodes[0].childNodes[0].checked)
					items[i].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ i + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+i+") checked>"
				else
					items[i].childNodes[0].innerHTML="<input type='checkbox' id='rendering_order_chbox_"+ i + "' value='"+ v +"' onclick=GraphInterfaceModule.RenderingOrder_Check("+i+") >"
				items[i].childNodes[2].innerHTML="<span id='rendering_order_up_" + i + "' onclick=GraphInterfaceModule.RenderingOrder_Up("+ i +") class='glyphicon glyphicon-triangle-top'></span>"
				items[i].childNodes[3].innerHTML="<span id='rendering_order_down_" + i + "' onclick=GraphInterfaceModule.RenderingOrder_Down("+ i +") class='glyphicon glyphicon-triangle-bottom'></span>"

				itemsArr.push(items[i]);
			}
		}

		list.innerHTML ="";

		for (var i = 0, ln = itemsArr.length; i < ln; i++) {
			list.appendChild(itemsArr[i]);
		}
	}

	function optimize_rendering_order(){
		gRenderingArray = new Array();
		var list = document.getElementById('rendering_order_list');
		var items = list.childNodes;
		for (var i in items) {
			if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
				if(items[i].childNodes[0].childNodes[0].checked){
					var v = items[i].childNodes[0].childNodes[0].value;
					gRenderingArray.unshift(parseInt(v));
				}
			}
		}
	}

	function RenderingOrder_Up(aIndex){
		var list = document.getElementById('rendering_order_list');
		//console.log(list);
		var items = list.childNodes;
		var itemsArr = [];
		for (var i in items) {
			if (items[i].nodeType == 1) {
				itemsArr.push(items[i]);
			}
		}
		if(aIndex < 1){
			return;
		}

		itemsArr = swap(itemsArr, aIndex, aIndex-1);

		for(var i=0;i<itemsArr.length;++i){
			var element = document.getElementById("rendering_order_" + i);
			element.outerHTML = "";
			delete element;
		}
		for (var i = 0, ln = itemsArr.length; i < ln; i++) {
			list.appendChild(itemsArr[i]);
		}

		optimize_rendering_order();
		//console.log(gRenderingArray);		
	}	
	function RenderingOrder_Down(aIndex){
		var list = document.getElementById('rendering_order_list');
		var items = list.childNodes;
		var itemsArr = [];
		for (var i in items) {
			if (items[i].nodeType == 1) {
				itemsArr.push(items[i]);
			}
		}

		if(aIndex >= gSelectionInventory.length-1){
			return;
		}

		itemsArr = swap(itemsArr, aIndex+1, aIndex);

		for(var i=0;i<itemsArr.length;++i){
			var element = document.getElementById("rendering_order_" + i);
			element.outerHTML = "";
			delete element;
		}

		for (var i = 0, ln = itemsArr.length; i < ln; i++) {
			list.appendChild(itemsArr[i]);
		}

		optimize_rendering_order();
		//console.log(gRenderingArray);
	}
	function RenderingOrder_Check(aIndex){
		//console.log(gRenderingArray);
		//// console.log(aIndex);
		var value = document.getElementById("rendering_order_chbox_"+aIndex).value;

		var removeFlag = false;
		for(var i=0;i<gRenderingArray.length;++i){
			if(gRenderingArray[i] == value){
				gRenderingArray.splice(i, 1);
				removeFlag = true;
				break;
			}
		}
		if(removeFlag == false){
			gRenderingArray.splice(gRenderingArray.length-parseInt(aIndex), 0, parseInt(value));
		}
		//console.log(gRenderingArray);

	}

	

	return {
		init : init,
		LoadFile : LoadFile,
		initData : initData,
		initOperateFunc : initOperateFunc,
		initStatisticsFunc : initStatisticsFunc,
		callOperateFunc : callOperateFunc,
		callStatisticsFunc : callStatisticsFunc,
		addNode : addNode,
		addScatterPlot : addScatterPlot,
		addSubregion : addSubregion,
		addManual : addManual,
		addSetOperation : addSetOperation,
		addStatistics : addStatistics,
		RenderingOrder_Up : RenderingOrder_Up,
		RenderingOrder_Down : RenderingOrder_Down,
		RenderingOrder_Check : RenderingOrder_Check
	}

})();