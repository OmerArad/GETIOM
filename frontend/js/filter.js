var FilterPage = {
    map: null,
    slider: null,
    init: function () {
        if (this.map) { // Already initialized
            this.map.deleteAllShapes();
            return;
        }

        $('#processingModal').modal();
        // Initialize map
        var map = new Map($('#filterLocationMap')[0]);
        this.map = map;

        // Get number of data objects stored in server's DB
        $.getJSON('db/size', function (data) {
            GETIOM.databasePointsNum = data.pointsNum;
            if (GETIOM.databasePointsNum && GETIOM.databasePointsNum > 0) {
                $.getJSON('samplePoints', function (data) {
                    map.init(data[0][0], data[0][1]);
                    map.addSearchBox();
                    map.addDrawingManager();
                    map.setHeatmapLayer(data);
                    $('#processingModal').modal('hide');
                    successMessage('<strong>GETIOM Started.</strong><br>Server DB contains ' + GETIOM.databasePointsNum + ' data points!');
                }).error(function() {
                    $('#processingModal').modal('hide');
                    errorMessage('<strong>Failed to start GETIOM.</strong><br>Check that the server is up and running');
                });
            }
            else {
                $('#processingModal').modal('hide');
                errorMessage('<strong>Failed to get DB point count from server.</strong><br>Check that the server is up and running');
            }
         }).error(function() {
                $('#processingModal').modal('hide');
                errorMessage('<strong>Failed to start GETIOM.</strong><br>Check that the server is up and running');
            });

        $('#filterLocationForm').submit(function (e) {
            e.preventDefault();

            var shape = map.getShape();
            var url = null;

            if (shape.type === 'circle') {
                var circle = shape.overlay;
                var lat = circle.getCenter().lat();
                var lng = circle.getCenter().lng();
                var radius = circle.getRadius();
                url = 'filter/location/circle?lat=' + lat + '&lng=' + lng + '&radius=' + radius;
            }
            else if (shape.type === 'rectangle') {
                var rect = shape.overlay;
                var bounds = rect.getBounds();
                var lat1 = bounds.getNorthEast().lat();
                var lng1 = bounds.getNorthEast().lng();
                var lat2 = bounds.getSouthWest().lat();
                var lng2 = bounds.getSouthWest().lng();
                url = 'filter/location/rectangle?lat1=' + lat1 + '&lng1=' + lng1 + '&lat2=' + lat2 + '&lng2=' + lng2;
            }
            else if (shape.type === 'polygon') {
                var i = 0;
                var points = '[';
                var poly = shape.overlay;

                //iterate over the paths
                poly.getPaths().getArray().forEach(function(path){

                    //iterate over the points in the path
                    path.getArray().forEach(function(latLng){
                        i++;
                        if (i > 1) {
                            points += ',';
                        }
                        points += '[\"'+latLng.lat()+'\",\"'+latLng.lng()+'\"]';
                    });
                });
                points  += ']';
                url = 'filter/location/polygon?points=' + points;
            }
            else {
                errorMessage('<strong>No filter selected!</strong>');
                return;
            }
            applyFilter(url);
        });
        $('#filterLocationSkip').click(function(e) {
            e.preventDefault();
            applyFilter('filter');
        });

        $('#filterLocationClear').click(function(e) {
            e.preventDefault();
            map.deleteAllShapes();
        })
    }
};

function applyFilter(url) {
    $('#processingModal').modal();
    GETIOM.filteringTime = Date.now();
    $.getJSON(url, function (data) {
        GETIOM.filteredPointsNum = data.pointsNum;
        filteringDone();
    })
        .error(function() {
            $('#processingModal').modal('hide');
            errorMessage('<strong>Failed to filter.</strong><br>Check that the server is up and running');
        });
}

function filteringDone() {
    $('#processingModal').modal('hide');
    var t2 = Date.now();
    var ms = t2 - GETIOM.filteringTime;     //time in milliseconds
    GETIOM.filteringTime = ms / 1000;
    successMessage('<strong>Filtered ' + GETIOM.filteredPointsNum + ' data points in ' + GETIOM.filteringTime + ' seconds!</strong>');
    moveTo('cluster');
}