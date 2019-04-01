/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */

(function ($) {
  var SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.Sell = function () {
    var $win = $(window);
    var $body = $('body');
    var _init = function _init() {
      _topModal.init();
      _exampleSlider();
    };

    var _topModal = function () {
      var current_scrollY = void 0;
      var state = false;
      var modalID = void 0;
      var $trigger = $('.js-modalTrigger');
      var $mask = $('.modal_mask');
      var $close = $('.modal_closeBtn');

      var _init = function _init() {
        _bind();
      };

      var _bind = function _bind() {

        $trigger.on('click', function () {
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });
        $mask.on('click', function () {
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });
        $close.on('click', function () {
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });

        modalID = location.hash.substr(1);
        if (modalID === 'documents') {
          toggleClass(modalID);
        }
      };

      function toggleClass(modalID) {

        if (!state) {
          current_scrollY = $(window).scrollTop();
          $body.addClass('view-modal-' + modalID);
          $body.addClass('view-modal');
          $('.modal').css({
            position: 'relative'
          });

          $('html, body').prop({ scrollTop: 0 });
          $('.l-wrapper').css({
            position: 'fixed',
            width: '100%',
            overflow: 'hidden',
            top: -1 * current_scrollY
          });
          state = true;
        } else {

          $('.modal').css({
            position: 'absolute'
          });

          $body.removeClass(function (index, className) {
            return (className.match(/\bview-\S+/g) || []).join(' ');
          });

          setTimeout(function () {
            $('.l-wrapper').attr({ style: '' });
            $('html, body').prop({ scrollTop: current_scrollY });
          }, 300);

          state = false;
        }
      }

      return {
        init: _init
      };
    }();

    var _exampleSlider = function _exampleSlider() {

      var $slider = $('.example_list');

      var items = $slider.find('li').length;
      var startCurrentBefore = items + 4;
      var startCurrentAfter = items + 5;

      if (items <= 5) {} else {
        var handle = function handle(mq) {
          if (mq.matches) {

            $('.slick-slide').eq(startCurrentBefore).addClass('is-overlay');
            $('.slick-slide').eq(startCurrentAfter).addClass('is-overlay');

            $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

              if (currentSlide === 0 && nextSlide === items - 1) {

                $('.slick-slide').removeClass('is-overlay');
                var CurrentBefore = currentSlide + 4;
                var CurrentAfter = currentSlide + 5;
                var nextCurrentBefore = nextSlide + 5;
                var nextCurrentAfter = nextSlide + 6;
                $('.slick-slide').eq(CurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(CurrentAfter).addClass('is-overlay');
                $('.slick-slide').eq(nextCurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(nextCurrentAfter).addClass('is-overlay');
              } else if (currentSlide === nextSlide + 1) {

                $('.slick-slide').removeClass('is-overlay');
                var _CurrentBefore = currentSlide + 4;
                var _CurrentAfter = currentSlide + 5;
                $('.slick-slide').eq(_CurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(_CurrentAfter).addClass('is-overlay');
              } else {

                if (currentSlide === items - 1) {
                  $('.slick-slide').removeClass('is-overlay');
                  var _CurrentBefore2 = currentSlide + 6;
                  var _CurrentAfter2 = currentSlide + 7;
                  var _nextCurrentBefore = nextSlide + 5;
                  var _nextCurrentAfter = nextSlide + 6;
                  $('.slick-slide').eq(_CurrentBefore2).addClass('is-overlay');
                  $('.slick-slide').eq(_CurrentAfter2).addClass('is-overlay');
                  $('.slick-slide').eq(_nextCurrentBefore).addClass('is-overlay');
                  $('.slick-slide').eq(_nextCurrentAfter).addClass('is-overlay');
                } else {
                  $('.slick-slide').removeClass('is-overlay');
                  var _CurrentBefore3 = currentSlide + 6;
                  var _CurrentAfter3 = currentSlide + 7;
                  $('.slick-slide').eq(_CurrentBefore3).addClass('is-overlay');
                  $('.slick-slide').eq(_CurrentAfter3).addClass('is-overlay');
                }
              }
            });
          }
        };

        $slider.slick({
          autoplay: true,
          speed: 1000,
          autoplaySpeed: 200000,
          slidesToShow: 6,
          prevArrow: '<div class="slider-arrow slider-prev"></div>',
          nextArrow: '<div class="slider-arrow slider-next"></div>',
          responsive: [{
            breakpoint: 769,
            settings: {
              slidesToShow: 4,
              initialSlide: items - 1
            }
          }]
        });

        var mediaQuery = matchMedia('(max-width: 768px');

        handle(mediaQuery);
        mediaQuery.addListener(handle);
      }
    };

    return {
      init: _init
    };
  }();

  SECONDSTREET.Sell.init();
})(jQuery);