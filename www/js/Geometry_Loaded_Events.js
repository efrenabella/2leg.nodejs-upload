//Executes onAfter callback once all events have
//been triggered
function afterViewerEvents(viewer, events, onAfter) {

  async.each(events,
    function (event, callback) {

      var handler = function(ev){

        viewer.removeEventListener(
          event, handler);

        callback();
      };

      viewer.addEventListener(
        event, handler);
    },
    function (err) {

      onAfter();
    });
}

//A utility recursive method to parse
//model structure
function parseModelStructure(viewer, node) {

  var children = [];

  if(node.children) {

    node.children.forEach(function (child) {

      var newNode = {
        name: child.name,
        dbId: child.dbId,
        material: null
      };

      children.push(newNode);

      newNode.children = parseModelStructure(
        viewer, child);
    });
  }

  return children;
}

//Test method
//example of use:
// var viewer = new Autodesk.Viewing.Private.Viewer3D(div);
// testEvents(viewer);
// viewer.load(viewablePath);
//
function testEvents(viewer) {

  var events = [
    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT
  ];

  afterViewerEvents(
    viewer,
    events,
    function(){

      viewer.getObjectTree(function (rootComponent) {

        var rootNode = {
          name: 'root',
          children: []
        };

        rootNode.children = parseModelStructure(
          viewer,
          rootComponent.root);

        console.log(rootNode);
      });
    });
}