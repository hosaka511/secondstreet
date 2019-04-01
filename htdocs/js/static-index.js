/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */

(function ($) {
  var SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.STATICINDEX = function () {
    var _init = function _init() {
      _faqAccordion.init();
    };

    var _faqAccordion = function () {
      var $openBtn = $('.js-answerTrigger').find('dt');
      var nowID = localStorage.getItem('openID');

      var _init = function _init() {
        $openBtn.on('click', _show);

        if (nowID != null) {
          $('.js-answerTrigger').eq(nowID - 1).find('dd').addClass('is-open');
          $('.js-answerTrigger').eq(nowID - 1).find('dt').addClass('is-show');
          setTimeout(function () {
            localStorage.clear();
          }, 100);
        }
      };

      var _show = function _show() {
        var $openBody = $(this).next('dd');
        $(this).toggleClass('is-show');
        $openBody.slideToggle(300);

        if ($(this).hasClass('is-show')) {
          $(this).next('dd').find('a').on('click', function () {
            event.preventDefault();
            var linkURL = $(this).attr('href');
            var state = $(this).parents('.js-answerTrigger').index();
            localStorage.setItem('openID', state);
            setTimeout(function () {
              window.location.href = linkURL;
            }, 100);
          });
        } else {
          if (nowID != null) {
            localStorage.clear();
          }
        }
      };

      return {
        init: _init
      };
    }();

    return {
      init: _init
    };
  }();

  SECONDSTREET.STATICINDEX.init();
})(jQuery);