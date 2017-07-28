
// html data roles
var $mainMap = $('[data-role="main-map"]');
var $searchField = $('[data-role="search-form"]');
var GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var GOOGLE_API_KEY = "AIzaSyD8UFO6YBOxOpaAG0Q6BUg4iqd_9214ZWY";
var FLICKR_API_KEY = "566ab7296356eb73e65e0d7f80743bde";
var $pictureDisplay = $('[data-role="picture-display"]');
var $MENU_CONTAINER = $('[data-text-role="menu"]')
var $EXIT_ICON = $('[data-image-role="exit-container"]')
var $HAMBURGER = $('[data-image-role="hamburger"]')
var $ICON_BUTTON = $('[data-role="iconButton"]')


// Uses Google API to get latitude and longitude from searched value, sends to photoSearch function to find pictures pased on coordinates
function getGeoCoords(searchValue) {
    var URI = encodeURI(searchValue);
    var resp = $.get(GEOCODE + URI + "&key=" + GOOGLE_API_KEY);
    resp
        .then(photoSearch)
}

// Creates DOM picture elements from array of returned photos
function makePicture(farmID, serverID, photoID, secret, title) {
    return $('<img>', {
        'src': "https://farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_m.jpg",
        'alt': title,
        'id': photoID
    })
}

// Searches Flickr API for images based on latitude and longitude from Google Search, sends pictues to createPicture function
function photoSearch(resp) {
    if ($pictureDisplay.children()) {
        $pictureDisplay.empty();
    }

    // var URITags = encodeURI("nature")
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&tag=" + URITags + "&format=json&nojsoncallback=1");
    // console.log(resp);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&sort=faves&format=json&nojsoncallback=1");
    // Gets search results by latitude and longitude
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&radius=20&radius_units=mi&format=json&nojsoncallback=1");
    // &radius=20&radius_units=mi

    // Gets results by WOEID/tag
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=" + resp["places"]["place"][0]["woeid"] + "&tags=landmark&format=json&nojsoncallback=1");

    // 
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=&tags=park%2C+nature%2C+landscape%2C+orange&tag_mode=all&sort=interestingness-asc&format=json&nojsoncallback=1");
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&format=json&nojsoncallback=1");
    // console.log(resp);

    resp
        .then(createPicture)
}

// Creates array from picture search results, creates picture-container div, loops through array, creates picture for each with makePicture function, appends to picture-container div, appends div to DOM
function createPicture(resp) {
    var pictureArray = resp["photos"]["photo"];
    var $pictureContainer = $('<div></div>', {
        'class': 'picture-container',
        'data-role': 'picture-container'
    })
    pictureArray.forEach(function(picture, i) {
        var $picture = makePicture(picture["farm"], picture["server"], picture["id"], picture["secret"], picture["title"]);
        $pictureContainer.append($picture);
    })
    $pictureDisplay.append($pictureContainer);
}

// Gets Flickr "place_id" for searched place, uses ID to perform photo search
// function getPlaceId(resp) {
//     var resp = $.get( "https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&format=json&nojsoncallback=1");
//     resp
//         .then(photoSearch)
// }

// Adds listener to search form, takes search value and gets Google coordinates
function addSearchListener() {
    $searchField.on("submit", function (event) {
        event.preventDefault();
        var searchValue = $('[data-role="search"]').val();
        // getGeoCoords(searchValue);
        getGeoCoords(searchValue);
    });
}


// Gets latitude and longitude for clicked pic from Flickr API, then prints to console
function getPicGeo(picture) {
    var picId = picture[0]["attributes"][2]["nodeValue"];
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=" + FLICKR_API_KEY + "&photo_id=" + picId + "&format=json&nojsoncallback=1");
    
    resp
        .then(mapSetCenter)
}

// Resets map center when picture is clicked
function mapSetCenter(picture) {
    var latLon = {};
    latLon["lat"] = Number(picture["photo"]["location"]["latitude"]);
    latLon["lng"] = Number(picture["photo"]["location"]["longitude"]);
    console.log(latLon);
    map.setZoom(12);
	map.setCenter(latLon);
}

// Adds click listener to all images within "picture-display" div, then gets coordinates with getPicGeo function
function addPictureListener() {
    $('[data-role="picture-display"]').on('click', $('img'), function(event) {
    event.preventDefault();
    getPicGeo($(event.target));
})
   
}

// Prints the thing
function printIt(thing) {
    console.log(thing);
}




addSearchListener();
addPictureListener();
// photoSearch("33.7876133", "-84.3734643")
// initMap();



// when hamburger menu icon is clicked, the hamburger icon hids, the exit icon shows and the menu-container shows slowly
function clickMenuShow(){
    $HAMBURGER.click(function (){
        $EXIT_ICON.show();
        $(this).hide();
        $MENU_CONTAINER.show("slow")
    });
}

// when exit icon is clicked, the exit icon hids, the hamburger menu shows, and the menu-container hids slowly
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


// starts off DOM with exit and menu-container hidden until clicked

$EXIT_ICON.hide();
$MENU_CONTAINER.hide();
// initializes hamburger meniu
clickMenuShow();
clickExitButton();
addSearchListener();
addPictureListener();


