// html data roles
var $mainMap = $('[data-role="main-map"]');
var $searchField = $('[data-role="search-form"]');
var GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var GOOGLE_API_KEY = "AIzaSyD8UFO6YBOxOpaAG0Q6BUg4iqd_9214ZWY";
var FLICKR_API_KEY = "566ab7296356eb73e65e0d7f80743bde";
var $pictureDisplay = $('[data-role="picture-display"]');
var $MENU_CONTAINER = $('[data-text-role="menu"]');
var $EXIT_ICON = $('[data-image-role="exit-container"]');
var $HAMBURGER = $('[data-image-role="hamburger"]');
var $ICON_BUTTON = $('[data-role="iconButtonpwd"]');
var $HIDE_MAP = $('[data-images-role="hide-map"]');
var $SHOW_MAP = $('[data-images-role="show-map"]');
var $errorDisplay = $('[data-role="error-display"]')

// Uses Google API to get latitude and longitude from searched value, sends to photoSearch function to find pictures pased on coordinates
// 1.2
function getGeoCoords(searchValue) {
    var URI = encodeURI(searchValue);
    var errorCoords = errorMessage('No coordinates were found for this location, please try your search again.');
    var resp = $.get(GEOCODE + URI + "&key=" + GOOGLE_API_KEY);
    resp
        .catch(errorCoords)
        .then(mapSetCenterSearch)
        .then(photoSearch)
}

function errorMessage(message) {
    return function(error) {
        var $errorDiv = $('<div></div', {
            'text': message,
            'class': 'error-message'
        })
        $errorDisplay.append($errorDiv);
    }
}

// 1.3.1
// Searches Flickr API for images based on latitude and longitude from Google Search, sends pictues to createPicture function
function photoSearch(resp) {

    // gets radius, units and tags
    var radius = getRadius();
    var units = getUnits();
    var tags = chooseTags();

    //Creates error function w/message to be returned if no pictures found
    var errorPics = errorMessage('No pictures were found for this location, radius, and tags, please try your search again.');

    // Adds in tags. Tags are essential in the search process,as well as radius units. These aspects will be changed later to get respnoses from the user
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + resp["results"][0]["geometry"]["location"]["lat"] + "&lon=" + resp["results"][0]["geometry"]["location"]["lng"]+ "&tags=" + tags + "&tag_mode=any&radius=" + radius + "&radius_units=" + units + "&format=json&nojsoncallback=1");
   
    resp
        .catch(errorPics)
        .then(checkForPics)
}

// after photos are set, when photos are clicked on, takes you to that point on map
function mapSetCenterSearch(resp) {
    var latLon = {};
    latLon["lat"] = Number(resp["results"][0]["geometry"]["location"]["lat"]);
    latLon["lng"] = Number(resp["results"][0]["geometry"]["location"]["lng"]);
    map.setZoom(10);
    map.setCenter(latLon);
    return resp;
}

// Checks to see if returned response contains pictures
function checkForPics(resp) {
    var pictureArray = resp["photos"]["photo"];
    if (pictureArray.length > 0) {
        createPicture(pictureArray);
    } else {
        var $errorDiv = $('<div></div', {
            'text': 'No pictures were found for this location, radius, and tags, please try your search again.',
            'class': 'error-message'
        })
        $errorDisplay.append($errorDiv);
    }
}

// 1.3.2
// gets what checkboxes are checked and value to turn into tags to search Flickrs API
function chooseTags() {
    var $checkboxes = $('[data-role=checkbox]');
    var types = [];
    for (var i = 0; i < $checkboxes.length; i++) {
        if ($checkboxes[i].checked) {
            types.push(($checkboxes[i].value) + "%2C+");
        }
    }
    return types;
}

// 1.3.3
//gets radius user inputs
function getRadius() {
    var $radiusChoosen = $('[data-input="radius"]');
    console.log($radiusChoosen.val())
    if ($radiusChoosen.val() === "Radius"){
        $radiusChoosen = 20;
    } else {
        $radiusChoosen = $radiusChoosen.val();
    }
    return  $radiusChoosen;
}

