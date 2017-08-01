// Initializes all functions needed for page after document loads
// starts off DOM with exit and menu-container hidden until clicked
function hideElements() {
    $SHOW_MAP.hide();
    $EXIT_ICON.hide();
    $MENU_CONTAINER.hide();
    $(".click-to-close").hide();
}

// Adds autocomplete from Google Places library
function autocomplete() {
    var input = document.getElementById('srch-term');
    var autocomplete = new google.maps.places.Autocomplete(input);
}

// initializes all listeners
function addListeners() {
    clickMenuShow();
    clickExitButton();
    clickHideMap();
    clickShowMap();
    addSearchListener();
    addPictureListener();
    google.maps.event.addDomListener(window, 'load', autocomplete);
}

// Calls all init functions
function main() {
    initMap();
    hideElements();
    addListeners();
    createMyPlaces();
}

$(document).ready(function() {
    main();
});