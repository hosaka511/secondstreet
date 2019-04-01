/**
 * SECONDSTREET
 *
 * @date 2019-01-29
 */


 (function($) {
  const SECONDSTREET = window.SECONDSTREET || {};

  SECONDSTREET.STATICINDEX = function() {
    // 初期化
    const _init = function() {
      _faqAccordion.init();
   };



    /****
     *
     * アコーディオン
     *
     */
     const _faqAccordion = function() {
      let $openBtn = $('.js-answerTrigger').find('dt');
      const nowID = localStorage.getItem('openID');

      const _init = function() {
        $openBtn.on('click', _show);

        if (nowID != null) {
          $('.js-answerTrigger').eq(nowID - 1).find('dd').addClass('is-open');
          $('.js-answerTrigger').eq(nowID - 1).find('dt').addClass('is-show');
          setTimeout(function(){
            localStorage.clear();
          },100)
        }
      };

      const _show = function() {
        let $openBody = $(this).next('dd');
        $(this).toggleClass('is-show');
        $openBody.slideToggle(300);

        if ($(this).hasClass('is-show')) {
          $(this).next('dd').find('a').on('click', function(){
            event.preventDefault();
            let linkURL = $(this).attr('href');
            let state = $(this).parents('.js-answerTrigger').index();
            localStorage.setItem('openID', state);
            setTimeout(function(){
              window.location.href = linkURL;
            },100)
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