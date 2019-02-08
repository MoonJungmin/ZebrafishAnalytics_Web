var DiagramSelectionModule = (function(){

	var mSelectionNode = [];
	var node;

	function getScatterPlotData(width, height, aIndex){
		var Arr = new Array();		
		// console.log(width, height);
	
		xSize = parseInt(width)+1;
		ySize = parseInt(height)+1;

		var mArr = new Array(xSize);
		for (var i = 0; i <= xSize; i++) {
			mArr[i] = new Array(ySize);
			for(var j=0;j<= ySize;++j){
				var obj = new Object();
				obj.count = 0;
				obj.labels = new Array();
				mArr[i][j] = obj;
			}
		}

		var xIdx;// = gSelectionInventory[aIndex].axis.x;	
		var yIdx;// = gSelectionInventory[aIndex].axis.y;	
		
		for(var i =0;i<gMorphologicalFeature.feature.length;++i){
			// console.log(gMorphologicalFeature.feature[i].index, gSelectionInventory[aIndex].axis.x, gSelectionInventory[aIndex].axis.y);
			if(gMorphologicalFeature.feature[i].index == gSelectionInventory[aIndex].axis.x){
				xIdx = i;
			}
			if(gMorphologicalFeature.feature[i].index == gSelectionInventory[aIndex].axis.y){
				yIdx = i;
				
			}
		}


		var xMax = -Infinity;
		var xMin = Infinity;

		var yMax = -Infinity;
		var yMin = Infinity;

		// console.log(xIdx);

		for(var i =1;i<gMorphologicalFeature.feature[xIdx].data.length;++i){
			if(gSelectionInventory[aIndex].array[i] != -1){
				if(xMax < gMorphologicalFeature.feature[xIdx].data[i]){
					xMax = gMorphologicalFeature.feature[xIdx].data[i];
				}
				if(xMin > gMorphologicalFeature.feature[xIdx].data[i]){
					xMin = gMorphologicalFeature.feature[xIdx].data[i];
				}
				if(yMax < gMorphologicalFeature.feature[yIdx].data[i]){
					yMax = gMorphologicalFeature.feature[yIdx].data[i];
				}
				if(yMin > gMorphologicalFeature.feature[yIdx].data[i]){
					yMin = gMorphologicalFeature.feature[yIdx].data[i];
				}
			}
		}
		// console.log(xMin, xMax, yMin, yMax);
		
		var test = 0;
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] != -1){
				test++;
			}
		}
		// console.log(test);

		for(var i = 1;i<gMorphologicalFeature.feature[xIdx].data.length-1;++i){
			if(gSelectionInventory[aIndex].array[i] != -1){
				var valueX;
				var valueY;
				if(xMin == xMax || yMin == yMax){
					valueX = width / 2;
					valueY = height / 2;
				}
				else{
					// console.log("test");
					valueX = ((gMorphologicalFeature.feature[xIdx].data[i] - xMin) / (xMax - xMin)) * width;
					valueY = ((gMorphologicalFeature.feature[yIdx].data[i] - yMin) / (yMax - yMin)) * height;
					mArr[parseInt(valueX)][parseInt(valueY)].count += 1;
					mArr[parseInt(valueX)][parseInt(valueY)].labels.push(i);
				}

					
			}
		}

		for (var i = 0; i < xSize; i++) {
			for(var j=0;j<ySize;++j){
				if(mArr[i][j].count != 0){

					var Obj = new Object();
					Obj.cx = i;
					Obj.cy = j;
					Obj.r = mArr[i][j].count/gMorphologicalFeature.feature[xIdx].data.length*10 + 3;
					Obj.color = gQualitativeColors[1];
					Obj.alpha = 0.7;
					Obj.selected = false;
					Obj.labels = mArr[i][j].labels;
					Arr.push(Obj);	
				}
				
			}
		}
		return Arr;
	}

	function drawScatterPlot(aIndex){
		
		if(aIndex == -1){
			aIndex = gSelectionInventory.length-1;
		}

		d3.select("#csp_plot_contents").select("svg").remove();
		
		
		var margin = {top: 20, right: 50, bottom: 50, left: 50},
		width = window.innerWidth*0.30 - margin.left - margin.right,
		height = window.innerHeight*0.22 - margin.top - margin.bottom;
        padding = -80; // space around the chart, not including labels

		var x = d3.scale.linear()
			.range([0, width]);
		var y = d3.scale.linear()
			.range([height, 0]);
		var color = d3.scale.category10();
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(8)
			.tickFormat(d3.format("s"));
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(8)
			.tickFormat(d3.format("s"));
		var svg = d3.select("#csp_plot_contents")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		var shiftKey;
		var ctrlKey;
		var rect, 
		
		svg = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		

		data = getScatterPlotData(width, height, aIndex);

		x.domain(d3.extent(data, function(d) { return d.cx; })).nice();
		y.domain(d3.extent(data, function(d) { return d.cy; })).nice();
		svg = svg.call(d3.behavior.zoom().x(x).y(y).on("zoom", zoom));
			

		
		var brush = svg.append("g")
			.datum(function() { return {selected: false, previouslySelected: false}; })
			.attr("class", "brush")
			.call(d3.svg.brush()
			.x(d3.scale.identity().domain([0, width]))
			.y(d3.scale.identity().domain([0, height]))

			.on("brushstart", function(d) {
				// console.log('brushstart');
				svg = svg.call(d3.behavior.zoom().on("zoom", null));
				node.each(function(d) { d.previouslySelected = (shiftKey||ctrlKey) && d.selected; });
				if (!shiftKey || !ctrlKey) {
					d3.event.target.clear();
					d3.select(this).call(d3.event.target);
				}
			})
			.on("brush", function() {
				if (shiftKey) {
					// console.log('shiftKey', shiftKey);
					var extent = d3.event.target.extent();
					node.classed("selected", function(d) {
						if(extent[0][0] <= x(d.cx) && x(d.cx) < extent[1][0] && extent[0][1] <= y(d.cy) && y(d.cy) < extent[1][1]){
								for(var i = 0; i<d.labels.length;++i){
									if(gSelectionInventory[aIndex].array[d.labels[i]] != -1){
										gSelectionInventory[aIndex].array[d.labels[i]] = 1;
										// NavigationModule.setCellLabelHistColor(d.labels[i], true, 1); 
									}
								}
								return d.selected = true;
						}
						else{
							if(d.previouslySelected){
								for(var i = 0; i<d.labels.length;++i){
									if(gSelectionInventory[aIndex].array[d.labels[i]] != -1){
										gSelectionInventory[aIndex].array[d.labels[i]] = 1;
										// NavigationModule.setCellLabelHistColor(d.labels[i], true, 1); 
									}
								}
								return d.selected = true
							}	
						}

					});
				} 
				else if(ctrlKey){
					// console.log('ctrlKey', ctrlKey);
					var extent = d3.event.target.extent();
					node.classed("selected", function(d) {
						if(extent[0][0] <= x(d.cx) && x(d.cx) < extent[1][0] && extent[0][1] <= y(d.cy) && y(d.cy) < extent[1][1]){
								for(var i = 0; i<d.labels.length;++i){
									if(gSelectionInventory[aIndex].array[d.labels[i]] == 1){
										gSelectionInventory[aIndex].array[d.labels[i]] = 0;
										// NavigationModule.setCellLabelHistColor(d.labels[i], false, 1);
									}
								}
							return d.selected = false;
						}
						else{
							if(d.previouslySelected){
								for(var i = 0; i<d.labels.length;++i){
									if(gSelectionInventory[aIndex].array[d.labels[i]] != -1){
										gSelectionInventory[aIndex].array[d.labels[i]] = 1;
										// NavigationModule.setCellLabelHistColor(d.labels[i], true, 1);
									}
								}
								return d.selected = true
							}	
						}
					});	
				}
				else {
					d3.event.target.clear();
					d3.select(this).call(d3.event.target);
				}
			})
			.on("brushend", function() {
				d3.event.target.clear();
				d3.select(this).call(d3.event.target);
				svg.call(d3.behavior.zoom().x(x).y(y).on("zoom", zoom));
				
				updateSelection(aIndex);
				NavigationModule.setCellLabelHistColor(aIndex);
				NavigationModule.redraw();
			}));
		
		function zoom() {
			if (shiftKey) { 
				// console.log('zoom shiftKey');
				return;
			}
			// console.log('zoom');
			node.attr("cx", function(d) { return x(d.cx); })
				.attr("cy", function(d) { return y(d.cy); });
			d3.select('.x.axis').call(xAxis);
			d3.select('.y.axis').call(yAxis);
		}
		
		rect = svg.append('rect')
			.attr('pointer-events', 'all')
			.attr('width', width)
			.attr('height', height)
			.style('fill', 'none');

		node = svg.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", "dot")
		    .on("click", function(d){
		    	var mean_z = 0;
		    	for(var i=0;i<d.labels.length;++i){
		    		var cell_label = d.labels[i];
		    		mean_z += (gCellLabelsRange[cell_label].minZ + gCellLabelsRange[cell_label].maxZ)/2;
		    		// console.log(gCellLabelsRange[cell_label]);
		    	}
		    	mean_z = parseInt(mean_z / d.labels.length);
		    	gViewObj.centerZ = mean_z;
		    	// console.log(d.labels);
		    })
			.attr("r", function(d) {
						return d.r;
			})
			.attr("cx", function(d) { return x(d.cx); })
			.attr("cy", function(d) { return y(d.cy); })
			.style("fill", function(d) { return color(d.color); })
			.style("fill-opacity", function (d) { return d.alpha; });


		// set_selection();
		for(var i=0;i<node[0].length;++i){
			for(var j=0;j<node[0][i].__data__.labels.length;++j){
				if(gSelectionInventory[aIndex].array[node[0][i].__data__.labels[j]] == 1){
					node[0][i].__data__.selected = true;
					break;
				}
			}
		}
		// console.log(node[0][0].__data__.selected = true);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
			
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
			
		svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
		.attr("transform", function(d) {
		return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
		});


		var xIdx = 0;	
		var yIdx = 0;	
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == gSelectionInventory[aIndex].axis.x){
				xIdx = i;
			}
			if(gMorphologicalFeature.feature[i].index == gSelectionInventory[aIndex].axis.y){
				yIdx = i;
			}
		}

		svg.append("text")
			.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
			.attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
			.text(gMorphologicalFeature.feature[yIdx].name);

		svg.append("text")
			.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
			.attr("transform", "translate("+ (width/2) +","+(height-(padding/2))+")")  // centre below axis
			.text(gMorphologicalFeature.feature[xIdx].name);

		node.classed('selected', function (d) {return d.selected;})

		d3.select(window).on("keydown", function() {
			shiftKey = d3.event.shiftKey;
			ctrlKey = d3.event.ctrlKey;

			if (shiftKey || ctrlKey) {
				rect = rect.attr('pointer-events', 'none');
			} else {
				rect = rect.attr('pointer-events', 'all');
			}
		});

		d3.select(window).on("keyup", function() {
			shiftKey = d3.event.shiftKey;
			ctrlKey = d3.event.ctrlKey;
			if (shiftKey || ctrlKey) {
				rect = rect.attr('pointer-events', 'none');
			} else {
				rect = rect.attr('pointer-events', 'all');
			}
		});	
	}


	function updateSelection(aIndex){
		if(gSelectionInventory[aIndex].child_id.length > 0){
			var node_id = gSelectionInventory[aIndex].child_id[0];

			var childArray = new Array();
			function checkArray(val){
				for(var i=0;i<childArray.length;++i){
					if(childArray[i].index == val)
						return false;
				}
				return true;
			}
			function findChild(selection){
				if(selection.child_id.length == 0){
					if(checkArray(selection.index))
						childArray.push(selection);
					return;
				}
				else{
					for(var i=0;i<selection.child_id.length;++i){
						findChild(gSelectionInventory[selection.child_id[i]]);
						
						if(checkArray(selection.index))	
							childArray.push(selection);
					}
				}
			}

			function updateArray(aSelectionIndex){
				var mChild_id = gSelectionInventory[aSelectionIndex].child_id;
				for(var k=0;k<mChild_id.length;++k){
					var child_index = mChild_id[k];

					if(gSelectionInventory[child_index].type == "Set-Operation"){

						var aOperand1 = gSelectionInventory[child_index].parents_id[0];
						var aOperand2 = gSelectionInventory[child_index].parents_id[1];

						if(gSelectionInventory[child_index].operation_name == "Union")
							gSelectionInventory[child_index].array = SetOperationModule.Union(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);
						else if(gSelectionInventory[child_index].operation_name == "Subtraction")
							gSelectionInventory[child_index].array = SetOperationModule.Subtraction(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);
						else if(gSelectionInventory[child_index].operation_name == "Intersection")
							gSelectionInventory[child_index].array = SetOperationModule.Intersection(gSelectionInventory[aOperand1].array, gSelectionInventory[aOperand2].array);
					}
					else{
						var parents_index = gSelectionInventory[child_index].parents_id[0];
						for(var h=0;h<gSelectionInventory[child_index].array.length;++h){
							if(gSelectionInventory[parents_index].array[h] == 1){
								if(gSelectionInventory[child_index].array[h] == -1){
									// console.log("test");
									gSelectionInventory[child_index].array[h] = 0;
								}
							}
							else if(gSelectionInventory[parents_index].array[h] == 0){
								gSelectionInventory[child_index].array[h] = -1;
							}
						}
					}
				}
			}
			findChild(gSelectionInventory[aIndex]);
			childArray.sort(function (a, b) { 
				return parseInt(a.depth) - parseInt(b.depth);  
			});
			// childArray.unshift(gSelectionInventory[node_id]);
			for(var i=0;i<childArray.length-1;i++){
				updateArray(childArray[i].index);
			}
			// console.log(childArray);
		}
	}




	return {
		// changeXAxisFeature : changeXAxisFeature,
		// changeYAxisFeature : changeYAxisFeature,
		drawScatterPlot : drawScatterPlot
		// addScatterPlot : addScatterPlot
	}


})();
