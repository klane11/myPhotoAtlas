var $myPlacesDisplay = $('[data-role="myplaces-display"]');

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
    })
        $place.append(myPlaces[key]);
        $address = $('<span></span>', {
            'text': key
        })
        $place.append($address);
        $myPlacesContainer.append($place);
    }
    $myPlacesDisplay.append($myPlacesContainer);
}

displayMyPlaces();