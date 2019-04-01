/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */


 (function($) {
  const SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.Top = function() {
    const $win = $(window);
    const $body = $('body');
    // 初期化
    const _init = function() {
      _aboutModal.init();
      _rss.init();
      _parallax.init();
      _waypoint.init();
      // _headFixed.init();
      _usaBg.init();
      // _aboutSlider.init();
      _mvMenuAccordion.init();
      _mvMenuLayout.init();
      _mvAnimation.init();
      _mvOpenMenu.init();
      objectFitImages();
    };



    /****
     *
     * modal
     *
     */
     const _aboutModal = function (){
      let current_scrollY;
      let state = false;
      let openModal;
      let modalHeight, paddingTop, paddingBottom, openModalWrapHeight;
      const $trigger = $('.js-aboutModalTrigger');
      const $mask = $('.modal_mask');
      const $close = $('.modal_closeBtn');

      const _init = function (){
        _bind();
      };

      const _bind = function (){
        $trigger.on('click', toggleClass);
        $mask.on('click', toggleClass);
        $close.on('click', toggleClass);
      };


      function toggleClass (){

        if(!state){
          current_scrollY = $(window).scrollTop();
          openModal = $(this).attr('data-modal-id');
          $body.addClass('view-modal-' + openModal);
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
          $body.removeClass('view-modal');

          setTimeout(function(){
            $('.l-wrapper').attr( { style: '' } );
            $body.removeClass('view-modal-' + openModal);
            $('html, body').prop({ scrollTop: current_scrollY });
          },300);

          state = false;
        }

      }


      return{
        init: _init
      }
    }();



    const _rss = function (){
      const _init = function (){

        $.ajax({
          url: '/knowbrand/feature/feed/index.xml',
          type: 'get',
          dataType: 'xml',
          timeout: 5000,
          success: function(xml, status) {
            if (status === 'success') {
              let item = $(xml).find('item').eq(0);
              let title = item.find('title').text();
              let link = item.find('link').text();
              let imgPath = item.find('media\\:content, content').attr('url');

              $('#js-rssTitle').text(title);
              $('#js-rssLink').attr('href', link);
              $('#js-rssImgPath').attr('src', imgPath);
            }
          },
          error: function(){
            console.log('failed...');
          }
        });

      };

      return{
        init: _init
      }
    }();


    const _parallax = function (){
      let $target = $('.c-nongrid');
      let $target1 = $('.original');
      let $target2 = $('.kurofine');
      let targetItem01 = '.c-nongrid_img-01';
      let targetItem02 = '.c-nongrid_img-02';
      let scrollTop,
      winH,
      targetHeightArr,
      targetOffsetArr,
      block1ParaValue1,
      block1ParaValue2,
      block2ParaValue1,
      block2ParaValue2;

      const _init = function (){
        _bind();
      };

      const _bind = function (){
        _initValue();
        _scrollValue();
        $win.on('load resize', _initValue);
        $win.on('load scroll', function(){
          if($win.innerWidth() > 768) {
            _scrollValue();
            _scrollParallax();
          }
        });
      };

      const _initValue = function (){
        targetOffsetArr = [];
        targetHeightArr = [];
        winH = $win.height();

        $target.each(function(i){
          if(i >= 2) {
            return false;
          }
          targetOffsetArr.push( Math.floor($(this).offset().top) );
          targetHeightArr.push( Math.floor($(this).innerHeight()) );
        });
      };

      const _scrollValue = function (){
        scrollTop = $win.scrollTop();
        block1ParaValue1 = ( targetOffsetArr[0] - scrollTop ) / 2 ;
        block1ParaValue2 = ( targetOffsetArr[0] - scrollTop ) / 9 ;
        block2ParaValue1 = ( targetOffsetArr[1] - scrollTop ) / 2 ;
        block2ParaValue2 = ( targetOffsetArr[1] - scrollTop ) / 9 ;
      };

      const _scrollParallax = function (){
        if( (scrollTop + winH) > targetOffsetArr[0] && (targetOffsetArr[0] + targetHeightArr[0]) > scrollTop ) {
          $target1.find(targetItem01).css({ 'transform': 'translateY('+ block1ParaValue1 +'px)' })
          $target1.find(targetItem02).css({ 'transform': 'translateY('+ block1ParaValue2 +'px)' })
        }
        if( (scrollTop + winH) > targetOffsetArr[1] && (targetOffsetArr[1] + targetHeightArr[1]) > scrollTop ) {
          $target2.find(targetItem01).css({ 'transform': 'translateY('+ block2ParaValue1 +'px)' })
          $target2.find(targetItem02).css({ 'transform': 'translateY('+ block2ParaValue2 +'px)' })
        }
      };

      return{
        init: _init
      }
    }();


    const _waypoint = function() {
      const $target = $('.js-waypointTarget');

      const _init = () => {
        _scroll();
      };

      const _scroll = () => {

        $target.waypoint(function(direction){
          let activePoint = $(this.element);
          // if ( direction === 'down' ) {
            activePoint.addClass('is-active');
          // } else {
            // activePoint.removeClass('is-active');
          // }
        },{offset : '85%'});

      };

      return {
        init: _init
      }
    }();


    // const _headFixed = function() {
    //   const $header = $('.g-header');
    //   const $main = $('.content');
    //   let headerPos = $header.offset().top;
    //   let headerH = $header.height();

    //   const _init = () => {
    //     _bind();
    //   };

    //   const _bind = () => {
    //     $win.on('scroll', _scroll);
    //   };

    //   const _scroll = () => {

    //     let value = $(this).scrollTop();
    //     if ( value > headerPos ) {
    //       $header.addClass('is-fixed');
    //       $main.css('margin-top', headerH);
    //     } else {
    //       $header.removeClass('is-fixed');
    //       $main.css('margin-top', '0');
    //     }
    //   };

    //   return{
    //     init: _init
    //   }
    // }();


    const _usaBg = function() {

      const _init = function() {

        let mediaQuery = matchMedia('(max-width: 768px)');
        handle(mediaQuery);
        mediaQuery.addListener(handle);

        function handle(mq) {

          if (!mq.matches) {
            var video = document.getElementById('usa_video');

            $('.usa').waypoint(function(){
              video.play();
            },{ offset : '100%' });

          } else {

            const $usaSpBgSlider = $('.usa_bg');

            $usaSpBgSlider.slick({
              arrows: false,
              fade: true,
              autoplay: false,
              speed: 1000,
              autoplaySpeed: 2500
            });



            $('.usa').waypoint(function(){
              $usaSpBgSlider.slick('slickPlay');
            },{
              offset : '100%'
            });


          }
        }

        _slider();
      };

      const _slider = function() {
        const $innerSlider = $('.usa_list');

        $innerSlider.slick({
          arrows: false,
          fade: true,
          autoplay: false,
          speed: 100,
          autoplaySpeed: 500
        });

        $innerSlider.waypoint(function(){
          $innerSlider.slick('slickPlay');
        },{
          offset : '85%'
        });


      };

      return {
        init: _init
      }
    }();



    const _aboutSlider = function() {
      const $slider = $('.about_bg');
      const $sliderItem = $('.about_bg div');

      const _init = function() {
        $slider.slick({
          arrows: false,
          fade: true,
          autoplay: false,
          speed: 3000,
          autoplaySpeed: 3500,
        });

        $slider.waypoint(function(){
          $slider.slick('slickPlay');
        },{
          offset : '85%'
        });

        $sliderItem.eq(0).addClass('is-current');
        $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
          $sliderItem.eq(currentSlide).addClass('is-beforeCurrent');
          setTimeout(function(){
            $sliderItem.removeClass('is-beforeCurrent');
          },5000);

          if (nextSlide === 1){
            $sliderItem.eq(1).addClass('is-current');
            $sliderItem.eq(0).removeClass('is-current');
          } else if (nextSlide === 2) {
            $sliderItem.eq(2).addClass('is-current');
            $sliderItem.eq(1).removeClass('is-current');
          } else if (nextSlide === 0) {
            $sliderItem.eq(0).addClass('is-current');
            $sliderItem.eq(2).removeClass('is-current');
          }

        });

      };

      return {
        init: _init
      }
    }();



    const _mvMenuAccordion = function() {
      const $accordionTrigger = $('.js-accordionTrigger');
      const $prevSellBtn = $('#js-prevSellBtn');
      const $prevBuyBtn = $('#js-prevBuyBtn');

      const _init = function() {
        $accordionTrigger.on('click', _show);
        $prevSellBtn.on('click', _show);
        $prevBuyBtn.on('click', _show);
      };

      const _show = function() {
        let $content = $(this).next('.js-accordionContent');
        $(this).toggleClass('is-showAccordion');
        $content.slideToggle(300);
        $accordionTrigger.not($(this)).next('.js-accordionContent').slideUp();
        $accordionTrigger.not($(this)).removeClass('is-showAccordion');
      };

      return {
        init: _init
      }
    }();



    const _mvMenuLayout = function() {

      const _init = () => {
        const menuSell = $('.mv_menu-sell');
        const menuBuy = $('.mv_menu-buy');
        let transformWidth;

        $win.on('load resize', function(){
          if ( window.innerWidth > 2000 ) {
            transformWidth = (window.innerWidth - 2000) / 2;
            menuSell.css('transform', 'translateX(-100%) translateX(-' + transformWidth + 'px)');
            menuBuy.css('transform', 'translateX(100%) translateX(' + transformWidth + 'px)');
          }
        });
      };

      return{
        init: _init
      }
    }();


    const _mvOpenMenu = function() {

      const sellTrigger = $('#js-sellBtn');
      const buyTrigger = $('#js-buyBtn');
      const target = $('.mv_category');
      const prevSellBtn = $('#js-prevSellBtn');
      const prevBuyBtn = $('#js-prevBuyBtn');

      const _init = () => {
        _bind();
        _hover();
      };

      const _bind = () => {
        sellTrigger.on('click', _toggleClassSell);
        prevSellBtn.on('click', _toggleClassSell);
        buyTrigger.on('click', _toggleClassBuy);
        prevBuyBtn.on('click', _toggleClassBuy);
      };

      const _hover = () => {
        sellTrigger.on('mouseenter', function(){
          $body.addClass('is-sellHover');
        }).on('mouseout', function(){
          $body.removeClass('is-sellHover');
        });

        buyTrigger.on('mouseenter', function(){
          $body.addClass('is-buyHover');
        }).on('mouseout', function(){
          $body.removeClass('is-buyHover');
        });
      };

      const _toggleClassSell = () => {
        $body.toggleClass('is-sellVisible');
      };

      const _toggleClassBuy = () => {
        $body.toggleClass('is-buyVisible');
      };


      return{
        init: _init
      }
    }();



    const _mvAnimation = function(){

      const $kv01a = $('.kv-01a');
      const $kv01b = $('.kv-01b');
      const $kv01c = $('.kv-01c');
      const $kv01d = $('.kv-01d');

      const $kv02a = $('.kv-02a');
      const $kv02b = $('.kv-02b');
      const $kv02c = $('.kv-02c');

      const $kv03a = $('.kv-03a');
      const $kv03b = $('.kv-03b');
      const $kv03c = $('.kv-03c');

      const $kv04a = $('.kv-04a');
      const $kv04b = $('.kv-04b');
      const $kv04c = $('.kv-04c');

      const $kv05a = $('.kv-05a');
      const $kv05b = $('.kv-05b');
      const $kv05c = $('.kv-05c');
      const $kv05d = $('.kv-05d');

      const $kv06a = $('.kv-06a');
      const $kv06b = $('.kv-06b');
      const $kv06c = $('.kv-06c');

      const $kv07a = $('.kv-07a');
      const $kv07b = $('.kv-07b');
      const $kv07c = $('.kv-07c');

      const $kv08a = $('.kv-08a');
      const $kv08b = $('.kv-08b');
      const $kv08c = $('.kv-08c');
      const $kv08d = $('.kv-08d');

      const time = 2000;


      const _init = () => {
        _start();
      };

      const _start = () => {
        $kv01a.addClass('is-current');
        $kv01b.addClass('is-current');
        $kv01c.addClass('is-current');
        $kv01d.addClass('is-current');

        $kv02a.addClass('is-wait');
        $kv02b.addClass('is-wait');
        $kv02c.addClass('is-wait');

        $kv03a.addClass('is-wait');
        $kv03b.addClass('is-wait');
        $kv03c.addClass('is-wait');

        $kv04a.addClass('is-wait');
        $kv04b.addClass('is-wait');
        $kv04c.addClass('is-wait');

        $kv05a.addClass('is-wait');
        $kv05b.addClass('is-wait');
        $kv05c.addClass('is-wait');
        $kv05d.addClass('is-wait');

        $kv06a.addClass('is-wait');
        $kv06b.addClass('is-wait');
        $kv06c.addClass('is-wait');

        $kv07a.addClass('is-wait');
        $kv07b.addClass('is-wait');
        $kv07c.addClass('is-wait');

        $kv08a.addClass('is-wait');
        $kv08b.addClass('is-wait');
        $kv08c.addClass('is-wait');
        $kv08d.addClass('is-wait');

        setTimeout(function(){
          _anim01();
        }, time)
      };

      const _anim01 = () => {
        $kv01c.removeClass('is-current').removeClass('is-show').addClass('is-hide');
        $kv01b.removeClass('is-current').removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv01d.removeClass('is-current').removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv02c.removeClass('is-wait').addClass('is-show');
        $kv02b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function(){
          $kv01c.removeClass('is-hide').addClass('is-wait');
          $kv01b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv01d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim02();
        }, time)
      };

      const _anim02 = () => {
        $kv01a.removeClass('is-current').removeClass('is-show').addClass('is-hide');

        $kv02a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv01a.removeClass('is-hide').addClass('is-wait');
          _anim03();
        }, time)
      };

      const _anim03 = () => {
        $kv02c.removeClass('is-show').addClass('is-hide');
        $kv02b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv03c.removeClass('is-wait').addClass('is-show');
        $kv03b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function(){
          $kv02c.removeClass('is-hide').addClass('is-wait');
          $kv02b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim04();
        }, time)
      };

      const _anim04 = () => {
        $kv02a.removeClass('is-show').addClass('is-hide');

        $kv03a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv02a.removeClass('is-hide').addClass('is-wait');
          _anim05();
        }, time)
      };

      const _anim05 = () => {
        $kv03c.removeClass('is-show').addClass('is-hide');
        $kv03b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv04a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv03c.removeClass('is-hide').addClass('is-wait');
          $kv03b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim06();
        }, time)
      };

      const _anim06 = () => {
        $kv03a.removeClass('is-show').addClass('is-hide');

        $kv04c.removeClass('is-wait').addClass('is-show');
        $kv04b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function(){
          $kv03a.removeClass('is-hide').addClass('is-wait');
          _anim07();
        }, time)
      };

      const _anim07 = () => {
        $kv04a.removeClass('is-show').addClass('is-hide');
        $kv05a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv04a.removeClass('is-hide').addClass('is-wait');
          _anim08();
        }, time)
      };

      const _anim08 = () => {
        $kv04c.removeClass('is-show').addClass('is-hide');
        $kv04b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv05c.removeClass('is-wait').addClass('is-show');
        $kv05b.removeClass('is-wait').addClass('is-showDelay1');
        $kv05d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function(){
          $kv04c.removeClass('is-hide').addClass('is-wait');
          $kv04b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim09();
        }, time)
      };

      const _anim09 = () => {
        $kv05a.removeClass('is-show').addClass('is-hide');

        $kv06c.removeClass('is-wait').addClass('is-show');
        $kv06b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function(){
          $kv05a.removeClass('is-hide').addClass('is-wait');
          _anim10();
        }, time)
      };

      const _anim10 = () => {
        $kv05c.removeClass('is-show').addClass('is-hide');
        $kv05b.removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv05d.removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv06a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv05c.removeClass('is-hide').addClass('is-wait');
          $kv05b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv05d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim11();
        }, time)
      };

      const _anim11 = () => {
        $kv06c.removeClass('is-show').addClass('is-hide');
        $kv06b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv07a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv06c.removeClass('is-hide').addClass('is-wait');
          $kv06b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim12();
        }, time)
      };

      const _anim12 = () => {
        $kv06a.removeClass('is-show').addClass('is-hide');

        $kv07c.removeClass('is-wait').addClass('is-show');
        $kv07b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function(){
          $kv06a.removeClass('is-hide').addClass('is-wait');
          _anim13();
        }, time)
      };

      const _anim13 = () => {
        $kv07a.removeClass('is-show').addClass('is-hide');

        $kv08c.removeClass('is-wait').addClass('is-show');
        $kv08b.removeClass('is-wait').addClass('is-showDelay1');
        $kv08d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function(){
          $kv07a.removeClass('is-hide').addClass('is-wait');
          _anim14();
        }, time)
      };

      const _anim14 = () => {
        $kv07c.removeClass('is-show').addClass('is-hide');
        $kv07b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv08a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv07c.removeClass('is-hide').addClass('is-wait');
          $kv07b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim15();
        }, time)
      };

      const _anim15 = () => {
        $kv08c.removeClass('is-show').addClass('is-hide');
        $kv08b.removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv08d.removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv01c.removeClass('is-wait').addClass('is-show');
        $kv01b.removeClass('is-wait').addClass('is-showDelay1');
        $kv01d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function(){
          $kv08c.removeClass('is-hide').addClass('is-wait');
          $kv08b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv08d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim16();
        }, time)
      };

      const _anim16 = () => {
        $kv08a.removeClass('is-show').addClass('is-hide');

        $kv01a.removeClass('is-wait').addClass('is-show');

        setTimeout(function(){
          $kv08a.removeClass('is-hide').addClass('is-wait');
          _anim01();
        }, time)
      };


      return{
       init: _init
     }
   }();




   return {
    init: _init
  };
}();

SECONDSTREET.Top.init();
})(jQuery);