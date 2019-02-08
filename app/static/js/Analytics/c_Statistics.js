var StatisticsModule = (function(){
	
	var selectionStatID = "selection_statistics";
	var featureStatID = "feature_statistics";

	var mSelectionArr = new Array()

	function StatisticsCardUpdate(aIdx, aStatisticsIdx) {
		clearStatistics_DOM()
		document.getElementById("statistics_area").style.display = "block";
		// console.log(gSelectionInventory[aIdx], aStatisticsIdx);

		// SelectionItemModule.drawNametag("subregion_selection_name", gSelectionInventory[aIdx].name, gSelectionInventory[aIdx].color, 3, "dot", -1);
		var name = document.getElementById("statistics_parents_name");
		var text = document.createElement("p");
		text.innerHTML = gSelectionInventory[aIdx].name;
		name.appendChild(text);

		var funcname = document.getElementById("statistics_function_name");
		var text2 = document.createElement("p");
		text2.innerHTML = gSelectionInventory[aIdx].statistics[aStatisticsIdx].function_name;
		funcname.appendChild(text2);

		var feature = document.getElementById("statistics_morphological_feature_name");
		var text3 = document.createElement("p");
		text3.innerHTML = gSelectionInventory[aIdx].statistics[aStatisticsIdx].feature_name;
		feature.appendChild(text3);

		var statvalue = document.getElementById("statistics_value");
		var text4 = document.createElement("p");
		text4.innerHTML = gSelectionInventory[aIdx].statistics[aStatisticsIdx].value;
		statvalue.appendChild(text4);
	}


	function clearStatistics_DOM(){
		document.getElementById("statistics_parents_name").innerHTML = "";
		document.getElementById("statistics_function_name").innerHTML = "";
		document.getElementById("statistics_value").innerHTML = "";
		document.getElementById("statistics_morphological_feature_name").innerHTML = "";	
	}


	function setStatisticsValue(aIndex){
		var idx = gSelectionInventory[aIndex].statistics.length-1;
		statObject = gSelectionInventory[aIndex].statistics[idx];
		if(statObject.function_name == "Maximum"){
			gSelectionInventory[aIndex].statistics[idx].value = getMaximum(aIndex, statObject.feature_name);
		}
		else if(statObject.function_name == "Minimum"){
			gSelectionInventory[aIndex].statistics[idx].value = getMinimum(aIndex, statObject.feature_name);
		}
		else if(statObject.function_name == "Count"){
			gSelectionInventory[aIndex].statistics[idx].value = getCount(aIndex);
		}
		else if(statObject.function_name == "Mean"){
			gSelectionInventory[aIndex].statistics[idx].value = getMean(aIndex, statObject.feature_name);
		}
		else if(statObject.function_name == "Sum"){
			gSelectionInventory[aIndex].statistics[idx].value = getSum(aIndex, statObject.feature_name);
		}
		else if(statObject.function_name == "Density"){
			gSelectionInventory[aIndex].statistics[idx].value = getDensity(aIndex, statObject.feature_name);
		}
		else if(statObject.function_name == "Median"){
			gSelectionInventory[aIndex].statistics[idx].value = getMedian(aIndex, statObject.feature_name);
		}
		// console.log(gSelectionInventory[aIndex].statistics[idx]);
	}

	function selectFeature(aIndex){
		document.getElementById("statistics_feature_name").value = gMorphologicalFeature.namespace[aIndex];
		document.getElementById("statistics_feature_index").value = aIndex;
	}

	function getDensity(aIndex, aFeatureName){
		sIndex = gSelectionInventory[aIndex].subregion_index;
		// console.log(gSubregionInfoData[sIndex]);
		var density = getSum(aIndex, aFeatureName) / gSubregionInfoData[sIndex].Volume;
		return density.toFixed(2);
	}

	function getMedian(aIndex, aFeatureName){
		var feature_namespace_index;
		var feature_index
		for(var i=0;i<gMorphologicalFeature.namespace.length;++i){
			if(gMorphologicalFeature.namespace[i] == aFeatureName){
				feature_namespace_index = i;
				break;
			}
		}
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature_namespace_index){
				feature_index = i;
			}
		}
		var featureArr = new Array();
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				featureArr.push(gMorphologicalFeature.feature[feature_index].data[i]);
			}
		}

		featureArr.sort(function (a, b) { 
			return a < b ? -1 : a > b ? 1 : 0;  
		});

		return featureArr[parseInt(featureArr.length/2)].toFixed(2);
	}

	function getSum(aIndex, aFeatureName){
		var sum = 0.0;
		var feature_namespace_index;
		var feature_index
		for(var i=0;i<gMorphologicalFeature.namespace.length;++i){
			if(gMorphologicalFeature.namespace[i] == aFeatureName){
				feature_namespace_index = i;
				break;
			}
		}
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature_namespace_index){
				feature_index = i;
			}
		}
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				sum += gMorphologicalFeature.feature[feature_index].data[i];
			}
		}
		return sum.toFixed(2);
	}

	function getCount(aIndex){
		var count = 0;
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				count ++;
			}
		}
		return parseInt(count);
	}
	function getMaximum(aIndex, aFeatureName){
		var max = -Infinity;
		var feature_namespace_index;
		var feature_index
		for(var i=0;i<gMorphologicalFeature.namespace.length;++i){
			if(gMorphologicalFeature.namespace[i] == aFeatureName){
				feature_namespace_index = i;
				break;
			}
		}
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature_namespace_index){
				feature_index = i;
			}
		}
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				if(max < gMorphologicalFeature.feature[feature_index].data[i]){
					max = gMorphologicalFeature.feature[feature_index].data[i];
				}
			}
		}
		return max.toFixed(2);
	}
	function getMinimum(aIndex, aFeatureName){
		var min = Infinity;
		var feature_namespace_index;
		var feature_index
		for(var i=0;i<gMorphologicalFeature.namespace.length;++i){
			if(gMorphologicalFeature.namespace[i] == aFeatureName){
				feature_namespace_index = i;
				break;
			}
		}
		for(var i=0;i<gMorphologicalFeature.feature.length;++i){
			if(gMorphologicalFeature.feature[i].index == feature_namespace_index){
				feature_index = i;
			}
		}
		for(var i=0;i<gSelectionInventory[aIndex].array.length;++i){
			if(gSelectionInventory[aIndex].array[i] == 1){
				if(min > gMorphologicalFeature.feature[feature_index].data[i]){
					min = gMorphologicalFeature.feature[feature_index].data[i];
				}
			}
		}
		return min.toFixed(2);
	}

	function getMean(aIndex, aFeatureName){
		var size = getCount(aIndex);
		var sum = getSum(aIndex, aFeatureName);
		return (sum/size).toFixed(2);
	}




	function getVariance(aFeature, aMean){
		var sum = 0.0;
		var size = mSelectionArr.length;

		for(var i=0;i<size;++i){
			sum += Math.pow((aFeature.data[mSelectionArr[i]]- aMean), 2);
		}

		return sum/size;
	}

	function setSelectionArr(){
		for(var i=0;i<gLabelsSize;++i){
			if(gCellLabelsTable[gSelectionLevel].selectionSubregion[i] || gCellLabelsTable[gSelectionLevel].selectionScatter[i] || gCellLabelsTable[gSelectionLevel].selectionUser[i])
				mSelectionArr.push(i)
		}
	}

	function getFiveNumber(aFeature){
		var featureArr = new Array(mSelectionArr.length)
	
		for(var i=0;i<mSelectionArr.length;++i){
			var obj=new Object();
			obj.label = mSelectionArr[i];
			obj.data = aFeature.data[mSelectionArr[i]];
			featureArr[i] = obj;
		}

		// console.log(featureArr);

		featureArr.sort(function (a, b) { 
			return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;  
		});

		// console.log(featureArr);

		var fiveNumber = new Array(5);
		fiveNumber[0] = featureArr[0].data;
		fiveNumber[1] = featureArr[parseInt(mSelectionArr.length/4)].data;
		fiveNumber[2] = featureArr[parseInt(mSelectionArr.length/2)].data;
		fiveNumber[3] = featureArr[parseInt(mSelectionArr.length/4*3)].data;
		fiveNumber[4] = featureArr[mSelectionArr.length-1].data;
		return fiveNumber;
	}


	function clearStatistics(){
		var feature_item = document.getElementById(featureStatID);
		for(var i=0;i<feature_item.childNodes.length;++i){
			feature_item.removeChild(feature_item.childNodes[i]);
		}
	}
	
	return {
		StatisticsCardUpdate : StatisticsCardUpdate,
		clearStatistics : clearStatistics,
		selectFeature : selectFeature,
		setStatisticsValue : setStatisticsValue
	}

})();
