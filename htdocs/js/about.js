/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */

(function ($) {
  var SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.ABOUT = function () {
    var _init = function _init() {
      _waypoint.init();
      objectFitImages();
    };

    var _waypoint = function () {
      var $target = $('.js-waypointTarget');

      var _init = function _init() {
        _scroll();
      };

      var _scroll = function _scroll() {

        $target.waypoint(function (direction) {
          var activePoint = $(this.element);
          activePoint.addClass('is-active');
        }, { offset: '85%' });
      };

      return {
        init: _init
      };
    }();

    return {
      init: _init
    };
  }();

  SECONDSTREET.ABOUT.init();
})(jQuery);