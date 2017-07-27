var $mainMap = $('[data-role="main-map"]');

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('main-map'), {
        center: {lat: 40.0000, lng: -98.0000},
        zoom: 4
    });
}

initMap();


function addSearchListener() {
    $searchField.submit(function (event){
        event.preventDefault();
        var searchValue = $('[data-role="search"]').val();
        console.log(searchValue);
        getGeoCoords(searchValue);
    })
}