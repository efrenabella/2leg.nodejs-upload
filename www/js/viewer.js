/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var viewer;

function launchViewer(div, urn) {
  console.log("Launching Autodesk Viewer for: " + urn);
  var options = {
    'document': 'urn:' + urn,
    'env': 'AutodeskProduction',
    'getAccessToken': getForgeToken,
    'refreshToken': getForgeToken
  };

  var viewerElement = document.getElementById(div);
  viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
  //testEvents(viewer);
  Autodesk.Viewing.Initializer(
    options,
    function () {
      viewer.initialize();
      loadDocument(options.document);
    }
  );
  var searchPropList = new Array('displayName');//'DELIM_Elem_Name');
  //var id = model.getModelId();
  //viewer.search('1',OnSearchSuccess,OnSearchError, searchPropList); 
  viewer.getObjectTree(onObjTreeSuccess,onObjTreeError);
}

function onObjTreeSuccess(dat){
	console.log(dat);
	var childrn = dat.nodeAccess.children;
	//console.log(childrn);
	var ids = dat.nodeAccess.dbIdToIndex;

	viewer.getProperties(ids[2],OnGetProperties_ofOne_Success,OnGetProperties_ofOne_Error);
	var queue = Object.values(ids);
	console.log(queue);
	for (var n = 0; n < queue.length; n++){
		//console.log(queue[n]);
		viewer.getProperties(queue[n],OnGetProperties_ofOne_Success,OnGetProperties_ofOne_Error);
	}
}
function onObjTreeError(objTreeError){
	console.log('onObjTreeError() - errorCode:' + objTreeError);
}
function OnGetProperties_ofOne_Success(props){
	console.log(props);
	//if(props.name.contains("Cracks") ) {
		//console.log(props.name);
	//}
	//for(var j = 0; j < props.length; j++){

	//}
}
function OnGetProperties_ofOne_Error(err){
	console.log('OnGetProperties_ofOne_Error() - errorCode:' + err);
}
function OnSearchSuccess(srch){
    console.log(srch);
}

function OnSearchError(err){
    //console.log("Error in OnSearchError() " );
    console.log(err);
}

function loadDocument(documentId){
  var oauth3legtoken = getForgeToken();

  Autodesk.Viewing.Document.load(
    documentId,
    function (doc) { // onLoadCallback
      geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type': 'geometry',
      }, true);
      if (geometryItems.length > 0) {
        geometryItems.forEach(function (item, index) {
          /*
          // WIP, show viewables
          var v = $('<input type="button" value="' + item.name + '" class="btn btn-primary btn-xs"/>&nbsp;');
          v.click(function () {
            viewer.impl.unloadCurrentModel();
            viewer.load(doc.getViewablePath(geometryItems[index]));
          });
          $('#viewables').append(v);
          */
        });
        viewer.load(doc.getViewablePath(geometryItems[0])); // show 1st view on this document...
        viewer.loadExtension('Autodesk.ADN.Viewing.Extension.MyExtension', '');
      }
    },
    function (errorMsg) { // onErrorCallback
      console.log(errorMsg);
    }
  )
}
