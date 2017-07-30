
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
var $ICON_BUTTON = $('[data-role="iconButtonpwd"]')

// "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAMpgMQ3JyymBzblKvQn4p8rlAv9Oc_q613EzrWvmkUy_IGYwdJaHEet7sN7aKJRXiUdWRdZh7vp7wcHWXjL8WPrq22PlfX9JzpswrwS-r4bRq7WvQ99wGyjVvZUDkT6sMEhCfmuf4mAkhW91E04hpKbU8GhSLBVRuXF3WE7-KkTPSETcF2msYwg&key=AIzaSyD8UFO6YBOxOpaAG0Q6BUg4iqd_9214ZWY"

// Uses Google API to get latitude and longitude from searched value, sends to photoSearch function to find pictures pased on coordinates
// 1.2
function getGeoCoords(searchValue) {
    var URI = encodeURI(searchValue);
    var resp = $.get(GEOCODE + URI + "&key=" + GOOGLE_API_KEY);
    resp
        .then(photoSearch)
}


// 1.3.1
// Searches Flickr API for images based on latitude and longitude from Google Search, sends pictues to createPicture function
function photoSearch(resp, tags) {
    if ($pictureDisplay.children()) {
        $pictureDisplay.empty();
    }
    // gets tags from checkbox
    var tags = chooseTags();
    console.log(tags)
    // Adds in tags. Tags are essential in the search process,as well as radius units. These aspects will be changed later to get respnoses from the user
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"]+ "&tags=" + tags + "&tag_mode=any&radius=20&radius_units=mi&format=json&nojsoncallback=1");
    resp
        .then(createPicture)
        .then(mapSetCenterSearch)
}

// after photos are set, when photos are clicked on, takes you to that point on map
function mapSetCenterSearch(resp) {
    var latLon = {};
    latLon["lat"] = Number(resp["results"][0]["geometry"]["location"]["lat"]);
    latLon["lng"] = Number(resp["results"][0]["geometry"]["location"]["lng"]);
    map.setZoom(10);
	map.setCenter(latLon);
}

// 1.3.2
// gets what checkboses are checked and value to turn into tags to search Flickrs API
function chooseTags() {
    console.log("working");
    var $checkboxes = $('[data-role=checkbox]');
    var types = [];
    for (var i = 0; i < $checkboxes.length; i++) {
        if ($checkboxes[i].checked) {
            types.push(($checkboxes[i].value) + "%2C+");
        }
    }
    return types;
}

// 1.4
// Creates array from picture search results, creates picture-container div, loops through array, creates picture for each with makePicture function, appends to picture-container div, appends div to DOM
function createPicture(resp) {
    var pictureArray = resp["photos"]["photo"];
    var $pictureContainer = $('<div></div>', {
        'class': 'picture-container',
        'data-role': 'picture-container'
    })
    pictureArray.forEach(function(picture, i) {
        // calls makePicture function
        var $picture = makePicture(picture["farm"], picture["server"], picture["id"], picture["secret"], picture["title"]);
        $pictureContainer.append($picture);
    })
    //appens final picture display to picture container
    $pictureDisplay.append($pictureContainer);
}

// 1.4.2
// Creates DOM picture elements from array of returned photos
function makePicture(farmID, serverID, photoID, secret, title) {
    return $('<img>', {
        'src': "https://farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_m.jpg",
        'alt': title,
        'id': photoID
    })
}


// 1.5
// Creates DOM picture elements from array of returned photos
function makePicture(farmID, serverID, photoID, secret, title) {
    return $('<img>', {
        'src': "https://farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_m.jpg",
        'alt': title,
        'id': photoID
    })
}


// Adds listener to search form, takes search value and gets Google coordinates
// 1.1
function addSearchListener() {
    $searchField.on("submit", function (event) {
        event.preventDefault();
        var searchValue = $('[data-role="search"]').val();
        getGeoCoords(searchValue);
        });
}





// ******************************
// ******************************
// ******************************
// when photo is clicked to get location of photo
// Gets latitude and longitude for clicked pic from Flickr API, then prints to console
function getPicGeo(picture) {
    var picId = picture[0]["attributes"][2]["nodeValue"];
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=" + FLICKR_API_KEY + "&photo_id=" + picId + "&format=json&nojsoncallback=1");
    
    resp
        .then(mapSetCenterPic)
}

// Resets map center when picture is clicked
function mapSetCenterPic(picture) {
    var latLon = {};
    latLon["lat"] = Number(picture["photo"]["location"]["latitude"]);
    latLon["lng"] = Number(picture["photo"]["location"]["longitude"]);
    map.setZoom(12);
	map.setCenter(latLon);
    placePicMarker(latLon);
}

var markers = [];
// Removes all markers from map and places new one when pic clicked
function placePicMarker(latLon) {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    var icon = 'resources/images/markiethemarker.png';
	var marker = new google.maps.Marker({
        position: latLon,
        map: map,
        icon: icon,
        animation: google.maps.Animation.DROP,
    })
    markers.push(marker);
}

