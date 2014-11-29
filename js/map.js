var map = null;
var drawingManager = null;
var shapes = [];

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.774546, -122.433523),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    zoom: 13
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: false,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions: {
      icon: 'images/beachflag.png'
    },
    rectangleOptions: {
      fillColor: '#2D5DCA',
      fillOpacity: 0.25,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.25,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1
    },
    polygonOptions: {
      fillColor: '#008000',
      fillOpacity: 0.25,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(shape) {
    shapes.push(shape);
    drawingManager.setDrawingMode(null);
  });

  drawingManager.setMap(map);
}

function drawRectangle() {
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
}
function drawCircle() {
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
}
function drawPolygon(){
  drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
}

function stopDrawing() {
  drawingManager.setDrawingMode(null);
}

function deleteAllShapes() {
  if (!shapes || shapes.length < 1) return;
  while (shapes.length > 0) {
    var shape = shapes.pop();
    shape.overlay.setMap(null);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);