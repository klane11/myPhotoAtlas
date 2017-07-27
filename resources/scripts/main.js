
var $mainMap = $('[data-role="main-map"]');
var $searchField = $('[data-role="search-form"]');
var GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var GOOGLE_API_KEY = "AIzaSyD8UFO6YBOxOpaAG0Q6BUg4iqd_9214ZWY";
var FLICKR_API_KEY = "566ab7296356eb73e65e0d7f80743bde";
var $pictureDisplay = $('[data-role="picture-display"]');

// html data roles
var $MENU_CONTAINER = $('[data-text-role="menu"]')
var $EXIT_ICON = $('[data-image-role="exit-container"]')
var $HAMBURGER = $('[data-image-role="hamburger"]')
var $ICON_BUTTON = $('[data-role="iconButton"]')





function getGeoCoords(searchValue) {
    var formattedSearchValue = searchValue.split(' ');
    formattedSearchValue = formattedSearchValue.join("+");
    var req = $.get(GEOCODE + formattedSearchValue + "&key=" + GOOGLE_API_KEY);
    console.log(req);
}

function makePicture (farmID, serverID, photoID, secret, title) {
    return $('<img>', {
        'src': "https://farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_m.jpg",
        'alt': title
    })
}


function photoSearch (lat, long) {
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + lat + "&lon=" + long + "&format=json&nojsoncallback=1");
    resp
        .then(createPicture)
}


function createPicture(resp) {
    console.log(resp);
    var pictureArray = resp["photos"]["photo"];
    console.log(pictureArray);
    var $pictureContainer = $('<div></div>', {
        'class': 'picture-container'
    })
    pictureArray.forEach(function(picture, i) {
        var $picture = makePicture(picture["farm"], picture["server"], picture["id"], picture["secret"], picture["title"]);
        $pictureContainer.append($picture);
    })
    $pictureDisplay.append($pictureContainer);
}


// function getPlaceId(lat, lon) {
//     var req = $.get( " https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=" + FLICKR_API_KEY + "&lat=" + lat + "&lon=" + lon + "&format=json&nojsoncallback=1&api_sig=58d68ecd1670fc8a4e904bef1d4e7f7a")
// }

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




function clickMenuShow(){
    $HAMBURGER.click(function (){
        $EXIT_ICON.show();
        $(this).hide();
        $MENU_CONTAINER.show("slow")
    });
}

function clickExitButton(){
    $EXIT_ICON.click(function (){
        $HAMBURGER.show();
        $(this).hide();
        $MENU_CONTAINER.hide("slow");
    });
}


// $MENU_CONTAINER.toggleClass('.menu-container', '.menu-container-on');
// $HAMBURGER.toggleClass('.hamburger', '.icon');
// $EXIT_ICON.toggleClass('.icon', '.exit');

// initMap();
addSearchListener();
// photoSearch("33.7876133", "-84.3734643")
$EXIT_ICON.hide();
$MENU_CONTAINER.hide();

clickMenuShow();
clickExitButton();
