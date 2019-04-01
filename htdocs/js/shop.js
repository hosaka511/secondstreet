/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */

(function ($) {
  var SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.SHOP = function () {
    var $win = $(window);
    var $body = $('body');
    var _init = function _init() {
      _print();
      _tab();
      _copyText();
      _modal.init();
      _slider.init();
      objectFitImages();
    };

    var _print = function _print() {
      $('.js-printBtn').on('click', function () {
        window.print();
      });
    };

    var _tab = function _tab() {
      $('.tab_label').on('click', function () {
        var $th = $(this).index();
        $('.tab_label').removeClass('is-active');
        $('.tab_panel').removeClass('is-active');
        $(this).addClass('active');
        $('.tab_panel').eq($th).addClass('is-active');
      });
    };

    var _copyText = function _copyText() {
      var copyBtn = document.querySelector('.js-copybtn');
      copyBtn.addEventListener('click', function () {
        var copyText = document.querySelector('.js-copytext');
        var range = document.createRange();
        range.selectNode(copyText);
        window.getSelection().addRange(range);
        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          console.log('Copy command was ' + msg);
          alert('コピーしました');
        } catch (err) {
          console.log('Unable to copy');
        }
        window.getSelection().removeAllRanges();
      });
    };

    var _modal = function () {
      var current_scrollY = void 0;
      var state = false;
      var $trigger = $('.js-modalTrigger');
      var $mask = $('.modal_mask');
      var $close = $('.modal_closeBtn');

      var _init = function _init() {
        _bind();
      };

      var _bind = function _bind() {
        $trigger.on('click', function () {
          toggleClass();
        });
        $mask.on('click', function () {
          toggleClass();
        });
        $close.on('click', function () {
          toggleClass();
        });
      };

      function toggleClass() {
        if (!state) {
          current_scrollY = $(window).scrollTop();
          $body.addClass('view-modal');
          $body.css({
            overflow: 'hidden'
          });
          $('html, body').prop({ scrollTop: 0 });
          $('.l-wrapper').css({
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: -1 * current_scrollY
          });
          state = true;
        } else {
          $body.removeClass(function (index, className) {
            return (className.match(/\bview-\S+/g) || []).join(' ');
          });
          setTimeout(function () {
            $('.l-wrapper').attr({ style: '' });
            $body.attr({ style: '' });
            $('html, body').prop({ scrollTop: current_scrollY });
          }, 300);
          state = false;
        }
      }

      return {
        init: _init
      };
    }();

    var _slider = function () {
      var $slider = $('.js-slider');
      var $detailSlider = $('.js-detailSlider');

      var _init = function _init() {
        _bind();
        $win.on('resize', function () {
          $('.js-slider').slick('resize');
        });
      };

      var _bind = function _bind() {
        $slider.slick({
          autoplay: true,
          speed: 1000,
          autoplaySpeed: 4000,
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: true,
          prevArrow: '<div class="slider-arrow slider-prev"></div>',
          nextArrow: '<div class="slider-arrow slider-next"></div>',
          responsive: [{
            breakpoint: 769,
            settings: 'unslick'
          }]
        });

        $detailSlider.slick({
          autoplay: true,
          arrows: false,
          fade: true,
          speed: 2000,
          autoplaySpeed: 2500
        });
        console.log("wsassakakk");
      };

      return {
        init: _init
      };
    }();

    return {
      init: _init
    };
  }();

  SECONDSTREET.SHOP.init();
})(jQuery);