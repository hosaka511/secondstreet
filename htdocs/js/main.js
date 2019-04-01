var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * jQueryオブジェクトの拡張
 *
 * @date 2018-01-30
 */
(function ($) {
  var jQueryEnhancers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (jQuery) {
    return jQuery;
  };

  /**
   * userAgent判定フラグ
   *
   * @date 2016-06-02
   */
  var ua = navigator.userAgent.toLowerCase();
  $.ua = {
    isWindows: /windows/.test(ua),
    isMac: /macintosh/.test(ua),
    isEdge: /edge/.test(ua),
    isIE: /msie (\d+)|trident/.test(ua),
    isLtIE9: /msie (\d+)/.test(ua) && RegExp.$1 < 9,
    isLtIE10: /msie (\d+)/.test(ua) && RegExp.$1 < 10,
    isFirefox: /firefox/.test(ua),
    isWebKit: /applewebkit/.test(ua),
    isChrome: /chrome/.test(ua),
    isSafari: /safari/.test(ua) && !/chrome/.test(ua) && !/mobile/.test(ua),
    isIOS: /i(phone|pod|pad)/.test(ua),
    isIOSChrome: /crios/.test(ua),
    isIPhone: /i(phone|pod)/.test(ua),
    isIPad: /ipad/.test(ua),
    isAndroid: /android/.test(ua),
    isAndroidMobile: /android(.+)?mobile/.test(ua),
    isTouchDevice: 'ontouchstart' in window,
    isMobile: /i(phone|pod)/.test(ua) || /android(.+)?mobile/.test(ua),
    isTablet: /ipad/.test(ua) || /android/.test(ua) && !/mobile/.test(ua)
  };

  /**
   * ロールオーバー
   *
   * @date 2012-10-01
   *
   * @example $('.rollover').rollover();
   * @example $('.rollover').rollover({ over: '-ov' });
   * @example $('.rollover').rollover({ current: '_cr', currentOver: '_cr_ov' });
   * @example $('.rollover').rollover({ down: '_click' });
   */
  $.fn.rollover = function (options) {
    var defaults = {
      over: '_ov',
      current: null,
      currentOver: null,
      down: null
    };
    var settings = $.extend({}, defaults, options);
    var over = settings.over;
    var current = settings.current;
    var currentOver = settings.currentOver;
    var down = settings.down;
    return this.each(function () {
      var src = this.src;
      var ext = /\.(gif|jpe?g|png)(\?.*)?/.exec(src)[0];
      var isCurrent = current && new RegExp(current + ext).test(src);
      if (isCurrent && !currentOver) return;
      var search = isCurrent && currentOver ? current + ext : ext;
      var replace = isCurrent && currentOver ? currentOver + ext : over + ext;
      var overSrc = src.replace(search, replace);
      new Image().src = overSrc;
      $(this).mouseout(function () {
        this.src = src;
      }).mouseover(function () {
        this.src = overSrc;
      });

      if (down) {
        var downSrc = src.replace(search, down + ext);
        new Image().src = downSrc;
        $(this).mousedown(function () {
          this.src = downSrc;
        });
      }
    });
  };

  /**
   * フェードロールオーバー
   *
   * @date 2012-11-21
   *
   * @example $('.faderollover').fadeRollover();
   * @example $('.faderollover').fadeRollover({ over: '-ov' });
   * @example $('.faderollover').fadeRollover({ current: '_cr', currentOver: '_cr_ov' });
   */
  $.fn.fadeRollover = function (options) {
    var defaults = {
      over: '_ov',
      current: null,
      currentOver: null
    };
    var settings = $.extend({}, defaults, options);
    var over = settings.over;
    var current = settings.current;
    var currentOver = settings.currentOver;
    return this.each(function () {
      var src = this.src;
      var ext = /\.(gif|jpe?g|png)(\?.*)?/.exec(src)[0];
      var isCurrent = current && new RegExp(current + ext).test(src);
      if (isCurrent && !currentOver) return;
      var search = isCurrent && currentOver ? current + ext : ext;
      var replace = isCurrent && currentOver ? currentOver + ext : over + ext;
      var overSrc = src.replace(search, replace);
      new Image().src = overSrc;

      $(this).parent().css('display', 'block').css('width', $(this).attr('width')).css('height', $(this).attr('height')).css('background', 'url("' + overSrc + '") no-repeat');

      $(this).parent().hover(function () {
        $(this).find('img').stop().animate({ opacity: 0 }, 200);
      }, function () {
        $(this).find('img').stop().animate({ opacity: 1 }, 200);
      });
    });
  };

  /**
   * スムーズスクロール
   *
   * @date 2018-01-30
   *
   * @example $.scroller();
   * @example $.scroller({ cancelByMousewheel: true });
   * @example $.scroller({ scopeSelector: '#container', noScrollSelector: '.no-scroll' });
   * @example $.scroller('#content');
   * @example $.scroller('#content', { marginTop: 200, callback: function() { console.log('callback')} });
   */
  $.scroller = function () {
    var self = $.scroller.prototype;
    if (!arguments[0] || _typeof(arguments[0]) === 'object') {
      self.init.apply(self, arguments);
    } else {
      self.scroll.apply(self, arguments);
    }
  };

  $.scroller.prototype = {
    defaults: {
      callback: function callback() {},
      cancelByMousewheel: false,
      duration: 500,
      easing: 'swing',
      hashMarkEnabled: false,
      marginTop: 0,
      noScrollSelector: '.noscroll',
      scopeSelector: 'body'
    },

    init: function init(options) {
      var self = this;
      var settings = this.settings = $.extend({}, this.defaults, options);
      $(settings.scopeSelector).find('a[href^="#"]').not(settings.noScrollSelector).each(function () {
        var hash = this.hash || '#';
        var eventName = 'click.scroller';

        if (hash !== '#' && !$(hash + ', a[name="' + hash.substr(1) + '"]').eq(0).length) {
          return;
        }

        $(this).off(eventName).on(eventName, function (e) {
          e.preventDefault();
          this.blur();
          self.scroll(hash, settings);
        });
      });
    },

    scroll: function scroll(id, options) {
      var settings = options ? $.extend({}, this.defaults, options) : this.settings ? this.settings : this.defaults;
      if (!settings.hashMarkEnabled && id === '#') return;

      var dfd = $.Deferred();
      var win = window;
      var doc = document;
      var $doc = $(doc);
      var $page = $('html, body');
      var scrollEnd = id === '#' ? 0 : $(id + ', a[name="' + id.substr(1) + '"]').eq(0).offset().top - settings.marginTop;
      var windowHeight = $.ua.isAndroidMobile ? Math.ceil(win.innerWidth / win.outerWidth * win.outerHeight) : win.innerHeight || doc.documentElement.clientHeight;
      var scrollableEnd = $doc.height() - windowHeight;
      if (scrollableEnd < 0) scrollableEnd = 0;
      if (scrollEnd > scrollableEnd) scrollEnd = scrollableEnd;
      if (scrollEnd < 0) scrollEnd = 0;
      scrollEnd = Math.floor(scrollEnd);

      $page.stop().animate({ scrollTop: scrollEnd }, {
        duration: settings.duration,
        easing: settings.easing,
        complete: function complete() {
          dfd.resolve();
        }
      });

      dfd.done(function () {
        settings.callback();
        $doc.off('.scrollerMousewheel', undefined, undefined, true);
      });

      if (settings.cancelByMousewheel) {
        var mousewheelEvent = 'onwheel' in document ? 'wheel.scrollerMousewheel' : 'mousewheel.scrollerMousewheel';
        $doc.one(mousewheelEvent, function () {
          dfd.reject();
          $page.stop();
        });
      }
    }
  };

  /**
   * 文字列からオブジェクトに変換したクエリを取得
   *
   * @example $.getQuery();
   * @example $.getQuery('a=foo&b=bar&c=foobar');
   */
  $.getQuery = function (str) {
    if (!str) str = location.search;
    str = str.replace(/^.*?\?/, '');
    var query = {};
    var temp = str.split(/&/);
    for (var i = 0, l = temp.length; i < l; i++) {
      var param = temp[i].split(/=/);
      query[param[0]] = decodeURIComponent(param[1]);
    }
    return query;
  };

  /**
   * 画像をプリロード
   *
   * @date 2012-09-12
   *
   * @example $.preLoadImages('/img/01.jpg');
   */
  var cache = [];
  $.preLoadImages = function () {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  };

  jQueryEnhancers($);
})(jQuery,
/**
 * jQueryEnhancers
 **/
function () {
  var $ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jQuery;

  var jQueryOffEventHelper = function jQueryOffEventHelper() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var $instance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $;

    /*
      ■目的
      従来のoff()関数を改修して、特定のイベントを決して削除しないoff()関数に拡張する
      ■前提
      ・jQueryを利用する
      ・jQueryのイベント系APIを利用
      */
    var settings = Object.assign({}, {
      namespace: '.unt', 
      events: 'touchstart mouseenter touchend mouseleave', 
      alias: '_off' 
    }, options);
    var namespace = settings.namespace,
        events = settings.events,
        alias = settings.alias;

    var _events = typeof events === 'string' ? events.split(' ') : _events;
    var NEVER_REMOVE_EVENTS = _events.map(function (e) {
      return '' + e + namespace;
    });

    var isjQueryInstance = typeof $instance.fn === 'undefined';
    if (isjQueryInstance) {
      $instance.__proto__[alias] = $.fn.off;
    } else if (typeof $instance.fn[alias] === 'undefined') {
      $instance.fn[alias] = $.fn.off;
    }
    var off = function off(types, selector, fn) {
      var _this = this;

      var useOriginalAPI = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (typeof useOriginalAPI === 'boolean' && useOriginalAPI) {
        this[alias](types, selector, fn);
        return this;
      }
      var compareEventNameWithList = function compareEventNameWithList(type) {
        return NEVER_REMOVE_EVENTS.filter(function (_eventName) {
          return _eventName === type;
        }).length > 0;
      };
      var type = void 0;
      if (types && types.preventDefault && types.handleObj) {
        var _types$handleObj = types.handleObj,
            _namespace = _types$handleObj.namespace,
            origType = _types$handleObj.origType,
            handler = _types$handleObj.handler;

        type = _namespace ? origType + '.' + _namespace : origType;
        if (!compareEventNameWithList(type)) {
          this[alias](type, selector, handler);
        }
        return this;
      }
      if (typeof types === 'string') {
        var _filteredEvents = function (types) {
          var _events = $._data(_this.get(0)).events;
          var origTypes = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(_events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _key = _step.value;

              origTypes.push.apply(origTypes, _toConsumableArray(_events[_key]));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return origTypes.filter(function (_type) {
            var origType = _type.origType,
                type = _type.type,
                namespace = _type.namespace;

            return (types.match(origType) != null || types.match(type) != null) && (types.match(/\./g) == null || types.match(namespace) != null && namespace != '') && !compareEventNameWithList(origType + '.' + namespace) && !compareEventNameWithList(type + '.' + namespace);
          });
        }(types);
        _filteredEvents.forEach(function (_event) {
          var type = _event.type,
              origType = _event.origType,
              namespace = _event.namespace,
              selector = _event.selector,
              handler = _event.handler;

          _this[alias](type + '.' + namespace, selector, handler);
          _this[alias](origType + '.' + namespace, selector, handler);
        });
        return this;
      }
    }; 
    $instance[isjQueryInstance ? '__proto__' : 'fn'].off = off; 
    return $instance;
  };

  /**
   * タッチデバイスにタッチイベント追加
   *
   * @date 2018-10-03
   *
   * @example $.enableTouchOver();
   * @example $.enableTouchOver('.touchhover');
   */
  $.enableTouchOver = function (target) {
    var namespace = '.unt';
    var events = 'touchstart mouseenter touchend mouseleave';
    var NEVER_REMOVE_EVENTS = events.split(' ').map(function (event) {
      return '' + (event + namespace);
    });

    var _NEVER_REMOVE_EVENTS = _slicedToArray(NEVER_REMOVE_EVENTS, 4),
        touchstart = _NEVER_REMOVE_EVENTS[0],
        mouseenter = _NEVER_REMOVE_EVENTS[1],
        touchend = _NEVER_REMOVE_EVENTS[2],
        mouseleave = _NEVER_REMOVE_EVENTS[3];

    if (target === undefined) {
      target = 'a, button, .js-touchHover';
    }
    if (!$.ua.isTouchDevice) {
      $('html').addClass('no-touchevents');
    } else {
      $('html').addClass('touchevents');
    }
    $(target).each(function (index, _target) {
      var _$$on;

      $(_target).on((_$$on = {}, _defineProperty(_$$on, touchstart + ' ' + mouseenter, function undefined() {
        $(this).addClass('is-touched');
      }), _defineProperty(_$$on, touchend + ' ' + mouseleave, function undefined() {
        $(this).removeClass('is-touched');
      }), _$$on));
    });
  };
});

