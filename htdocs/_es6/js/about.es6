/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */


(function($) {
  const SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.ABOUT = function() {
    // 初期化
    const _init = function() {
      _waypoint.init();
      objectFitImages();
    };

    const _waypoint = function() {
      const $target = $('.js-waypointTarget');

      const _init = () => {
        _scroll();
      };

      const _scroll = () => {

        $target.waypoint(function(direction){
          let activePoint = $(this.element);
          activePoint.addClass('is-active');
        },{offset : '85%'});

      };

      return {
        init: _init
      }
    }();



   return {
    init: _init
  };
}();

SECONDSTREET.ABOUT.init();
})(jQuery);