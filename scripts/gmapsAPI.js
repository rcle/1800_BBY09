

function reccARestaurant(){
    navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    findNearby(position.coords.latitude, position.coords.longitude);
});
}
function findNearby(latitude, longitude) {
    var sydney = new google.maps.LatLng(latitude,longitude);
    map = new google.maps.Map(
        document.getElementById('map'), {center: sydney, zoom: 15});
    var request = {
        location: sydney,
        radius: '500',
        type: ['restaurant']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
        }
    }
}