/**
 * SECONDSTREET
 *
 * @date 2019-03-19
 */
var SECONDSTREET = function ($) {
  var mediaQuery = matchMedia('(max-width: 768px)');
  var _init = function _init() {

    $(function () {
      navHover.init();
      if (!$.ua.isTouchDevice) {
        $('.rollover').rollover();
      }
      if (!$.ua.isMobile) {
        $('a[href^="tel:"]').on('click', function (e) {
          e.preventDefault();
        });
      }
      if ($.ua.isIE) {
        document.querySelector('body').classList.add('is-IE');
      }
      if ($.ua.isEdge) {
        document.querySelector('body').classList.add('is-Edge');
      }
      $.scroller();
      hashScroll.init();
      pagetop();
      formStyle();
      filterSearchModal.init(); 
      diagnosisModal.init(); 
      bothPcSpAccordion.init();
      globalNavUI.init();

      $.enableTouchOver(); 
    });
  };

  var hashScroll = function () {
    var _init = function _init() {
      $(window).on('load', function () {
        _bind();
      });
    };
    var _bind = function _bind() {
      var anchorURL = $.getQuery().anchor;
      if (anchorURL) {
        setTimeout(function () {
          $.scroller('#' + anchorURL);
        }, 1000);
      }
    };
    return {
      init: _init
    };
  }();

  var pagetop = function pagetop() {
    var footHeight = $('.g-footer').height();
    var docHeight = $(document).innerHeight();
    var scrollPosition = $(window).innerHeight() + $(window).scrollTop();
    var scrollTop = void 0;

    handle(mediaQuery);
    mediaQuery.addListener(handle);

    function handle(mq) {
      if (!mq.matches) {

        $(window).on('resize', function () {
          footHeight = $('.g-footer').height();
        });

        $(window).on('load scroll', function () {
          scrollPosition = $(window).innerHeight() + $(window).scrollTop();
          scrollTop = $(window).scrollTop();
          if (scrollTop > 200) {
            $('body').addClass('is-showPagetop');
          } else {
            $('body').removeClass('is-showPagetop');
          }
          if (docHeight - scrollPosition <= footHeight) {
            $('body').addClass('is-fixPagetop');
          } else {
            $('body').removeClass('is-fixPagetop');
          }
        });
      }
    }
  };

  var formStyle = function formStyle() {
    $('.c-filterSearch_area_inner select').on('change', function () {
      $(this).css('color', '#000');
    });

    handle(mediaQuery);
    mediaQuery.addListener(handle);

    function handle(mq) {
      if (!mq.matches) {
        $('#js-changePlaceholder').attr('placeholder', 'フリーワード');
      } else {
        $('#js-changePlaceholder').attr('placeholder', 'フリーワードで店舗検索');
      }
    }
  };

  var filterSearchModal = function () {
    var current_scrollY = void 0;

    var _init = function _init() {
      _bind();
    };

    var _bind = function _bind() {
      $('.js-filterSearchModalTrigger').on('click', _open);
    };

    var _open = function _open() {
      $('.g-filterSearchModal').toggleClass('is-openFilterSearchModal');
      _layout();
    };

    var _layout = function _layout() {
      if ($('.g-filterSearchModal').hasClass('is-openFilterSearchModal')) {
        current_scrollY = $(window).scrollTop();
        $('html, body').prop({ scrollTop: 0 });
        $('.l-wrapper').css({
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          top: -1 * current_scrollY
        });
      } else {
        $('.l-wrapper').attr({ style: '' });
        $('html, body').prop({ scrollTop: current_scrollY });
      }
    };

    return {
      init: _init
    };
  }();

  var diagnosisModal = function () {
    var current_scrollY = void 0;
    var diagnosisFlag = true;

    var _init = function _init() {
      _bind();
      _nav();
    };

    var _nav = function _nav() {
      var categorys = [];
      var categorysBefore = void 0;

      var buttonList = document.querySelectorAll('.g-diagnosis_button');

      var button = Array.prototype.slice.call(buttonList, 0);

      button.forEach(function (element) {
        element.addEventListener('click', function (event) {
          onClickButton(event);
        });
      });

      function onClickButton(event) {

        var button = event.target;
        var targetCategory = button.dataset.category;
        var targetId = button.dataset.id;
        var ary = targetCategory.split(',');

        categorysBefore = {};

        categorysBefore.store = Boolean(ary[0]);
        categorysBefore.web = Boolean(ary[1]);
        categorysBefore.visit = Boolean(ary[2]);

        categorys[targetId] = categorysBefore; 


        if ($(button).hasClass('is-selected')) {
          for (var key in categorys) {
            if (key === targetId) {
              delete categorys[key];
            }
          }
        } else {
          categorys[targetId] = categorysBefore;
        }

        $(button).toggleClass('is-selected'); 


        var result1Ary = []; 

        for (var key in categorys) {
          var value = categorys[key]['store'];
          result1Ary.push(value);
        }

        var result1 = result1Ary.every(function (elem) {
          return elem;
        });

        var result2Ary = []; 

        for (var key in categorys) {
          var value = categorys[key]['web'];
          result2Ary.push(value);
        }

        var result2 = result2Ary.every(function (elem) {
          return elem;
        });

        var result3Ary = []; 

        for (var key in categorys) {
          var value = categorys[key]['visit'];
          result3Ary.push(value);
        }

        var result3 = result3Ary.every(function (elem) {
          return elem;
        });

        if (result1Ary.length === 0) {
          result1 = false;
        }
        if (result2Ary.length === 0) {
          result2 = false;
        }
        if (result3Ary.length === 0) {
          result3 = false;
        }

        if (result1) {
          $('.g-diagnosis_cagory_list_item-store').addClass('is-current');
          $('.g-diagnosis_cagory_list_item-store').find('a').attr('href', '/sell/store/');
        } else {
          $('.g-diagnosis_cagory_list_item-store').removeClass('is-current');
          $('.g-diagnosis_cagory_list_item-store').find('a').attr('href', 'javascript:void(0)');
        }

        if (result2) {
          $('.g-diagnosis_cagory_list_item-web').addClass('is-current');
          $('.g-diagnosis_cagory_list_item-web').addClass('is-currentWeb');
          $('.g-diagnosis_cagory_list_item-web').find('a').attr('href', '/sell/web/');
          $('.g-diagnosis_cagory_list_item-visit').addClass('is-currentWeb');
          $('.g-diagnosis_cagory').addClass('is-currentWeb');
          $('.g-diagnosis_cagory_balloon').addClass('is-currentWeb');
        } else {
          $('.g-diagnosis_cagory_list_item-web').removeClass('is-current');
          $('.g-diagnosis_cagory_list_item-web').removeClass('is-currentWeb');
          $('.g-diagnosis_cagory_list_item-web').find('a').attr('href', 'javascript:void(0)');
          $('.g-diagnosis_cagory_list_item-visit').removeClass('is-currentWeb');
          $('.g-diagnosis_cagory').removeClass('is-currentWeb');
          $('.g-diagnosis_cagory_balloon').removeClass('is-currentWeb');
        }

        if (result3) {
          $('.g-diagnosis_cagory_list_item-visit').addClass('is-current');
          $('.g-diagnosis_cagory_list_item-visit').find('a').attr('href', '/sell/visit/');
        } else {
          $('.g-diagnosis_cagory_list_item-visit').removeClass('is-current');
          $('.g-diagnosis_cagory_list_item-visit').find('a').attr('href', 'javascript:void(0)');
        }





      }
    };

    var _bind = function _bind() {
      $('.js-diagnosisModalTrigger').on('click', _open);

      handle(mediaQuery);
      mediaQuery.addListener(handle);

      function handle(mq) {
        if (mq.matches) {
          _triggerShow();
        }
      }
    };

    var _triggerShow = function _triggerShow() {
      var footHeight = $('.g-footer').height();
      var docHeight = $(document).innerHeight();
      var scrollPosition = window.innerHeight + $(window).scrollTop();

      $(window).on('resize', function () {
        footHeight = $('.g-footer').height();
      });

      $(window).on('load scroll', function () {
        scrollPosition = window.innerHeight + $(window).scrollTop();

        if (docHeight - scrollPosition <= footHeight) {
          $('.g-diagnosis_trigger').addClass('is-hideDiagnosisTrigger');
        } else {
          $('.g-diagnosis_trigger').removeClass('is-hideDiagnosisTrigger');
        }
      });
    };

    var _open = function _open() {
      $('.g-diagnosis_trigger').toggleClass('is-openDiagnosisModal');
      $('.g-diagnosis').toggleClass('is-openDiagnosisModal');

      if ($(this).hasClass('g-diagnosis_trigger') || $(this).hasClass('mv_menu_sellMethod')) {
        diagnosisFlag = false;
      }

      handle(mediaQuery);
      mediaQuery.addListener(handle);

      function handle(mq) {
        if (!mq.matches) {
          _layoutPc();
        } else {
          _layoutSp();
        }
      }
    };

    var _layoutPc = function _layoutPc() {

      if ($('.g-diagnosis').hasClass('is-openDiagnosisModal')) {

        current_scrollY = $(window).scrollTop();

        $('html').addClass('is-fixed');
        $('html, body').prop({ scrollTop: 0 });
        $('.l-wrapper').css({
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          top: -1 * current_scrollY
        });
      } else {

        $('html').removeClass('is-fixed');
        $('.l-wrapper').attr({ style: '' });
        $('html, body').prop({ scrollTop: current_scrollY });
      }
    };

    var _layoutSp = function _layoutSp() {

      if ($('.g-diagnosis').hasClass('is-openDiagnosisModal')) {

        current_scrollY = $(window).scrollTop();

        if (!$('.g-DrawerModal').hasClass('is-showDrawer')) {
          $('html, body').prop({ scrollTop: 0 });
          $('.l-wrapper').css({
            position: 'fixed',
            overflow: 'hidden',
            top: -1 * current_scrollY
          });
        }

        if ($('body').hasClass('is-showDrawer')) {
          $('body').toggleClass('is-showDrawer');
        }
      } else {

        if (!$('.g-DrawerModal').hasClass('is-showDrawer')) {
          $('.l-wrapper').attr({ style: '' });
        }

        if (diagnosisFlag) {
          $('body').toggleClass('is-showDrawer');
        } else {
          diagnosisFlag = true;
        }
        $('html, body').prop({ scrollTop: current_scrollY });
      }
    };

    return {
      init: _init
    };
  }();

  var bothPcSpAccordion = function () {
    var $trigger = $('.js-bothPcSpAccordionTrigger');
    var $close = $('.js-bothPcSpAccordionCloseBtn');

    var _init = function _init() {
      _bind();
    };

    var _bind = function _bind() {
      $trigger.on('click', _show);
      $close.on('click', _close);
    };

    var _show = function _show() {
      var $accordionContent = $(this).next('.js-bothPcSpAccordionContent');
      $(this).toggleClass('is-show');
      $accordionContent.slideToggle(600);
    };

    var _close = function _close() {
      var $parent = $(this).closest('.c-accordion');
      var $prev = $parent.prev('a');
      var $accordionContent = $parent.find('.js-bothPcSpAccordionContent');
      var toggleID = $prev.attr('id');

      $.scroller('#' + toggleID, { marginTop: 0, callback: function callback() {
          $parent.find('.js-bothPcSpAccordionTrigger').toggleClass('is-show');
          $accordionContent.stop().slideUp(600);
        } });
    };

    return {
      init: _init
    };
  }();

  var onlySpAccordion = function () {
    var $trigger = $('.js-onlySpAccordionTrigger');

    var _init = function _init() {
      _bind();
    };

    var _bind = function _bind() {
      $trigger.on('click', _show);

      $(window).resize(function () {
        var x = $(window).width();
        var y = 768;
        if (x <= y) {
          $trigger.addClass('sp');
          $('.js-onlySpAccordionTrigger:not(.is-show)').next().hide();
        } else {
          $trigger.removeClass('sp');
          $trigger.next().show();
        }
      }).trigger('resize');
    };

    var _show = function _show() {
      var mq = window.matchMedia('(max-width: 768px)');
      var $accordionContent = $(this).next('.js-onlySpAccordionContent');

      if (mq.matches) {
        $(this).toggleClass('is-show');
        $accordionContent.slideToggle(600);
      }
    };

    return {
      init: _init
    };
  }();

  var globalNavUI = function () {
    var $jsToggle = $('.js-toggle');
    var $this = void 0;
    var current_scrollY = void 0;

    var _init = function _init() {
      _bind();
    };

    var _bind = function _bind() {
      $jsToggle.on('click', _subToggleMenu);
      $('.g-header_toggleDrawer_btn').on('click', _toggleMenu);
      $('.g-DrawerModal_mask').on('click', _toggleMenu);
    };

    var _toggleMenu = function _toggleMenu() {

      $('.g-DrawerModal').toggleClass('is-showDrawer');
      $('.g-header_toggleDrawer_btn').toggleClass('is-showDrawer');
      $('body').toggleClass('is-showDrawer'); 

      if ($('.g-DrawerModal').hasClass('is-showDrawer')) {
        current_scrollY = $(window).scrollTop();
        $('html, body').prop({ scrollTop: 0 });
        $('.l-wrapper').css({
          position: 'fixed',
          overflow: 'hidden',
          top: -1 * current_scrollY
        });
      } else {
        $('.l-wrapper').attr({ style: '' });
        $('html, body').prop({ scrollTop: current_scrollY });
        $('.g-header *').removeClass('is-sideCurrent');
        $('.g-header *').removeClass('is-current');
        $('.g-header *').removeClass('is-showSubDrawer');
        $('.g-header *').removeClass('is-toggle-side');
      }
    };

    var _subToggleMenu = function _subToggleMenu() {
      $this = $(this);
      if ($('.js-toggle-side').not($this).next('.g-DrawerModal_subList').hasClass('is-showSubDrawer') && $this.hasClass('js-toggle-side')) {

        $('.js-toggle-side').not($this).next('.g-DrawerModal_subList').removeClass('is-showSubDrawer');
        $('.js-toggle-side').not($this).removeClass('is-current');
        $this.addClass('is-current');
        setTimeout(function () {
          _toggleClassState($this);
          _toggleAbsolute($this);

          if ($('.js-toggle-side').next('.g-DrawerModal_subList').hasClass('is-showSubDrawer')) {
            $('.g-DrawerModal_list').addClass('is-sideCurrent');
          } else {
            $('.g-DrawerModal_list').removeClass('is-sideCurrent');
          }
        }, 500);
      } else {
        $this.toggleClass('is-current');
        _toggleClassState($this);
        _toggleAbsolute($this);

        if ($('.js-toggle-side').next('.g-DrawerModal_subList').hasClass('is-showSubDrawer')) {
          $('.g-DrawerModal_list').addClass('is-sideCurrent');
        } else {
          $('.g-DrawerModal_list').removeClass('is-sideCurrent');
        }
      }
    };

    var _toggleClassState = function _toggleClassState($thisElm) {
      if ($thisElm.hasClass('js-toggle-side')) {

        if ($thisElm.hasClass('is-showSubDrawer')) {
          $thisElm.next('.g-DrawerModal_subList').toggleClass('is-showSubDrawer');
        } else {
          $('.js-toggle-side').removeClass('is-showSubDrawer');
          $thisElm.next('.g-DrawerModal_subList').toggleClass('is-showSubDrawer');
        }
      } else {
        $thisElm.next('.g-DrawerModal_subList').toggleClass('is-showSubDrawer');
      }
    };

    var _toggleAbsolute = function _toggleAbsolute($thisElm) {

      if ($thisElm.hasClass('js-toggle-side')) {
        if ($('.js-toggle-side + .g-DrawerModal_subList').hasClass('is-showSubDrawer') && !$thisElm.hasClass('js-toggle-noAbsolute')) {
          $('.js-toggle-noAbsolute').parent().addClass('is-toggle-side');
        } else if ($thisElm.hasClass('js-toggle-noAbsolute')) {
          $('.js-toggle-noAbsolute').parent().removeClass('is-toggle-side');
        }
      }
    };

    return {
      init: _init
    };
  }();

  var navHover = function () {
    var overTimer1 = void 0,
        overTimer2 = void 0,
        overTimer3 = void 0;
    var outTimer1 = void 0,
        outTimer2 = void 0,
        outTimer3 = void 0;
    var hoverNum = void 0;
    var _init = function _init() {
      _bind();
    };

    var _bind = function _bind() {
      $('.js-headermenu').on({ 'mouseenter': _over, 'mouseleave': _out });
    };

    var _over = function _over(e) {
      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        clearTimeout(outTimer1);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        clearTimeout(outTimer2);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        clearTimeout(outTimer3);
      }

      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        overTimer1 = setTimeout(function () {
          _overTimeout(e.currentTarget);
        }, 200);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        overTimer2 = setTimeout(function () {
          _overTimeout(e.currentTarget);
        }, 200);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        overTimer3 = setTimeout(function () {
          _overTimeout(e.currentTarget);
        }, 200);
      }
    };

    var _out = function _out(e) {
      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        clearTimeout(overTimer1);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        clearTimeout(overTimer2);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        clearTimeout(overTimer3);
      }

      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        outTimer1 = setTimeout(function () {
          _outTimeout(e.currentTarget);
        }, 400);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        outTimer2 = setTimeout(function () {
          _outTimeout(e.currentTarget);
        }, 400);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        outTimer3 = setTimeout(function () {
          _outTimeout(e.currentTarget);
        }, 400);
      }
    };

    var _overTimeout = function _overTimeout(elm) {
      if ($(elm).hasClass('g-nav_item')) {
        $(elm).addClass('is-hover-nav');
      }
    };

    var _outTimeout = function _outTimeout(elm) {
      if ($(elm).hasClass('g-nav_item')) {
        $(elm).removeClass('is-hover-nav');
      } else {
        $(elm).parent('.g-nav_item').removeClass('is-hover-nav');
      }
    };

    return {
      init: _init
    };
  }();

  return {
    init: function init() {
      window.console = window.console || {
        log: function log() {}
      };
      _init();
    }
  };
}(jQuery);

SECONDSTREET.init();