var $myPlacesDisplay = $('[data-role="myplaces-display"]');
var $errorPlacesDisplay = $('[data-role="error-places-display"]');

// Takes out spaces and commas from address if we want to use it for id
function stringMaker(string) {
    var arr = string.split(' ');
    var key2 = arr.join('');
    var key2 = key2.replace(/,/g, '');
    return key2;
}

// Displays error message if user has not yet saved any places
function noPlaces(message) {
    var $errorDiv = $('<div></div', {
        'class': 'error-places-message'
    })
    var $span = $('<span></span>', {
        'text': "You have not saved any locations! Please navigate back to the "
    })
    $errorDiv.append($span);
    var $link = $('<a></a>', {
        'href': 'search.html',
        'text': 'Search'
    })
    $errorDiv.append($link);
    $span = $('<span></span>', {
        'text': " page to explore locations and add them to myPlaces."
    })
    $errorDiv.append($span);
    $errorPlacesDisplay.append($errorDiv);
}

// Displays error message if user has not yet saved any places
function checkPlaces() {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    if (Object.keys(myPlaces).length !== 0 && myPlaces !== null) {
        displayMyPlaces(myPlaces);
    } else {
        noPlaces();
    }
}

// Takes myPlaces from local storage and prints information to screen
function displayMyPlaces(myPlaces) {
    var $myPlacesContainer = $('<div></div>', {
        'class': 'places-container',
        'data-role': 'places-container'
    })
    
    for (var key in myPlaces) {
        var id = stringMaker(key);
        var $place = $('<div></div>', {
        'class': 'place',
        'data-role': 'place',
        'name': key,
        'id': id
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

// Deletes clicked element from DOM and localStorage
function deletePlace(element, key) {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    delete myPlaces[key];
    localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    element.remove();
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    initPlacesMap(myPlaces);
}

// Adds listener to "delete" link
function addDeleteListener() {
    $myPlacesDisplay.on('click', "[data-role='delete']", function(event) {
        event.preventDefault();
        $element = $(event.target.parentNode);
        deletePlace($element, $element[0]["attributes"][2]['nodeValue']);
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

// Initializes all functions needed for page after document loads
$(document).ready(function() {
    hidePlacesElements();
    addPlacesListeners();
    checkPlaces();
    initPlacesMap();
});