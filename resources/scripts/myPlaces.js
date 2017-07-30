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
        var $image = $('<img>', {
            'src': myPlaces[key]['src'],
            'alt': myPlaces[key]['alt'],
            'id': myPlaces[key]['id']
        })
        $place.append($image);
        $address = $('<span></span>', {
            'text': key
        });
        $place.append($address);
        $myPlacesContainer.append($place);
    }
    $myPlacesDisplay.append($myPlacesContainer);
}

displayMyPlaces();