$( document ).ready(function() {
	var CanvasModule = (function(){



		var canv=document.createElement("canvas");
		canv.setAttribute("id", gBackgroundEMCanvID);
		canv.width = gWindowObj.width;
		canv.height = gWindowObj.height;
		canv.style.position = "absolute";		
		document.getElementById("mainviewer_id").appendChild(canv);
		
		var canv=document.createElement("canvas");
		canv.setAttribute("id", gManualSelectionCanvID);
		canv.width = gWindowObj.width;
		canv.height = gWindowObj.height;
		canv.setAttribute("style", "position:absolute;z-index:2;")		
		document.getElementById("mainviewer_id").appendChild(canv);

		var canv=document.createElement("canvas");
		canv.setAttribute("id", gSubregionCanvID);
		canv.width = gWindowObj.width;
		canv.height = gWindowObj.height;
		canv.style.position = "absolute";
		
		document.getElementById("mainviewer_id").appendChild(canv);
		
		var canv=document.createElement("canvas");
		canv.setAttribute("id", gLabelCanvID);
		canv.width = gWindowObj.width;
		canv.height = gWindowObj.height;
		canv.style.position = "absolute";		
		document.getElementById("mainviewer_id").appendChild(canv);

		// var div=document.createElement("div");
		// div.setAttribute("id", "top_navi");
		// div.width = gWindowObj.width;
		// div.height = 200;
		// div.style.position = "absolute";		
		// document.getElementById("mainviewer_id").appendChild(div);




		var canv=document.createElement("canvas");
		canv.setAttribute("id", gNavigationID);
		canv.width = window.innerWidth*0.02;
		canv.height = window.innerHeight;
		document.getElementById("navigation_widget_id").appendChild(canv);

		var canv=document.createElement("canvas");
		canv.setAttribute("id", gTopViewNavigationID);
		canv.width = 800/3;
		canv.height = 512/3;
		
		document.getElementById("topview_widget_id").appendChild(canv);


		// var div_area = document.getElementById("cell_infomation_tooltip");
		// var div_panel = document.createElement("div");
		// div_panel.setAttribute("class", "panel panel-default");
		// var div_panel_head = document.createElement("div");
		// div_panel_head.setAttribute("class", "panel-heading");
		// div_panel_head.innerHTML = "<b>Cell Infomation</b>"
		// div_panel.appendChild(div_panel_head);
		// var div_panel_body = document.createElement("div");
		// div_panel_body.setAttribute("id", "cell_infomation_contents")
		// div_panel_body.innerHTML = "Test";
		// div_panel.appendChild(div_panel_body);
		// div_area.appendChild(div_panel);
		document.getElementById("navi_current_index").value = gEMSliceIndex[gViewObj.centerZ];
		document.getElementById("navi_total_index").value = gEMSliceIndex[gDataInfoObj.dimz-1];

		GraphInterfaceModule.init("graphinterface_widget_id");


		BackgroundEMViewer.setCanvas(gBackgroundEMCanvID);
		CellLabelsViewer.setCanvas(gLabelCanvID);
		NavigationModule.setCanvas(gNavigationID);
		SubregionViewer.setCanvas(gSubregionCanvID);
		TopviewNavigation.setCanvas(gTopViewNavigationID);		
		ManualSelectionModule.setCanvas(gManualSelectionCanvID);

	})();
});