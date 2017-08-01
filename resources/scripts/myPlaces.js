var $myPlacesDisplay = $('[data-role="myplaces-display"]');

// Takes myPlaces from local storage and prints information to screen
function displayMyPlaces() {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    var $myPlacesContainer = $('<div></div>', {
        'class': 'places-container',
        'data-role': 'places-container'
    })

    // placeMarkers(myPlaces);
    for (var key in myPlaces) {
        var $place = $('<div></div>', {
        'class': 'place',
        'data-role': 'place',
        'id': key
        });
        appendImages(myPlaces[key]["images"], $place);
        var $address = $('<span></span>', {
            'text': key
        });
        $place.append($address);
        var URI = encodeURI(key);
        var link = "https://maps.google.com?q=" + URI;
        var $directions = $('<a></a>', {
            'target': "_blank", 
            'rel': "noopener noreferrer",
            'href': link,
            'text': 'Directions'
        });

        $place.append($directions);
        var $delete = $('<a></a>', {
            'href': "#",
            'text': "Delete",
            'class': 'delete',
            'data-role': 'delete'
        });
        $place.append($delete);
        $myPlacesContainer.append($place);
    }
    $myPlacesDisplay.append($myPlacesContainer);
}

//Appends images to each div 
function appendImages(dictionary, appendTo) {
    for (var key in dictionary) {
        var $image = $('<img>', {
            'src': dictionary[key]['src'],
            'alt': dictionary[key]['alt'],
            'id': dictionary[key]['id']
        });
    appendTo.append($image);
    }
}

function placeMarkers(obj) {
    var markers = [];
    console.log(obj);
    for (key in obj) {
        var URI = encodeURI(key);
        var link = "https://maps.google.com?q=" + URI;
        var section = "#" + key;
        var content = '<div class="iw-container">' + '<h6>' + key + '</h6>' + '<div class="iw-options">' + '<a target="_blank" rel="noopener noreferrer" href=' + link + '>Directions</a>' +  + '<a href=' + section + 'Show in myPlaces</a></div>' + '</div>';
        var icon = 'resources/images/markiethemarker.png';

        var marker = new google.maps.Marker({
            position: obj[key]["latLon"],
            map: map2,
            icon: icon,
            animation: google.maps.Animation.DROP,
        })
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        
        marker.addListener('click', function() {
            infoWindow.open(map2, marker);
        });
        markers.push(marker);
        marker.setMap(map2);
    }
}

// Deletes clicked element from DOM and localStorage
function deletePlace(element, key) {
    console.log(key);
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    delete myPlaces[key];
    localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    element.remove();
}

// Adds listener to "delete" link
function addDeleteListener() {
    $myPlacesDisplay.on('click', "[data-role='delete']", function(event) {
        event.preventDefault();
        $element = $(event.target.parentNode);
        console.log($element);
        deletePlace($element, $element[0]["id"]);
    })
}

function hidePlacesElements() {
    $SHOW_MAP.hide();
    $EXIT_ICON.hide();
    $MENU_CONTAINER.hide();
    $(".click-to-close").hide();
}

function addPlacesListeners() {
    clickMenuShow();
    clickExitButton();
    clickHideMap();
    clickShowMap();
    addDeleteListener();
}

window.onload = function() {
    hidePlacesElements();
    addPlacesListeners();
    displayMyPlaces();
    initPlacesMap();
}