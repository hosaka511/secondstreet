/**
 * jQueryオブジェクトの拡張
 *
 * @date 2018-01-30
 */
(function($, jQueryEnhancers = (jQuery) => { return jQuery; }) {
  /**
   * userAgent判定フラグ
   *
   * @date 2016-06-02
   */
  const ua = navigator.userAgent.toLowerCase();
  $.ua = {
    // Windows
    isWindows: /windows/.test(ua),
    // Mac
    isMac: /macintosh/.test(ua),
    // Edge
    isEdge: /edge/.test(ua),
    // IE
    isIE: /msie (\d+)|trident/.test(ua),
    // IE9未満
    isLtIE9: /msie (\d+)/.test(ua) && RegExp.$1 < 9,
    // IE10未満
    isLtIE10: /msie (\d+)/.test(ua) && RegExp.$1 < 10,
    // Firefox
    isFirefox: /firefox/.test(ua),
    // WebKit
    isWebKit: /applewebkit/.test(ua),
    // Chrome
    isChrome: /chrome/.test(ua),
    // Safari
    isSafari: /safari/.test(ua) && (!/chrome/.test(ua)) && (!/mobile/.test(ua)),
    // iOS
    isIOS: /i(phone|pod|pad)/.test(ua),
    // iOS Chrome
    isIOSChrome: /crios/.test(ua),
    // iPhone、iPod touch
    isIPhone: /i(phone|pod)/.test(ua),
    // iPad
    isIPad: /ipad/.test(ua),
    // Android
    isAndroid: /android/.test(ua),
    // モバイル版Android
    isAndroidMobile: /android(.+)?mobile/.test(ua),
    // タッチデバイス
    isTouchDevice: 'ontouchstart' in window,
    // スマートフォン
    isMobile: /i(phone|pod)/.test(ua) || /android(.+)?mobile/.test(ua),
    // タブレット型端末
    isTablet: /ipad/.test(ua) || /android/.test(ua) && (!/mobile/.test(ua))
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
  $.fn.rollover = function(options) {
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
    return this.each(function() {
      var src = this.src;
      var ext = /\.(gif|jpe?g|png)(\?.*)?/.exec(src)[0];
      var isCurrent = current && new RegExp(current + ext).test(src);
      if (isCurrent && !currentOver) return;
      var search = (isCurrent && currentOver) ? current + ext : ext;
      var replace = (isCurrent && currentOver) ? currentOver + ext : over + ext;
      var overSrc = src.replace(search, replace);
      new Image().src = overSrc;
      $(this).mouseout(function() {
        this.src = src;
      }).mouseover(function() {
        this.src = overSrc;
      });

      if (down) {
        var downSrc = src.replace(search, down + ext);
        new Image().src = downSrc;
        $(this).mousedown(function() {
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
  $.fn.fadeRollover = function(options) {
    var defaults = {
      over: '_ov',
      current: null,
      currentOver: null
    };
    var settings = $.extend({}, defaults, options);
    var over = settings.over;
    var current = settings.current;
    var currentOver = settings.currentOver;
    return this.each(function() {
      var src = this.src;
      var ext = /\.(gif|jpe?g|png)(\?.*)?/.exec(src)[0];
      var isCurrent = current && new RegExp(current + ext).test(src);
      if (isCurrent && !currentOver) return;
      var search = (isCurrent && currentOver) ? current + ext : ext;
      var replace = (isCurrent && currentOver) ? currentOver + ext : over + ext;
      var overSrc = src.replace(search, replace);
      new Image().src = overSrc;

      $(this).parent()
        .css('display', 'block')
        .css('width', $(this).attr('width'))
        .css('height', $(this).attr('height'))
        .css('background', 'url("' + overSrc + '") no-repeat');

      $(this).parent().hover(function() {
        $(this).find('img').stop().animate({ opacity: 0 }, 200);
      }, function() {
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
  $.scroller = function() {
    const self = $.scroller.prototype;
    if (!arguments[0] || typeof arguments[0] === 'object') {
      self.init.apply(self, arguments);
    } else {
      self.scroll.apply(self, arguments);
    }
  };

  $.scroller.prototype = {
    // 初期設定
    defaults: {
      callback: function() {},
      cancelByMousewheel: false,
      duration: 500,
      easing: 'swing',
      hashMarkEnabled: false,
      marginTop: 0,
      noScrollSelector: '.noscroll',
      scopeSelector: 'body'
    },

    // 初期化
    init: function(options) {
      const self = this;
      const settings = this.settings = $.extend({}, this.defaults, options);
      $(settings.scopeSelector).find('a[href^="#"]').not(settings.noScrollSelector).each(function() {
        const hash = this.hash || '#';
        const eventName = 'click.scroller';

        if (hash !== '#' && !$(hash + ', a[name="' + hash.substr(1) + '"]').eq(0).length) {
          return;
        }

        $(this).off(eventName).on(eventName, function(e) {
          e.preventDefault();
          this.blur();
          self.scroll(hash, settings);
        });
      });
    },

    // スクロールを実行
    scroll: function(id, options) {
      const settings = (options) ? $.extend({}, this.defaults, options) : (this.settings) ? this.settings : this.defaults;
      if (!settings.hashMarkEnabled && id === '#') return;

      const dfd = $.Deferred();
      const win = window;
      const doc = document;
      const $doc = $(doc);
      const $page = $('html, body');
      let scrollEnd = (id === '#') ? 0 : $(id + ', a[name="' + id.substr(1) + '"]').eq(0).offset().top - settings.marginTop;
      const windowHeight = ($.ua.isAndroidMobile) ? Math.ceil(win.innerWidth / win.outerWidth * win.outerHeight) : win.innerHeight || doc.documentElement.clientHeight;
      let scrollableEnd = $doc.height() - windowHeight;
      if (scrollableEnd < 0) scrollableEnd = 0;
      if (scrollEnd > scrollableEnd) scrollEnd = scrollableEnd;
      if (scrollEnd < 0) scrollEnd = 0;
      scrollEnd = Math.floor(scrollEnd);

      $page.stop().animate({ scrollTop: scrollEnd }, {
        duration: settings.duration,
        easing: settings.easing,
        complete: function() {
          dfd.resolve();
        }
      });

      dfd.done(function() {
        settings.callback();
        $doc.off('.scrollerMousewheel', undefined, undefined, true);
        // $doc.off('.scrollerMousewheel');
      });

      if (settings.cancelByMousewheel) {
        const mousewheelEvent = 'onwheel' in document ? 'wheel.scrollerMousewheel' : 'mousewheel.scrollerMousewheel';
        $doc.one(mousewheelEvent, function() {
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
  $.getQuery = function(str) {
    if (!str) str = location.search;
    str = str.replace(/^.*?\?/, '');
    let query = {};
    const temp = str.split(/&/);
    for (var i = 0, l = temp.length; i < l; i++) {
      let param = temp[i].split(/=/);
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
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  };

  // jQueryEnhancersの有効化
  // もし、なにも拡張したくなかったら、コメントアウト
  jQueryEnhancers($);

})(jQuery,
  /**
   * jQueryEnhancers
   **/
  ($ = jQuery) => {
    const jQueryOffEventHelper = (options = {}, $instance = $) => {
      /*
        ■目的
        従来のoff()関数を改修して、特定のイベントを決して削除しないoff()関数に拡張する
        ■前提
        ・jQueryを利用する
        ・jQueryのイベント系APIを利用
        */
      const settings = Object.assign({}, {
        namespace: '.unt', // 削除禁止イベントの名前空間
        events: 'touchstart mouseenter touchend mouseleave', // 削除禁止イベント名リスト
        alias: '_off' // off()関数の退避先の関数名
      }, options);
      const { namespace, events, alias } = settings;
      // 名前空間付きの削除禁止イベント名リストを作成（配列）
      const _events = typeof events === 'string' ? events.split(' ') : _events;
      const NEVER_REMOVE_EVENTS = _events.map(e => `${e}${namespace}`);

      // jQuery.off()関数を別名でコピー。退避させる
      const isjQueryInstance = typeof $instance.fn === 'undefined';
      if (isjQueryInstance) {
        $instance.__proto__[alias] = $.fn.off;
      } else if (typeof $instance.fn[alias] === 'undefined') {
        $instance.fn[alias] = $.fn.off;
      }
      // jQuery.off()のデコレータ（ヘルパ）関数を作成
      // 参照 jQuery at src/event.js on github（ソースコード）
      // https://github.com/jquery/jquery/blob/master/src/event.js
      const off = function(types, selector, fn, useOriginalAPI = false) {
        // 第４引数がBoolean型でtrueを指定した場合は、オリジナルのoff()関数を実行
        if (typeof useOriginalAPI === 'boolean' && useOriginalAPI) {
          // alert('従来のoff()関数を実行し、イベントを削除します');
          this[alias](types, selector, fn);
          return this;
        }
        // 削除してはダメなリストとoff()の引数で送られてきたイベント名の照合
        // 照合して削除禁止イベント名に該当した場合、trueを返す関数
        const compareEventNameWithList = type => NEVER_REMOVE_EVENTS.filter(_eventName => _eventName === type).length > 0;
        let type;
        // 引数のtypesがjQueryイベントインスタンスだった場合の処理。ソースコードより一部改修
        // ※通常、あまり使われない引数のパターン
        if (types && types.preventDefault && types.handleObj) {
          const { namespace, origType, handler } = types.handleObj;
          type = namespace ? `${origType}.${namespace}` : origType;
          // 禁止リストに含まれてなければ、イベント削除
          if (!compareEventNameWithList(type)) {
            this[alias](type, selector, handler);
          }
          return this;
        }
        // 引数のtypesの型がString型だった場合の処理。ソースコードより大幅改修
        // 一番利用される引数の型。ここがメインとなる処理
        if (typeof types === 'string') {
          // 禁止リストに含まれていないイベントを抽出
          const _filteredEvents = (types => {
            // jQueryコアが独自に持つ、jQueryインスタンスごとのイベントリストを参照
            // $._data([jQueryインスタンスのDOM]).events
            const _events = $._data(this.get(0)).events;
            let origTypes = [];
            // イベントリストを平たくする（この後のフィルタ処理を実行しやすくする）
            for (let _key of Object.keys(_events)) {
              origTypes.push(..._events[_key]);
            }
            // 平たくしたイベントリストから削除禁止イベント以外のイベントを抽出
            return origTypes.filter(_type => {
              const { origType, type, namespace } = _type;
              return (types.match(origType) != null || types.match(type) != null) &&
                (types.match(/\./g) == null || (types.match(namespace) != null && namespace != '')) &&
                !compareEventNameWithList(`${origType}.${namespace}`) &&
                !compareEventNameWithList(`${type}.${namespace}`);
            });
          })(types);
          // 削除対象イベントを削除
          _filteredEvents.forEach(_event => {
            const { type, origType, namespace, selector, handler } = _event;
            this[alias](`${type}.${namespace}`, selector, handler);
            this[alias](`${origType}.${namespace}`, selector, handler);
          });
          return this;
        }
      }; // jQuery.off()関数ヘルパー 終了
      $instance[isjQueryInstance ? '__proto__' : 'fn'].off = off; // jQueryインスタンスのoffプロパティにヘルパ関数をアサイン
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
    $.enableTouchOver = function(target) {
      // 準備
      const namespace = '.unt';
      const events = 'touchstart mouseenter touchend mouseleave';
      const NEVER_REMOVE_EVENTS = events.split(' ').map(event => `${event + namespace}`);
      const [touchstart, mouseenter, touchend, mouseleave] = NEVER_REMOVE_EVENTS;
      // jQueryOffEventHelper({}, $); // off()関数ヘルパを適用（jQuery自体を拡張）
      // 準備ここまで

      if (target === undefined) {
        target = 'a, button, .js-touchHover';
      }
      if (!$.ua.isTouchDevice) {
        $('html').addClass('no-touchevents');
      } else {
        $('html').addClass('touchevents');
      }
      $(target).each((index, _target) => {
        // jQueryOffEventHelper({}, $(_target)); // jQueryオブジェクト（インスタンス）ごとにoff()関数ヘルパを適用
        $(_target).on({
          [`${touchstart} ${mouseenter}`]() {
            $(this).addClass('is-touched');
          },
          [`${touchend} ${mouseleave}`]() {
            $(this).removeClass('is-touched');
          }
        });
      });
    };

  }
);



/**
 * SECONDSTREET
 *
 * @date 2019-03-19
 */
const SECONDSTREET = function($) {
  let mediaQuery = matchMedia('(max-width: 768px)');
  // 初期化
  const _init = function() {

    $(function() {
      navHover.init();
      if (!$.ua.isTouchDevice) {
        $('.rollover').rollover();
      }
      if (!$.ua.isMobile) {
        $('a[href^="tel:"]').on('click', function(e) {
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
      filterSearchModal.init(); //条件検索モーダル
      diagnosisModal.init(); //診断モーダル
      bothPcSpAccordion.init();
      // onlySpAccordion.init();
      globalNavUI.init();

      // ここから$.enableTouchOver()の検証用コード
      // 278行目あたりのjQueryEnhancers()関数を有効化していないと、$.enableTouchOver()関数が使用できずにエラーになる（※デフォルト有効になっています）
      $.enableTouchOver(); // 引数に何も入れないと、a要素, button要素, .js-touchHoverセレクタが対象となる

    });
  };




  /****
   *
   * パラメータのページ遷移
   *
   */
  const hashScroll = function() {
    const _init = () => {
      $(window).on('load', function() {
        _bind();
      });
    };
    const _bind = () => {
      let anchorURL = $.getQuery().anchor;
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



  /****
   *
   * ページトップボタン
   *
   */
  const pagetop = function() {
    let footHeight = $('.g-footer').height();
    let docHeight = $(document).innerHeight();
    let scrollPosition = $(window).innerHeight() + $(window).scrollTop();
    let scrollTop;

    handle(mediaQuery);
    mediaQuery.addListener(handle);

    function handle(mq) {
      if (!mq.matches) {

        $(window).on('resize', function() {
          footHeight = $('.g-footer').height();
        });

        $(window).on('load scroll', function() {
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



  /****
   *
   * フォーム周り
   *
   */
   const formStyle = function() {
    $('.c-filterSearch_area_inner select').on('change', function(){
      $(this).css('color','#000');
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



  /****
   *
   * 条件検索モーダル
   *
   */
  const filterSearchModal = function() {
    let current_scrollY;

    const _init = () => {
      _bind();
    };

    const _bind = () => {
      $('.js-filterSearchModalTrigger').on('click', _open);
    };

    const _open = function() {
      $('.g-filterSearchModal').toggleClass('is-openFilterSearchModal');
      _layout();
    };

    const _layout = function() {
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



  /****
   *
   * 診断モーダル
   *
   */
  const diagnosisModal = function() {
    let current_scrollY;
    let diagnosisFlag = true;

    const _init = () => {
      _bind();
      _nav();
    };


    const _nav = () => {
      let categorys = [];
      let categorysBefore;

      let buttonList = document.querySelectorAll('.g-diagnosis_button');

      let button = Array.prototype.slice.call(buttonList, 0);

      button.forEach(function(element) {
        element.addEventListener('click', (event) => {
          onClickButton(event);
        });
      });


      function onClickButton(event) {

        const button = event.target;
        const targetCategory = button.dataset.category;
        const targetId = button.dataset.id;
        const ary = targetCategory.split(',');

        categorysBefore = {};

        categorysBefore.store = Boolean(ary[0]);
        categorysBefore.web = Boolean(ary[1]);
        categorysBefore.visit = Boolean(ary[2]);

        categorys[targetId] = categorysBefore; //ここまででオブジェクト作成


        if ($(button).hasClass('is-selected')) {
          for (var key in categorys) { //keyを比較してオブジェクトを削除
            if (key === targetId) {
              delete categorys[key];
            }
          }
        } else {
          categorys[targetId] = categorysBefore;
        }

        $(button).toggleClass('is-selected'); //残ったオブジェクトにclassを付与


        var result1Ary = []; //storeのどれかがfalseならfalseを返す

        for (var key in categorys) {
          var value = categorys[key]['store'];
          result1Ary.push(value);
        }

        var result1 = result1Ary.every(function(elem) {
          return elem;
        });


        var result2Ary = []; //webのどれかがfalseならfalseを返す

        for (var key in categorys) {
          var value = categorys[key]['web'];
          result2Ary.push(value);
        }

        var result2 = result2Ary.every(function(elem) {
          return elem;
        });


        var result3Ary = []; //visitのどれかがfalseならfalseを返す

        for (var key in categorys) {
          var value = categorys[key]['visit'];
          result3Ary.push(value);
        }

        var result3 = result3Ary.every(function(elem) {
          return elem;
        });

        if (result1Ary.length === 0) { //配列が空ならfalseを返す
          result1 = false;
        }
        if (result2Ary.length === 0) {
          result2 = false;
        }
        if (result3Ary.length === 0) {
          result3 = false;
        }

        if (result1) { //上記の結果でclassを付与
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

        // console.log('resu1：' + result1)
        // console.log('resu2：' + result2)
        // console.log('resu3：' + result3)
        // console.log(categorys)
        // console.log(result3Ary)
        // console.log(categorys['a']['visit'])


        //上記の「storeのどれかがfalseならfalseを返す」から「visitのどれかがfalseならfalseを返す」までは以下でも可。
        // let stores = [];
        // let webs = [];
        // let visits = [];

        // let keys = Object.keys(categorys);
        // for (let i = 0; i < keys.length; i++) {
        //   let key = keys[i]; //キー単体
        //   stores.push(categorys[key].store);
        //   webs.push(categorys[key].web);
        //   visits.push(categorys[key].visit);
        // }
        // console.log("stores：" + stores);
        // console.log("webs：" + webs);
        // console.log("visits：" + visits);

        // let result1 = stores.every(function(store){
        //   return store;
        // });
        // let result2 = webs.every(function(web){
        //   return web;
        // });
        // let result3 = visits.every(function(visit){
        //   return visit;
        // });

      }

    };


    const _bind = () => {
      $('.js-diagnosisModalTrigger').on('click', _open);

      handle(mediaQuery);
      mediaQuery.addListener(handle);

      function handle(mq) {
        if (mq.matches) {
          _triggerShow();
        }
      }

    };

    const _triggerShow = function() {
      let footHeight = $('.g-footer').height();
      let docHeight = $(document).innerHeight();
      let scrollPosition = window.innerHeight + $(window).scrollTop();

      $(window).on('resize', function() {
        footHeight = $('.g-footer').height();
      });

      $(window).on('load scroll', function() {
        scrollPosition = window.innerHeight + $(window).scrollTop();

        if (docHeight - scrollPosition <= footHeight) {
          $('.g-diagnosis_trigger').addClass('is-hideDiagnosisTrigger');
        } else {
          $('.g-diagnosis_trigger').removeClass('is-hideDiagnosisTrigger');
        }
      });

    };


    const _open = function() {
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


    const _layoutPc = function() {

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


    const _layoutSp = function() {

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



  /****
   *
   * PCでもSPでも有効なAccordion
   *
   */
  const bothPcSpAccordion = function() {
    const $trigger = $('.js-bothPcSpAccordionTrigger');
    const $close = $('.js-bothPcSpAccordionCloseBtn');

    const _init = function() {
      _bind();
    };

    const _bind = function() {
      $trigger.on('click', _show);
      $close.on('click', _close);
    };

    const _show = function() {
      const $accordionContent = $(this).next('.js-bothPcSpAccordionContent');
      $(this).toggleClass('is-show');
      $accordionContent.slideToggle(600);
    };

    const _close = function() {
      let $parent = $(this).closest('.c-accordion');
      let $prev = $parent.prev('a');
      let $accordionContent = $parent.find('.js-bothPcSpAccordionContent');
      let toggleID = $prev.attr('id');

      $.scroller('#' + toggleID, { marginTop: 0, callback: function(){
        $parent.find('.js-bothPcSpAccordionTrigger').toggleClass('is-show');
        $accordionContent.stop().slideUp(600);
      }});
    };

    return {
      init: _init
    };
  }();



  /****
   *
   * SPのみ有効なAccordion
   *
   */
  const onlySpAccordion = function() {
    const $trigger = $('.js-onlySpAccordionTrigger');

    const _init = function() {
      _bind();
    };

    const _bind = function() {
      $trigger.on('click', _show);

      $(window).resize(function() {
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

    const _show = function() {
      const mq = window.matchMedia('(max-width: 768px)');
      const $accordionContent = $(this).next('.js-onlySpAccordionContent');

      if (mq.matches) {
        $(this).toggleClass('is-show');
        $accordionContent.slideToggle(600);
      }
    };

    return {
      init: _init
    };
  }();



  /****
   *
   * SP GlobalMenu
   *
   */
  const globalNavUI = function() {
    let $jsToggle = $('.js-toggle');
    let $this;
    let current_scrollY;

    const _init = () => {
      _bind();
    };

    const _bind = () => {
      $jsToggle.on('click', _subToggleMenu);
      $('.g-header_toggleDrawer_btn').on('click', _toggleMenu);
      $('.g-DrawerModal_mask').on('click', _toggleMenu);
    };

    const _toggleMenu = function() {

      $('.g-DrawerModal').toggleClass('is-showDrawer');
      $('.g-header_toggleDrawer_btn').toggleClass('is-showDrawer');
      $('body').toggleClass('is-showDrawer'); //診断モーダルの判定で必要

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

    const _subToggleMenu = function() {
      $this = $(this);
      if ($('.js-toggle-side').not($this).next('.g-DrawerModal_subList').hasClass('is-showSubDrawer') && $this.hasClass('js-toggle-side')) {

        $('.js-toggle-side').not($this).next('.g-DrawerModal_subList').removeClass('is-showSubDrawer');
        $('.js-toggle-side').not($this).removeClass('is-current');
        $this.addClass('is-current');
        setTimeout(function() {
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

    const _toggleClassState = function($thisElm) {
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

    const _toggleAbsolute = function($thisElm) {

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



  /****
   *
   * navHover
   *
   */
  const navHover = function() {
    let overTimer1,
      overTimer2,
      overTimer3;
    let outTimer1,
      outTimer2,
      outTimer3;
    let hoverNum;
    const _init = () => {
      _bind();
    };

    const _bind = () => {
      $('.js-headermenu').on({ 'mouseenter': _over, 'mouseleave': _out });
    };

    const _over = (e) => {
      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        clearTimeout(outTimer1);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        clearTimeout(outTimer2);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        clearTimeout(outTimer3);
      }

      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        overTimer1 = setTimeout(function() {
          _overTimeout(e.currentTarget);
        }, 200);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        overTimer2 = setTimeout(function() {
          _overTimeout(e.currentTarget);
        }, 200);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        overTimer3 = setTimeout(function() {
          _overTimeout(e.currentTarget);
        }, 200);
      }
    };

    const _out = (e) => {
      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        clearTimeout(overTimer1);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        clearTimeout(overTimer2);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        clearTimeout(overTimer3);
      }

      if ($(e.currentTarget).hasClass('js-headermenu-1')) {
        outTimer1 = setTimeout(function() {
          _outTimeout(e.currentTarget);
        }, 400);
      } else if ($(e.currentTarget).hasClass('js-headermenu-2')) {
        outTimer2 = setTimeout(function() {
          _outTimeout(e.currentTarget);
        }, 400);
      } else if ($(e.currentTarget).hasClass('js-headermenu-3')) {
        outTimer3 = setTimeout(function() {
          _outTimeout(e.currentTarget);
        }, 400);
      }
    };

    const _overTimeout = (elm) => {
      if ($(elm).hasClass('g-nav_item')) {
        $(elm).addClass('is-hover-nav');
      }
    };

    const _outTimeout = (elm) => {
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
    init: function() {
      window.console = window.console || {
        log: function() {}
      };
      _init();
    }
  };
}(jQuery);

SECONDSTREET.init();