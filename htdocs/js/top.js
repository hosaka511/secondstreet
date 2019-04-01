/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */

(function ($) {
  var SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.Top = function () {
    var $win = $(window);
    var $body = $('body');
    var _init = function _init() {
      _aboutModal.init();
      _rss.init();
      _parallax.init();
      _waypoint.init();
      _usaBg.init();
      _mvMenuAccordion.init();
      _mvMenuLayout.init();
      _mvAnimation.init();
      _mvOpenMenu.init();
      objectFitImages();
    };

    var _aboutModal = function () {
      var current_scrollY = void 0;
      var state = false;
      var openModal = void 0;
      var modalHeight = void 0,
          paddingTop = void 0,
          paddingBottom = void 0,
          openModalWrapHeight = void 0;
      var $trigger = $('.js-aboutModalTrigger');
      var $mask = $('.modal_mask');
      var $close = $('.modal_closeBtn');

      var _init = function _init() {
        _bind();
      };

      var _bind = function _bind() {
        $trigger.on('click', toggleClass);
        $mask.on('click', toggleClass);
        $close.on('click', toggleClass);
      };

      function toggleClass() {

        if (!state) {
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

          setTimeout(function () {
            $('.l-wrapper').attr({ style: '' });
            $body.removeClass('view-modal-' + openModal);
            $('html, body').prop({ scrollTop: current_scrollY });
          }, 300);

          state = false;
        }
      }

      return {
        init: _init
      };
    }();

    var _rss = function () {
      var _init = function _init() {

        $.ajax({
          url: '/knowbrand/feature/feed/index.xml',
          type: 'get',
          dataType: 'xml',
          timeout: 5000,
          success: function success(xml, status) {
            if (status === 'success') {
              var item = $(xml).find('item').eq(0);
              var title = item.find('title').text();
              var link = item.find('link').text();
              var imgPath = item.find('media\\:content, content').attr('url');

              $('#js-rssTitle').text(title);
              $('#js-rssLink').attr('href', link);
              $('#js-rssImgPath').attr('src', imgPath);
            }
          },
          error: function error() {
            console.log('failed...');
          }
        });
      };

      return {
        init: _init
      };
    }();

    var _parallax = function () {
      var $target = $('.c-nongrid');
      var $target1 = $('.original');
      var $target2 = $('.kurofine');
      var targetItem01 = '.c-nongrid_img-01';
      var targetItem02 = '.c-nongrid_img-02';
      var scrollTop = void 0,
          winH = void 0,
          targetHeightArr = void 0,
          targetOffsetArr = void 0,
          block1ParaValue1 = void 0,
          block1ParaValue2 = void 0,
          block2ParaValue1 = void 0,
          block2ParaValue2 = void 0;

      var _init = function _init() {
        _bind();
      };

      var _bind = function _bind() {
        _initValue();
        _scrollValue();
        $win.on('load resize', _initValue);
        $win.on('load scroll', function () {
          if ($win.innerWidth() > 768) {
            _scrollValue();
            _scrollParallax();
          }
        });
      };

      var _initValue = function _initValue() {
        targetOffsetArr = [];
        targetHeightArr = [];
        winH = $win.height();

        $target.each(function (i) {
          if (i >= 2) {
            return false;
          }
          targetOffsetArr.push(Math.floor($(this).offset().top));
          targetHeightArr.push(Math.floor($(this).innerHeight()));
        });
      };

      var _scrollValue = function _scrollValue() {
        scrollTop = $win.scrollTop();
        block1ParaValue1 = (targetOffsetArr[0] - scrollTop) / 2;
        block1ParaValue2 = (targetOffsetArr[0] - scrollTop) / 9;
        block2ParaValue1 = (targetOffsetArr[1] - scrollTop) / 2;
        block2ParaValue2 = (targetOffsetArr[1] - scrollTop) / 9;
      };

      var _scrollParallax = function _scrollParallax() {
        if (scrollTop + winH > targetOffsetArr[0] && targetOffsetArr[0] + targetHeightArr[0] > scrollTop) {
          $target1.find(targetItem01).css({ 'transform': 'translateY(' + block1ParaValue1 + 'px)' });
          $target1.find(targetItem02).css({ 'transform': 'translateY(' + block1ParaValue2 + 'px)' });
        }
        if (scrollTop + winH > targetOffsetArr[1] && targetOffsetArr[1] + targetHeightArr[1] > scrollTop) {
          $target2.find(targetItem01).css({ 'transform': 'translateY(' + block2ParaValue1 + 'px)' });
          $target2.find(targetItem02).css({ 'transform': 'translateY(' + block2ParaValue2 + 'px)' });
        }
      };

      return {
        init: _init
      };
    }();

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








    var _usaBg = function () {

      var _init = function _init() {

        var mediaQuery = matchMedia('(max-width: 768px)');
        handle(mediaQuery);
        mediaQuery.addListener(handle);

        function handle(mq) {

          if (!mq.matches) {
            var video = document.getElementById('usa_video');

            $('.usa').waypoint(function () {
              video.play();
            }, { offset: '100%' });
          } else {

            var $usaSpBgSlider = $('.usa_bg');

            $usaSpBgSlider.slick({
              arrows: false,
              fade: true,
              autoplay: false,
              speed: 1000,
              autoplaySpeed: 2500
            });

            $('.usa').waypoint(function () {
              $usaSpBgSlider.slick('slickPlay');
            }, {
              offset: '100%'
            });
          }
        }

        _slider();
      };

      var _slider = function _slider() {
        var $innerSlider = $('.usa_list');

        $innerSlider.slick({
          arrows: false,
          fade: true,
          autoplay: false,
          speed: 100,
          autoplaySpeed: 500
        });

        $innerSlider.waypoint(function () {
          $innerSlider.slick('slickPlay');
        }, {
          offset: '85%'
        });
      };

      return {
        init: _init
      };
    }();

    var _aboutSlider = function () {
      var $slider = $('.about_bg');
      var $sliderItem = $('.about_bg div');

      var _init = function _init() {
        $slider.slick({
          arrows: false,
          fade: true,
          autoplay: false,
          speed: 3000,
          autoplaySpeed: 3500
        });

        $slider.waypoint(function () {
          $slider.slick('slickPlay');
        }, {
          offset: '85%'
        });

        $sliderItem.eq(0).addClass('is-current');
        $slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
          $sliderItem.eq(currentSlide).addClass('is-beforeCurrent');
          setTimeout(function () {
            $sliderItem.removeClass('is-beforeCurrent');
          }, 5000);

          if (nextSlide === 1) {
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
      };
    }();

    var _mvMenuAccordion = function () {
      var $accordionTrigger = $('.js-accordionTrigger');
      var $prevSellBtn = $('#js-prevSellBtn');
      var $prevBuyBtn = $('#js-prevBuyBtn');

      var _init = function _init() {
        $accordionTrigger.on('click', _show);
        $prevSellBtn.on('click', _show);
        $prevBuyBtn.on('click', _show);
      };

      var _show = function _show() {
        var $content = $(this).next('.js-accordionContent');
        $(this).toggleClass('is-showAccordion');
        $content.slideToggle(300);
        $accordionTrigger.not($(this)).next('.js-accordionContent').slideUp();
        $accordionTrigger.not($(this)).removeClass('is-showAccordion');
      };

      return {
        init: _init
      };
    }();

    var _mvMenuLayout = function () {

      var _init = function _init() {
        var menuSell = $('.mv_menu-sell');
        var menuBuy = $('.mv_menu-buy');
        var transformWidth = void 0;

        $win.on('load resize', function () {
          if (window.innerWidth > 2000) {
            transformWidth = (window.innerWidth - 2000) / 2;
            menuSell.css('transform', 'translateX(-100%) translateX(-' + transformWidth + 'px)');
            menuBuy.css('transform', 'translateX(100%) translateX(' + transformWidth + 'px)');
          }
        });
      };

      return {
        init: _init
      };
    }();

    var _mvOpenMenu = function () {

      var sellTrigger = $('#js-sellBtn');
      var buyTrigger = $('#js-buyBtn');
      var target = $('.mv_category');
      var prevSellBtn = $('#js-prevSellBtn');
      var prevBuyBtn = $('#js-prevBuyBtn');

      var _init = function _init() {
        _bind();
        _hover();
      };

      var _bind = function _bind() {
        sellTrigger.on('click', _toggleClassSell);
        prevSellBtn.on('click', _toggleClassSell);
        buyTrigger.on('click', _toggleClassBuy);
        prevBuyBtn.on('click', _toggleClassBuy);
      };

      var _hover = function _hover() {
        sellTrigger.on('mouseenter', function () {
          $body.addClass('is-sellHover');
        }).on('mouseout', function () {
          $body.removeClass('is-sellHover');
        });

        buyTrigger.on('mouseenter', function () {
          $body.addClass('is-buyHover');
        }).on('mouseout', function () {
          $body.removeClass('is-buyHover');
        });
      };

      var _toggleClassSell = function _toggleClassSell() {
        $body.toggleClass('is-sellVisible');
      };

      var _toggleClassBuy = function _toggleClassBuy() {
        $body.toggleClass('is-buyVisible');
      };

      return {
        init: _init
      };
    }();

    var _mvAnimation = function () {

      var $kv01a = $('.kv-01a');
      var $kv01b = $('.kv-01b');
      var $kv01c = $('.kv-01c');
      var $kv01d = $('.kv-01d');

      var $kv02a = $('.kv-02a');
      var $kv02b = $('.kv-02b');
      var $kv02c = $('.kv-02c');

      var $kv03a = $('.kv-03a');
      var $kv03b = $('.kv-03b');
      var $kv03c = $('.kv-03c');

      var $kv04a = $('.kv-04a');
      var $kv04b = $('.kv-04b');
      var $kv04c = $('.kv-04c');

      var $kv05a = $('.kv-05a');
      var $kv05b = $('.kv-05b');
      var $kv05c = $('.kv-05c');
      var $kv05d = $('.kv-05d');

      var $kv06a = $('.kv-06a');
      var $kv06b = $('.kv-06b');
      var $kv06c = $('.kv-06c');

      var $kv07a = $('.kv-07a');
      var $kv07b = $('.kv-07b');
      var $kv07c = $('.kv-07c');

      var $kv08a = $('.kv-08a');
      var $kv08b = $('.kv-08b');
      var $kv08c = $('.kv-08c');
      var $kv08d = $('.kv-08d');

      var time = 2000;

      var _init = function _init() {
        _start();
      };

      var _start = function _start() {
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

        setTimeout(function () {
          _anim01();
        }, time);
      };

      var _anim01 = function _anim01() {
        $kv01c.removeClass('is-current').removeClass('is-show').addClass('is-hide');
        $kv01b.removeClass('is-current').removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv01d.removeClass('is-current').removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv02c.removeClass('is-wait').addClass('is-show');
        $kv02b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function () {
          $kv01c.removeClass('is-hide').addClass('is-wait');
          $kv01b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv01d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim02();
        }, time);
      };

      var _anim02 = function _anim02() {
        $kv01a.removeClass('is-current').removeClass('is-show').addClass('is-hide');

        $kv02a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv01a.removeClass('is-hide').addClass('is-wait');
          _anim03();
        }, time);
      };

      var _anim03 = function _anim03() {
        $kv02c.removeClass('is-show').addClass('is-hide');
        $kv02b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv03c.removeClass('is-wait').addClass('is-show');
        $kv03b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function () {
          $kv02c.removeClass('is-hide').addClass('is-wait');
          $kv02b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim04();
        }, time);
      };

      var _anim04 = function _anim04() {
        $kv02a.removeClass('is-show').addClass('is-hide');

        $kv03a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv02a.removeClass('is-hide').addClass('is-wait');
          _anim05();
        }, time);
      };

      var _anim05 = function _anim05() {
        $kv03c.removeClass('is-show').addClass('is-hide');
        $kv03b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv04a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv03c.removeClass('is-hide').addClass('is-wait');
          $kv03b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim06();
        }, time);
      };

      var _anim06 = function _anim06() {
        $kv03a.removeClass('is-show').addClass('is-hide');

        $kv04c.removeClass('is-wait').addClass('is-show');
        $kv04b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function () {
          $kv03a.removeClass('is-hide').addClass('is-wait');
          _anim07();
        }, time);
      };

      var _anim07 = function _anim07() {
        $kv04a.removeClass('is-show').addClass('is-hide');
        $kv05a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv04a.removeClass('is-hide').addClass('is-wait');
          _anim08();
        }, time);
      };

      var _anim08 = function _anim08() {
        $kv04c.removeClass('is-show').addClass('is-hide');
        $kv04b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv05c.removeClass('is-wait').addClass('is-show');
        $kv05b.removeClass('is-wait').addClass('is-showDelay1');
        $kv05d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function () {
          $kv04c.removeClass('is-hide').addClass('is-wait');
          $kv04b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim09();
        }, time);
      };

      var _anim09 = function _anim09() {
        $kv05a.removeClass('is-show').addClass('is-hide');

        $kv06c.removeClass('is-wait').addClass('is-show');
        $kv06b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function () {
          $kv05a.removeClass('is-hide').addClass('is-wait');
          _anim10();
        }, time);
      };

      var _anim10 = function _anim10() {
        $kv05c.removeClass('is-show').addClass('is-hide');
        $kv05b.removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv05d.removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv06a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv05c.removeClass('is-hide').addClass('is-wait');
          $kv05b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv05d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim11();
        }, time);
      };

      var _anim11 = function _anim11() {
        $kv06c.removeClass('is-show').addClass('is-hide');
        $kv06b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv07a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv06c.removeClass('is-hide').addClass('is-wait');
          $kv06b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim12();
        }, time);
      };

      var _anim12 = function _anim12() {
        $kv06a.removeClass('is-show').addClass('is-hide');

        $kv07c.removeClass('is-wait').addClass('is-show');
        $kv07b.removeClass('is-wait').addClass('is-showDelay1');

        setTimeout(function () {
          $kv06a.removeClass('is-hide').addClass('is-wait');
          _anim13();
        }, time);
      };

      var _anim13 = function _anim13() {
        $kv07a.removeClass('is-show').addClass('is-hide');

        $kv08c.removeClass('is-wait').addClass('is-show');
        $kv08b.removeClass('is-wait').addClass('is-showDelay1');
        $kv08d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function () {
          $kv07a.removeClass('is-hide').addClass('is-wait');
          _anim14();
        }, time);
      };

      var _anim14 = function _anim14() {
        $kv07c.removeClass('is-show').addClass('is-hide');
        $kv07b.removeClass('is-showDelay1').addClass('is-hideDelay1');

        $kv08a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv07c.removeClass('is-hide').addClass('is-wait');
          $kv07b.removeClass('is-hideDelay1').addClass('is-wait');
          _anim15();
        }, time);
      };

      var _anim15 = function _anim15() {
        $kv08c.removeClass('is-show').addClass('is-hide');
        $kv08b.removeClass('is-showDelay1').addClass('is-hideDelay1');
        $kv08d.removeClass('is-showDelay2').addClass('is-hideDelay2');

        $kv01c.removeClass('is-wait').addClass('is-show');
        $kv01b.removeClass('is-wait').addClass('is-showDelay1');
        $kv01d.removeClass('is-wait').addClass('is-showDelay2');

        setTimeout(function () {
          $kv08c.removeClass('is-hide').addClass('is-wait');
          $kv08b.removeClass('is-hideDelay1').addClass('is-wait');
          $kv08d.removeClass('is-hideDelay2').addClass('is-wait');
          _anim16();
        }, time);
      };

      var _anim16 = function _anim16() {
        $kv08a.removeClass('is-show').addClass('is-hide');

        $kv01a.removeClass('is-wait').addClass('is-show');

        setTimeout(function () {
          $kv08a.removeClass('is-hide').addClass('is-wait');
          _anim01();
        }, time);
      };

      return {
        init: _init
      };
    }();

    return {
      init: _init
    };
  }();

  SECONDSTREET.Top.init();
})(jQuery);