// Adds click listener to all images within "picture-display" div, then gets coordinates with getPicGeo function
function addPictureListener() {
    $('[data-role="picture-display"]').on('click', $('img'), function(event) {
    event.preventDefault();
    getPicGeo($(event.target));
    });
}

// Prints the thing
function printIt(thing) {
    console.log(thing);
}
// ******************************
// ******************************
// ******************************


$(window).scroll(function() {
    var targetClass = $(".map-container");
    var a = 30;
    var pos = $(window).scrollTop();
    console.log(a)
    console.log(pos)
    if (pos < a) {
        targetClass.css("top", "50px");
        $(".main-container").css("margin-top", "400px")
        $(".footer-container").css("background", "pink");
        console.log("nope")
    } else {
        targetClass.css("top", "0");
        $(".main-container").css("margin-top", "400px")
        $(".footer-container").css("background", "black");
        console.log("yup")
        
    }
});













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
// index.html carousel
//Carousel control; rotates through jumbotron images
function carouselControl() {
    $(document).ready(function(){
        $('.carousel').slick({
        autoplay: true,
        mobileFirst: true,
        autoplaySpeed: 4000,
        arrows: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        swipeToSlide: true,
        }); 
    });
};



// starts off DOM with exit and menu-container hidden until clicked
$EXIT_ICON.hide();
$MENU_CONTAINER.hide();
// initializes hamburger meniu
clickMenuShow();
clickExitButton();
// initializes search listener for clicking on picture and taking us to that location
addSearchListener();
addPictureListener();
// carousel on landing page
carouselControl();













// ****************************************
//  various ways to get Pictures from FLICKR
// Gets Flickr "place_id" for searched place, uses ID to perform photo search
// function getPlaceId(resp) {
//     var resp = $.get( "https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&format=json&nojsoncallback=1");
//     resp
//         .then(photoSearch)
// }

    // var URITags = encodeURI("nature");
    // var URI = encodeURI("nature" + "landscape" + "air");
    // var URITags = encodeURI("nature")
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&tag=" + URITags + "&format=json&nojsoncallback=1");
    // console.log(resp);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&sort=faves&format=json&nojsoncallback=1");
    // Gets search results by latitude and longitude

    // &radius=20&radius_units=mi

    // Gets results by WOEID/tag
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=" + resp["places"]["place"][0]["woeid"] + "&tags=landmark&format=json&nojsoncallback=1");

    // 
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=&tags=park%2C+nature%2C+landscape%2C+orange&tag_mode=all&sort=interestingness-asc&format=json&nojsoncallback=1");
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&format=json&nojsoncallback=1");
    // console.log(resp);







// ******************************************
// various ways to get things from GOOGLEEEEEE

    // Gets results by WOEID/tag
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=" + resp["places"]["place"][0]["woeid"] + "&tags=landmark&format=json&nojsoncallback=1");

    // 
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&woe_id=&tags=park%2C+nature%2C+landscape%2C+orange&tag_mode=all&sort=interestingness-asc&format=json&nojsoncallback=1");
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&format=json&nojsoncallback=1");
    // console.log(resp);
    // var resp = $.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + resp["results"][0]["geometry"]["location"]["lat"] + "," + resp["results"][0]["geometry"]["location"]["lng"] + "&radius=500&key=" + GOOGLE_API_KEY);
    // console.log(resp);
    // resp
        // .then(storeData)
        // .then(createGooglePic)
        
    // var place = new google.maps.LatLng(Number(resp["results"][0]["geometry"]["location"]["lat"]), Number(resp["results"][0]["geometry"]["location"]["lng"]))
    // var request = {
    //     location: place,
    //     radius: '500'
    // };

    // var search = new google.maps.places.PlacesService(map);
    // search.nearbySearch(request, createPlacesPicture)

//}

// function storeData(resp) {
//     localStorage.setItem('googlePics', JSON.stringify(resp));
//     var parsed = JSON.parse(localStorage.getItem('googlePics'));
//     return parsed;
// }

// function createGooglePic(array) {
//     console.log(array);
//     var resultsArray = array["results"];
//     var $pictureContainer = $('<div></div>', {
//         'class': 'picture-container',
//         'data-role': 'picture-container'
//     })
//     resultsArray.forEach(function(picture) {
//         console.log(picture);
//         var $picture = makeGooglePic([picture]["photos"][0]["photo_reference"], picture["name"], picture["id"], picture["geometry"]["location"]);
//         $pictureContainer.append($picture);
//     })
//     $pictureDisplay.append($pictureContainer);
// }

// function makeGooglePic(reference, title, photoID, location) {
//     return $('<img>', {
//         'src': "https://maps.googleapis.com/maps/api/place/photo?maxwidth=240&photoreference=" + reference + "&key=" + GOOGLE_API_KEY,
//         'alt': title,
//         'id': photoID,
//         'location': location
//     })
// }










// URI encoder for tags
// var URITags = encodeURI("nature")
    // var URI = encodeURI(searchValue);
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&text=" + URI + "&tag=" + URITags + "&format=json&nojsoncallback=1");
    // var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"] + "&sort=faves&format=json&nojsoncallback=1");
    // Gets search results by latitude and longitude