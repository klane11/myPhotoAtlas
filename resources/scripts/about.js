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

$(document).ready(function() {
    hideAboutElements();
    addAboutListeners();
});