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
var $errorDisplay = $('[data-role="error-display"]');

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

// Creates error message function
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
function photoSearch(latLon) {

    // gets radius, units and tags
    var radius = getRadius();
    var units = getUnits();
    var tags = chooseTags();

    //Creates error function w/message to be returned if no pictures found
    var errorPics = errorMessage('No pictures were found for this location, radius, and tags, please try your search again.');

    // Adds in tags. Tags are essential in the search process,as well as radius units. These aspects will be changed later to get respnoses from the user
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + FLICKR_API_KEY + "&lat=" + latLon["lat"] + "&lon=" + latLon["lng"]+ "&tags=" + tags + "&tag_mode=any&radius=" + radius + "&radius_units=" + units + "&format=json&nojsoncallback=1");
   
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
    return latLon;
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
    var errorPicGeo = errorMessage('The location of this photo is not specified. Please choose another photo.');
    var picId = picture[0]["id"];
    var picInfo = {};
    picInfo["src"] = picture[0]["currentSrc"];
    picInfo["alt"] = picture[0]["alt"];
    picInfo["id"] = picId;
    var resp = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=" + FLICKR_API_KEY + "&photo_id=" + picId + "&format=json&nojsoncallback=1");
    
    resp
        .catch(function() {
            errorPicGeo(error);
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        })
        .then(function(resp) {
            mapSetCenterPic(resp, picInfo);
        })
}

// Resets map center when picture is clicked
function mapSetCenterPic(resp, picInfo) {
    var latLon = {};
    latLon["lat"] = Number(resp["photo"]["location"]["latitude"]);
    latLon["lng"] = Number(resp["photo"]["location"]["longitude"]);
    map.setZoom(11);
	map.setCenter(latLon);
    reverseGeoCode(latLon, picInfo);
}

// Takes latitude and longitude, obtains address
function reverseGeoCode(latLon, picInfo) {
    var errorReverseGeo = errorMessage("The location of this photo is not specified. Please choose another photo.");
    var resp = $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLon["lat"] + "," + latLon["lng"] + "&key=" + GOOGLE_API_KEY);
    
    resp
        .catch(function() {
            errorReverseGeo(error);
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        })
        
        .then(function(resp) {
            placePicMarker(latLon, resp, picInfo);
        })
}

function checkMyPlaces(address, picInfo) {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    var id = picInfo["id"];
    if (myPlaces[address] === undefined) {
        return "<span data-role='save' class='save'>Add to myPlaces</span>"
    } else if (myPlaces[address]["images"][id] === undefined) {
        return "<span data-role='save' class='save'>Add to myPlaces</span>";
    } else {
        return "<span data-role='saved' class='saved'>\u2713Saved to myPlaces</span>";
    }
}

// If no address data found, returns latitude and longitude formatted for GoogleMaps search query
function searchCheck(address, latLon) {
    if (address === "No address data found for this picture.") {
        return encodeURI(latLon["lat"] + "," + latLon["lng"]);
    } else {
        return encodeURI(address);
    }
}

// Removes all markers from map and places new one when pic clicked
var markers = [];
function placePicMarker(latLon, resp, picInfo) {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    var formatted_address = checkAddress(resp);
    var URI = searchCheck(formatted_address, latLon);
    var link = "https://maps.google.com?q=" + URI;
    var save = checkMyPlaces(formatted_address, picInfo);
    var content = '<div class="iw-container">' + '<h6>' + formatted_address + '</h6>' + '<div class="iw-options">' + '<a target="_blank" rel="noopener noreferrer" href=' + link + '>Directions</a>' + save + '</div>' + '</div>';
    var icon = 'resources/images/markiethemarker.png';

	var marker = new google.maps.Marker({
        position: latLon,
        map: map,
        icon: icon,
        animation: google.maps.Animation.DROP,
    })
    map.setZoom(12);
    var infoWindow = new google.maps.InfoWindow({
        content: content
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    markers.push(marker);
    marker.setMap(map);
    
    google.maps.event.addListener(infoWindow, 'domready', function() {
        if (document.querySelector('[data-role="save"]')) {
            document.querySelector('[data-role="save"]').addEventListener("click", function handler(e) {
                e.preventDefault();
                this.textContent = '\u2713Saved to myPlaces';
                this.setAttribute('data-role', 'saved');
                this.setAttribute('class', 'saved');
                addPlace(formatted_address, picInfo, latLon);
                e.currentTarget.removeEventListener('click', handler);
            });
        }
    });
}

function addPlace(address, picInfo, latLon) {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    var id = picInfo["id"]
    if (myPlaces[address] === undefined) {
        myPlaces[address] = {};
        myPlaces[address]["latLon"] = latLon;
        myPlaces[address]["images"] = {};

    } else if (myPlaces[address]["images"] === undefined) {
        myPlaces[address]["images"] = {};
    }

    myPlaces[address]["images"][id] = picInfo;
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
    var results = resp["results"];
    if (results.length > 0) { 
        var add = results[0]["formatted_address"];
        if (add !== undefined) {
            return add;
        } else {
            return "No address data found for this picture.";
        }
    } else {
       return "No address data found for this picture.";
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
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        var searchValue = $('[data-role="search"]').val();
        getGeoCoords(searchValue);
    });
}

// Adds click listener to all images within "picture-display" div, then gets coordinates with getPicGeo function
function addPictureListener() {
    $pictureDisplay.on('click', 'img', function(event) {
        event.preventDefault();
         if ($errorDisplay.children()) {
            $errorDisplay.empty();
        }
        getPicGeo($(event.target));
        $('[data-images-role="hide-map"]').show();
        $('[data-images-role="show-map"]').hide();
        $(".click-to-close").hide();
        $(".click-to-open").show();
        $(".map-banner-container").slideDown(1000);
    });
}

// Prints the thing
function printIt(thing) {
    console.log(thing);
}

// ******************************
// *******REACTIVE MENUS*********
// ******************************
function clickShowMap() {
    $SHOW_MAP.click(function () {
        $('[data-images-role="hide-map"]').show();
        printIt($(this));
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
        $(".myAtlas-logo").hide("slow");
        $MENU_CONTAINER.show("slow");
    });
}
// when exit icon is clicked, the exit icon hids, the hamburger menu shows, and the menu-container hids slowly
function clickExitButton() {
    $EXIT_ICON.click(function () {
        $HAMBURGER.show();
        $(this).hide();
        $(".myAtlas-logo").show("slow");
        $MENU_CONTAINER.hide("slow");
    });

}