//1.3.4
// get units of miles or kelometers. miles is default
function getUnits() {
    var $units = $('[data-input="units"]');
    return $units.val();
}

// 1.4
// Creates array from picture search results, creates picture-container div, loops through array, creates picture for each with makePicture function, appends to picture-container div, appends div to DOM
function createPicture(pictureArray) {
    var $pictureContainer = $('<div></div>', {
        'class': 'picture-container',
        'data-role': 'picture-container'
    })
    pictureArray.forEach(function(picture, i) {
        // calls makePicture function
        var $pictureDiv = $('<div></div>', {
            "class" : "picture-box"
        });
        var $picture = makePicture(picture["farm"], picture["server"], picture["id"], picture["secret"], picture["title"]);
        $pictureDiv.append($picture)
        $pictureContainer.append($pictureDiv);
    })
    //appens final picture display to picture container
    $pictureDisplay.append($pictureContainer);
}

// 1.4.2
// Creates DOM picture elements from array of returned photos
function makePicture(farmID, serverID, photoID, secret, title) {
    return $('<img>', {
        'src': "https://farm" + farmID + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_z.jpg",
        'alt': title,
        'id': photoID
    });
}


// ******************************
// ******************************
// ******************************


// when photo is clicked to get location of photo
// Gets latitude and longitude for clicked pic from Flickr API
function getPicGeo(picture) {
    var errorPicGeo = errorMessage('The location of this photo is not specified. Please click another photo.');
    var picId = picture[0]["attributes"][2]["nodeValue"];
    var picInfo = {};
    picInfo["src"] = picture[0]["attributes"][0]["nodeValue"];
    picInfo["alt"] = picture[0]["attributes"][1]["nodeValue"];
    picInfo["id"] = picId;
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=" + FLICKR_API_KEY + "&photo_id=" + picId + "&format=json&nojsoncallback=1");
    
    resp
        .then(function(resp) {
            mapSetCenterPic(resp, picInfo);
        })
}

// Resets map center when picture is clicked
function mapSetCenterPic(resp, picInfo) {
    var latLon = {};
    latLon["lat"] = Number(resp["photo"]["location"]["latitude"]);
    latLon["lng"] = Number(resp["photo"]["location"]["longitude"]);
    map.setZoom(12);
	map.setCenter(latLon);
    reverseGeoCode(latLon, picInfo);
}

// Takes latitude and longitude, obtains address
function reverseGeoCode(latLon, picInfo) {
    var resp = $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLon["lat"] + "," + latLon["lng"] + "&key=" + GOOGLE_API_KEY);
    resp
        
        .then(function(resp) {
            placePicMarker(latLon, resp, picInfo);
        })
        .catch(function(error) {
            console.log(error);
        })
}

function checkMyPlaces(address) {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    if (myPlaces[address] !== undefined) {
        return "<span data-role='saved' class='saved'>\u2713Saved to myPlaces</span>";
    } else {
        return "<span data-role='save' class='save'>Add to myPlaces</span>";
    }
}

