var $mainMap = $('[data-role="main-map"]');
var $searchField = $('[data-role="search-form"]');
var GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var GOOGLE_API_KEY = "AIzaSyD8UFO6YBOxOpaAG0Q6BUg4iqd_9214ZWY";


function getGeoCoords(searchValue) {
    var formattedSearchValue = searchValue.split(' ');
    formattedSearchValue = formattedSearchValue.join("+");
    var req = $.get(GEOCODE + formattedSearchValue + "&key=" + GOOGLE_API_KEY);
    console.log(req);
}

// var map;
// function initMap() {
//     map = new google.maps.Map(document.getElementById('main-map'), {
//         center: {lat: 40.0000, lng: -98.0000},
//         zoom: 4
//     });
// }

function addSearchListener() {
    $searchField.on("submit", function (event) {
        event.preventDefault();
        var searchValue = $('[data-role="search"]').val();
        getGeoCoords(searchValue);
    });
}

// initMap();
addSearchListener();


