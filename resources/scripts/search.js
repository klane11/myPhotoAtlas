// Initializes all functions needed for page after document loads
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
    initMap();
    hideElements();
    addListeners();
    createMyPlaces();
}

$(document).ready(function() {
    main();
});