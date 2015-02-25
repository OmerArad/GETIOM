$(document).ready(function () {
    var map = new Map($('#resultsMap')[0]);
    map.init(40.821715, -74.122381);               //TODO optimize zoom and location to display results
    map.hide();

    $('#resultsShowMap').click(function () {
        ResultsPage.loadPolygons(map);
        map.show();
    });
});

var ResultsPage = {
    init: function() {
        // Draw Charts
        var filterData = [
            {label: "", data: GETIOM.filteredMessagesNum},
            {label: "", data: GETIOM.databaseMessagesNum-GETIOM.filteredMessagesNum}
        ]
        var clusterData = GETIOM.clusters.map(function(cluster) {
            return {label:"", data: cluster.length};
        });
        var computationTime = [
            {label: "Filtering Time", data: GETIOM.filteringTime},
            {label: "Clustering Time", data: GETIOM.clusteringTime}
        ]
        $.plot('#resultsFilterChart', filterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }

            }
        });
        $.plot('#resultsClusterChart', clusterData, {
            series: {
                pie: {
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
        $.plot('#resultsComputationChart', computationTime, {
            series: {
                pie: {
                    innerRadius: 0.9,
                    show: true
                },
                legend: {
                    show: false
                }
            }
        });
    },
    loadPolygons: function (map) {
        var clusters = GETIOM.clusters;
        var convexHull = new ConvexHullGrahamScan();
        var poly;
        var polyHull;
        var i = 0;
        clusters.forEach(function (cluster) {
            poly = new google.maps.Polygon({
                paths: cluster.map(function (item) {
                    return new google.maps.LatLng(item.lat, item.lon);
                }),
                strokeColor: '#000',
                strokeOpacity: 0.2,
                strokeWeight: 2,
                fillColor: '#000',
                fillOpacity: 0.1
            });


            cluster.forEach(function (message) {
                /*var marker = new google.maps.Marker({
                 position: new google.maps.LatLng(message.location.latitude, message.location.longitude),
                 map: map.getMapInstance()
                 });*/
                convexHull.addPoint(message.location.longitude, message.location.latitude);
            });


            if (convexHull.points.length > 0) {
                var hullPoints = convexHull.getHull();


                //Convert to google latlng objects
                hullPoints = hullPoints.map(function (point) {
                    return new google.maps.LatLng(point.y, point.x);
                });

                console.log(hullPoints);

                polyHull = new google.maps.Polygon({
                    paths: hullPoints,
                    strokeColor: '#000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#000',
                    fillOpacity: 0.35
                });

                polyHull.setMap(map.getMapInstance());
            }
        });
    }
};