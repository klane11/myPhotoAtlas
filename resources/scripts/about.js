// Initializes all functions needed for page after document loads
function hideAboutElements() {
    $SHOW_MAP.hide();
    $EXIT_ICON.hide();
    $MENU_CONTAINER.hide();
    $(".click-to-close").hide();
}

function addAboutListeners() {
    clickMenuShow();
    clickExitButton();
    clickHideMap();
    clickShowMap();
}
// allows document to load before functions are called
$(document).ready(function() {
    hideAboutElements();
    addAboutListeners();
});