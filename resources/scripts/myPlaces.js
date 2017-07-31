var $myPlacesDisplay = $('[data-role="myplaces-display"]');

// Takes myPlaces from local storage and prints information to screen
function displayMyPlaces () {
    var myPlaces = JSON.parse(localStorage.getItem('myPlaces'));
    var $myPlacesContainer = $('<div></div>', {
        'class': 'places-container',
        'data-role': 'places-container'
    })
    for (var key in myPlaces) {
        var $place = $('<div></div>', {
        'class': 'place',
        'data-role': 'place'
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
}

// Adds listener to "delete" link
function addDeleteListener() {
    $myPlacesDisplay.on('click', "[data-role='delete']", function(event) {
    event.preventDefault();
    $element = $(event.target.parentNode);
    deletePlace($element, $element[0]["childNodes"][1]["innerText"]);
    })
}

addDeleteListener();
displayMyPlaces();