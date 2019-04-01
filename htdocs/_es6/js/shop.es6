/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */


 (function($) {
  const SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.SHOP = function() {
    const $win = $(window);
    const $body = $('body');
    // 初期化
    const _init = function() {
      _print();
      _tab();
      _copyText();
      _modal.init();
      _slider.init();
      objectFitImages();
    };


    const _print = function (){
      $('.js-printBtn').on('click',function(){
        window.print();
      });
    };


    const _tab = function (){
      $('.tab_label').on('click',function(){
        let $th = $(this).index();
        $('.tab_label').removeClass('is-active');
        $('.tab_panel').removeClass('is-active');
        $(this).addClass('active');
        $('.tab_panel').eq($th).addClass('is-active');
      });
    };


    const _copyText = function (){
      const copyBtn = document.querySelector('.js-copybtn');
      copyBtn.addEventListener('click', function() {
        let copyText = document.querySelector('.js-copytext');
        let range = document.createRange();
        range.selectNode(copyText);
        window.getSelection().addRange(range);
        try {
          let successful = document.execCommand('copy');
          let msg = successful ? 'successful' : 'unsuccessful';
          console.log('Copy command was ' + msg);
          alert('コピーしました');
        } catch(err) {
          console.log('Unable to copy');
        }
        window.getSelection().removeAllRanges();
      });
    };


     const _modal = function (){
      let current_scrollY;
      let state = false;
      const $trigger = $('.js-modalTrigger');
      const $mask = $('.modal_mask');
      const $close = $('.modal_closeBtn');

      const _init = function (){
        _bind();
      };

      const _bind = function (){
        $trigger.on('click', function(){
          toggleClass();
        });
        $mask.on('click', function(){
          toggleClass();
        });
        $close.on('click', function(){
          toggleClass();
        });
      };

      function toggleClass() {
        if(!state){
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
          $body.removeClass(function(index, className) {
            return (className.match(/\bview-\S+/g) || []).join(' ');
          });
          setTimeout(function(){
            $('.l-wrapper').attr( { style: '' } );
            $body.attr( { style: '' } );
            $('html, body').prop({ scrollTop: current_scrollY });
          },300);
          state = false;
        }
      }

      return{
        init: _init
      }
    }();


    const _slider = function() {
      const $slider = $('.js-slider');
      const $detailSlider = $('.js-detailSlider');

      const _init = function (){
        _bind();
        $win.on('resize', function() {
          $('.js-slider').slick('resize');
        });
      };

      const _bind = function (){
        $slider.slick({
          autoplay: true,
          speed: 1000,
          autoplaySpeed: 4000,
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: true,
          prevArrow: '<div class="slider-arrow slider-prev"></div>',
          nextArrow: '<div class="slider-arrow slider-next"></div>',
          responsive: [
          {
            breakpoint: 769,
            settings: 'unslick'
          }
          ]
        });

        $detailSlider.slick({
          autoplay: true,
          arrows: false,
          fade: true,
          speed: 2000,
          autoplaySpeed: 2500
        });
        console.log("wsassakakk")
      };

      return{
        init: _init
      }
    }();


    return {
      init: _init
    };
  }();

  SECONDSTREET.SHOP.init();
})(jQuery);