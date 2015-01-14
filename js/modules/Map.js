var Map = function (domNode) {

    var domNode = domNode;
    var drawingManager = null;
    var map = null;
    var shapes = [];

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

    return {

        init: function () {
            var mapOptions = {
                center: new google.maps.LatLng(37.774546, -122.433523),
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                zoom: 13
            };

            map = new google.maps.Map(domNode, mapOptions);
            drawingManager && drawingManager.setMap(map);
        },

        setDrawingManager: function(rectangleControl, circleControl, polygonControl, stopControl, deleteControl) {
            // Initialize the drawing manager
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
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 0.25,
                    strokeWeight: 3,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                },
                polygonOptions: {
                    fillColor: '#008000',
                    fillOpacity: 0.25,
                    strokeWeight: 3,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    zIndex: 1
                }
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (shape) {
                shapes.push(shape);
                drawingManager.setDrawingMode(null);
            });

            rectangleControl.click(drawRectangle);
            circleControl.click(drawCircle);
            polygonControl.click(drawPolygon);
            stopControl.click(stopDrawing);
            deleteControl.click(deleteAllShapes);
        },

        show: function () {
            domNode.style.display = 'block';
        },

        hide: function () {
            domNode.style.display = 'none';
        }
    }
};


/* TODO: add serach option

 var input = document.getElementById('placesSearchBox');
 var searchBox = new google.maps.places.SearchBox(input);
 var markers;
 markers = [];

 // Listen for the event fired when the user selects an item from the
 // pick list. Retrieve the matching places for that item.
 google.maps.event.addListener(searchBox, 'places_changed', function() {
 var places = searchBox.getPlaces();

 if (places.length == 0) {
 return;
 }
 for (var i = 0, marker; marker = markers[i]; i++) {
 marker.setMap(null);
 }

 // For each place, get the icon, place name, and location.
 markers = [];
 var pointCount = 0;
 var bounds = new google.maps.LatLngBounds();
 for (var i = 0, place; place = places[i]; i++) {
 pointCount++;
 var image = {
 url: place.icon,
 size: new google.maps.Size(71, 71),
 origin: new google.maps.Point(0, 0),
 anchor: new google.maps.Point(17, 34),
 scaledSize: new google.maps.Size(25, 25)
 };

 // Create a marker for each place.
 var marker = new google.maps.Marker({
 map: map,
 icon: image,
 title: place.name,
 position: place.geometry.location
 });

 markers.push(marker);

 bounds.extend(place.geometry.location);
 }

 if (pointCount > 1) {
 map.fitBounds(bounds);
 }
 else if (pointCount == 1) {
 map.setCenter(bounds.getCenter());
 map.setZoom(13);
 }
 });

 // Bias the SearchBox results towards places that are within the bounds of the
 // current map's viewport.
 google.maps.event.addListener(map, 'bounds_changed', function() {
 var bounds = map.getBounds();
 searchBox.setBounds(bounds);
 });




 }

 google.maps.event.addDomListener(window, 'load', initialize);

 };
 */