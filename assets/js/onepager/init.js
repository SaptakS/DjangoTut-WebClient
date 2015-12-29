(function ($) {
    "use strict";
    var $devicewidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    $(document).ready(function () {
        if ($().pageScroller) {

            if($devicewidth < 768){
                $('body').pageScroller({
                    navigation: '.ct-menuMobile .onepage', sectionClass: 'section', scrollOffset: 0
                });
            } else{
                $('body').pageScroller({
                    navigation: '.nav.navbar-nav .onepage', sectionClass: 'section', scrollOffset: -58
                });
            }
        }
    })
})(jQuery);