var markers = [];
// Removes all markers from map and places new one when pic clicked
function placePicMarker(latLon, resp, picInfo) {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });

    var formatted_address = checkAddress(resp);
    var URI = encodeURI(formatted_address);
    var link = "https://maps.google.com?q=" + URI;
    var save = checkMyPlaces(formatted_address);
    var content = '<div class="iw-container">' + '<h6>' + formatted_address + '</h6>' + '<div class="iw-options">' + '<a target="_blank" rel="noopener noreferrer" href=' + link + '>Directions</a>' + save + '<a href=' + link + + '</div>' + '</div>';
    var icon = 'resources/images/markiethemarker.png';

	var marker = new google.maps.Marker({
        position: latLon,
        map: map,
        icon: icon,
        animation: google.maps.Animation.DROP,
    })
    var infoWindow = new google.maps.InfoWindow({
        content: content
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    markers.push(marker);
    
    google.maps.event.addListener(infoWindow, 'domready', function() {
        if (document.querySelector('[data-role="save"]')) {
            document.querySelector('[data-role="save"]').addEventListener("click", function handler(e) {
                e.preventDefault();
                this.textContent = '\u2713Saved to myPlaces';
                this.setAttribute('data-role', 'saved');
                this.setAttribute('class', 'saved');
                console.log(this.getAttribute('data-role'));
                addPlace(formatted_address, picInfo);
                e.currentTarget.removeEventListener('click', handler);
            });
        }
    });
}

function addPlace(address, picInfo) {
    console.log(picInfo);
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    myPlaces[address] = picInfo;
    localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
}

function createMyPlaces() {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    if (myPlaces) {
        localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    } else {
        myPlaces = {};
        localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    }
}

// Check to see if address exists in reverseGeoCode response
function checkAddress(resp) {
    var add = resp["results"][0]["formatted_address"];
    if (add !== undefined) {
        return add;
    } else {
        return "No address data found for this picture."
    }
}

// Adds listener to search form, takes search value and gets Google coordinates
// 1.1
function addSearchListener() {
    $searchField.on("submit", function (event) {
        event.preventDefault();
        if ($pictureDisplay.children()) {
            $pictureDisplay.empty();
        }
        if ($errorDisplay.children()) {
            $errorDisplay.empty();
        }
        var searchValue = $('[data-role="search"]').val();
        getGeoCoords(searchValue);
    });
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
// *******HAMBURGER MENU*********
// ******************************

function clickShowMap() {
    $SHOW_MAP.click(function () {
        $('[data-images-role="hide-map"]').show();
        $(this).hide();
        $(".click-to-close").hide();
        $(".click-to-open").show();
        $(".map-banner-container").slideDown(1000);
    });
}

function clickHideMap() {
    $HIDE_MAP.click(function () {
        $('[data-images-role="show-map"]').show();
        $(this).hide();
        $(".click-to-close").show();
        $(".click-to-open").hide();
        $(".map-banner-container").slideUp(1000);
    });
}

// when hamburger menu icon is clicked, the hamburger icon hids, the exit icon shows and the menu-container shows slowly
function clickMenuShow() {
    $HAMBURGER.click(function () {
        $EXIT_ICON.show();
        $(this).hide();
        // $(".map-container").css("left", "170px");
        $MENU_CONTAINER.show("slow");
    });
}
// when exit icon is clicked, the exit icon hids, the hamburger menu shows, and the menu-container hids slowly
function clickExitButton() {
    $EXIT_ICON.click(function () {
        $HAMBURGER.show();
        $(this).hide();
        // $(".map-container").css("left", "0");
        $MENU_CONTAINER.hide("slow");
    });
}

// ******************************
// *****INDEX.HTML CAROUSEL******
// ******************************

//Carousel control; rotates through jumbotron images
function carouselControl() {
    $(document).ready(function(){
        $('.carousel').slick({
        autoplay: true,
        mobileFirst: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        swipeToSlide: true,
        }); 
    });
}


// starts off DOM with exit and menu-container hidden until clicked
function hideElements() {
    $SHOW_MAP.hide();
    $EXIT_ICON.hide();
    $MENU_CONTAINER.hide();
    $(".click-to-close").hide();
}

// initializes all listeners
function addListeners() {
    clickMenuShow();
    clickExitButton();
    clickHideMap();
    clickShowMap();
    addSearchListener();
    addPictureListener();
}

// Calls all init functions
function main() {
    hideElements();
    addListeners();
    createMyPlaces();
    carouselControl();
}

main();












// ****************************************
// $(window).scroll(function() {
//     var targetClass = $(".map-container");
//     var a = 30;
//     var pos = $(window).scrollTop();
//     if (pos < a) {
//         targetClass.css("top", "50px", "z-index", "1");
//         // $(".main-container").css("margin-top", "400px")
//     } else {
//         targetClass.css("top", "0", "z-index", "1");
//         // $(".main-container").css("margin-top", "400px")
        
//     }
// });
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