// Creates map

function initMap() {
    var map = new google.maps.Map(document.getElementById('main-map'), {
        center: {lat: 40.0000, lng: -98.0000},
        zoom: 4
    });
}

initMap();