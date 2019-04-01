/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */


 (function($) {
  const SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.Sell = function() {
    const $win = $(window);
    const $body = $('body');
    // 初期化
    const _init = function() {
      _topModal.init();
      _exampleSlider();
    };



    /****
     *
     * modal
     *
     */
     const _topModal = function (){
      let current_scrollY;
      let state = false;
      let modalID;
      const $trigger = $('.js-modalTrigger');
      const $mask = $('.modal_mask');
      const $close = $('.modal_closeBtn');

      const _init = function (){
        _bind();
      };

      const _bind = function (){

        $trigger.on('click', function(){
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });
        $mask.on('click', function(){
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });
        $close.on('click', function(){
          modalID = $(this).attr('data-modal-id');
          toggleClass(modalID);
        });

        modalID = location.hash.substr(1);
        if ( modalID === 'documents' ) {
          toggleClass(modalID);
        }

      };


      function toggleClass(modalID) {

        if(!state){
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

          $body.removeClass(function(index, className) {
            return (className.match(/\bview-\S+/g) || []).join(' ');
          });

          setTimeout(function(){
            $('.l-wrapper').attr( { style: '' } );
            $('html, body').prop({ scrollTop: current_scrollY });
          },300);

          state = false;
        }

      }


      return{
        init: _init
      }
    }();



    const _exampleSlider = function() {

      const $slider = $('.example_list');

      let items = $slider.find('li').length;
      let startCurrentBefore = items + 4;
      let startCurrentAfter = items + 5;

      if ( items <= 5 ) {

      } else {

        $slider.slick({
          autoplay: true,
          speed: 1000,
          autoplaySpeed: 200000,
          slidesToShow: 6,
          prevArrow: '<div class="slider-arrow slider-prev"></div>',
          nextArrow: '<div class="slider-arrow slider-next"></div>',
          responsive: [
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 4,
              initialSlide: items - 1,
            }
          }
          ]
        });

        // ここからSPスライダーのopacity
        var mediaQuery = matchMedia('(max-width: 768px');

        handle(mediaQuery);
        mediaQuery.addListener(handle);

        function handle(mq) {
          if (mq.matches) {

            $('.slick-slide').eq(startCurrentBefore).addClass('is-overlay');
            $('.slick-slide').eq(startCurrentAfter).addClass('is-overlay');

            $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){

              if ( currentSlide === 0 && nextSlide === items - 1  ) {

                $('.slick-slide').removeClass('is-overlay');
                let CurrentBefore = currentSlide + 4;
                let CurrentAfter  = currentSlide + 5;
                let nextCurrentBefore = nextSlide + 5;
                let nextCurrentAfter  = nextSlide + 6;
                $('.slick-slide').eq(CurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(CurrentAfter).addClass('is-overlay');
                $('.slick-slide').eq(nextCurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(nextCurrentAfter).addClass('is-overlay');

              } else if ( currentSlide === nextSlide + 1 ) {

                $('.slick-slide').removeClass('is-overlay');
                let CurrentBefore = currentSlide + 4;
                let CurrentAfter  = currentSlide + 5;
                $('.slick-slide').eq(CurrentBefore).addClass('is-overlay');
                $('.slick-slide').eq(CurrentAfter).addClass('is-overlay');

              } else {

                if ( currentSlide === (items - 1) ) {
                  $('.slick-slide').removeClass('is-overlay');
                  let CurrentBefore = currentSlide + 6;
                  let CurrentAfter  = currentSlide + 7;
                  let nextCurrentBefore = nextSlide + 5;
                  let nextCurrentAfter  = nextSlide + 6;
                  $('.slick-slide').eq(CurrentBefore).addClass('is-overlay');
                  $('.slick-slide').eq(CurrentAfter).addClass('is-overlay');
                  $('.slick-slide').eq(nextCurrentBefore).addClass('is-overlay');
                  $('.slick-slide').eq(nextCurrentAfter).addClass('is-overlay');
                } else {
                  $('.slick-slide').removeClass('is-overlay');
                  let CurrentBefore = currentSlide + 6;
                  let CurrentAfter  = currentSlide + 7;
                  $('.slick-slide').eq(CurrentBefore).addClass('is-overlay');
                  $('.slick-slide').eq(CurrentAfter).addClass('is-overlay');
                }

              }


            });

          }
        }
        // ここまでSPスライダーのopacity

      }

    };



    return {
      init: _init
    };
  }();

  SECONDSTREET.Sell.init();
})(jQuery);