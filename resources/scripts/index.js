//Carousel control; rotates through jumbotron images
function carouselControl() {
    $(document).ready(function(){
        $('.carousel').slick({
        autoplay: true,
        mobileFirst: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        swipeToSlide: true,
        }); 
    });
}

function hideIndexElements() {
    $SHOW_MAP.hide();
    $EXIT_ICON.hide();
    $MENU_CONTAINER.hide();
    $(".click-to-close").hide();
}

function addIndexListeners() {
    clickMenuShow();
    clickExitButton();
    clickHideMap();
    clickShowMap();
}

window.onload = function() {
    hideIndexElements();
    addIndexListeners();
    carouselControl();
}