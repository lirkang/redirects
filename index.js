/**
 * @Author likan
 * @Date 2022-11-27 11:32:59
 * @Filepath redirects/index.js
 */

/** @typedef {{match: string | Array<string>, selectors: { removes: Array<string>, hides: Array<string>, parents: Array<string>, css: { [k: string]: Array<string> } }, onload?: () => void, runner?: () => void }} Site  */

(async function bootstrap(window) {
  /**
   *
   * @param {MouseEvent} event
   */
  function csdnEventHandler(event) {
    event.cancelBubble = true;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function wxEventHandler(event) {
    event.cancelBubble = true;

    return false;
  }

  const options = { capture: true, once: true };
  const traceProperties = ['ping', 'data-jsarwt', 'data-usg', 'data-ved'];
  const juejinRegexp = /https:\/\/link\.juejin\.cn\/\?target=(?<url>.*)/s;
  const zhihuRegexp = /https:\/\/link\.zhihu\.com\/\?target=(?<url>.*)/s;
  const baiduRgexp = /www\.baidu\.com\/link\?url=(?<url>.*)/s;

  /** @type {Array<Site>} */
  const sites = [
    {
      match: ['https://www.bing.com', 'https://cn.bing.com'],
      selectors: {
        css: {},
        hides: [],
        parents: ['#b_opalpers', '#bingApp_area', '.pagereco_anim'],
        removes: [
          '.b_ad',
          '.b_adTop',
          'aside',
          '#ev_talkbox_wrapper',
          '#relatedSearchesLGWContainer',
          'footer',
          '.fabcolapse',
          '.b_algo:has([data-partnertag])',
          '.b_ans:has(.rqnaContainerwithfeedback )',
        ],
      },
    },
    {
      match: 'https://www.baidu.com',
      selectors: {
        css: {
          'a, a *': ['text-decoration', 'none'],
          '.c-border, .single-card-wrapper_2nlg9': ['border-radius', '4px'],
        },
        hides: [],
        removes: [
          '#content_right',
          '#content_left > div:not(.c-container)',
          '[tpl="recommend_list"]',
          '.op-guide-cont',
        ],
        parents: ['#foot'],
      },
      runner() {
        $('a').each(function () {
          const matches = this.href.match(baiduRgexp);

          if (matches === null) return;

          chrome.runtime.sendMessage(this.href, value => (this.href = value));
        });
      },
    },
    {
      match: ['https://blog.csdn.net', 'https://csdnnews.blog.csdn.net', 'https://www.csdn.net', 'https://so.csdn.net'],
      runner() {
        $('#article_content a').each(function () {
          $(this).attr('target', '_blank');
          this.removeEventListener('click', csdnEventHandler, options);
          this.addEventListener('click', csdnEventHandler, options);
        });

        $('.hide-preCode-bt').trigger('click');
      },
      onload() {
        $('body').attr('style', 'background: #eeed !important');
      },
      selectors: {
        css: {
          'main, .blog-content': ['width', '100%'],
          '.blog-tags-box': ['padding-left', '12px'],
          'code *': ['user-select', 'text'],
          '.container, main': ['margin', '0', 'border-radius', '4px'],
          '.main-lt.blog': ['width', '100%'],
        },
        hides: ['div:has(.picture-ad)'],
        removes: [
          '.icon-fire',
          '.blog_container_aside',
          '.template-box',
          '.blog-footer-bottom',
          '#recommendNps',
          '#blogColumnPayAdvert',
          '#blogExtensionBox',
          '#treeSkill',
          '.recommend-box',
          '.left-toolbox',
          '.passport-login-container',
          '.blog-slide',
          '[classs="blog-top-banner"]',
          '.toolbar-menus',
          '.toolbar-container-right',
          '.article-type-img',
          '.operating',
          '#blogHuaweiyunAdvert',
          '.hljs-button.signin',
          '.main-rt',
          '.so-fixed-menus',
          '.recommend-right',
        ],
        parents: ['.csdn-side-toolbar'],
      },
    },
    {
      match: 'https://juejin.cn',
      runner() {
        $('.article-content a').each(function () {
          const matches = this.href.match(juejinRegexp);

          if (matches === null) return;

          this.href = decodeURIComponent(matches.groups.url);
        });
      },
      selectors: {
        css: {
          '.main-area, .course-content, .hot-list': ['max-width', '100%', 'width', 'auto'],
          '.main': ['justify-content', 'center'],
          '.timeline-entry-list, .stream': ['margin', '0', 'width', 'auto'],
          '#comment-box': ['width', '100%', 'margin-left', '0', 'margin-right', '0'],
        },
        hides: [],
        removes: [
          '.extension',
          '.sidebar',
          '.article-suspended-panel',
          '.category-course-recommend',
          '.article-end',
          '.recommended-links',
          '.aside',
          '.vip-entry',
          '.suspension-panel',
          '.course-aside',
          '.special-activity',
          '.download-icon',
          '.extension-icon',
          '.main-nav-list',
        ],
        parents: ['.advertisement', '.juejin-ab-test-wrap', '.dock-nav'],
      },
    },
    {
      match: 'https://www.google.com',
      runner() {
        $('a').each(function () {
          for (const property of traceProperties) $(this).removeAttr(property);
        });
      },
      selectors: {
        css: {},
        hides: [],
        removes: [],
        parents: [],
      },
    },
    {
      match: 'https://www.zhihu.com',
      runner() {
        $('.Feed').each(function () {
          const infos = JSON.parse($(this).attr('data-za-extra-module') ?? '{}');

          if (infos?.card?.has_video) $(this).parent().remove();
        });

        $('.Question-mainColumn a, .RichContent a').each(function () {
          const matches = this?.href?.match(zhihuRegexp);

          if (matches === null) return;

          this.href = decodeURIComponent(matches.groups.url);
        });
      },
      selectors: {
        css: {
          '.ProfileHeader': ['padding', '0'],
          'html': ['overflow', ''],
          '.Search-container': ['width', '100%'],
          '.Question-mainColumn, .Topstory-mainColumn, .Profile-mainColumn, .ProfileHeader, .QuestionWaiting-mainColumn, .Search-container, .SearchMain':
            ['width', '1200px', 'box-sizing', 'border-box'],
          '.AnswerItem-authorInfo': ['max-width', '100%'],
          '.Topstory-container, .Profile-main, .QuestionWaiting, .QuestionWaiting-mainColumn, .Question-main, .AuthorInfo-badgeText, .Search-container, .SearchMain':
            ['margin-left', '0', 'margin-right', '0', 'justify-content', 'center', 'width', 'auto'],
        },
        hides: [],
        removes: [
          '.Modal-wrapper',
          '.Question-mainColumnLogin',
          '.Question-sideColumn',
          '.Profile-sideColumn',
          '.Pc-word',
          '.Topstory-container > div:not(.Topstory-mainColumn)',
          '.QuestionWaiting > div:not(.QuestionWaiting-mainColumn)',
          '.TopstoryItem--advertCard',
          '.Search-container > div:not(.SearchMain)',
          '.AppHeader-Tabs',
        ],
        parents: ['.QuestionWaiting-typesContainer'],
      },
    },
    {
      match: 'https://developers.weixin.qq.com',
      runner() {
        $('a').each(function () {
          $(this).removeAttr('onclick');
          this.removeEventListener('click', wxEventHandler, options);
          this.addEventListener('click', wxEventHandler, options);
        });
      },
      selectors: {
        css: {},
        hides: [],
        removes: [],
        parents: [],
      },
    },
    {
      match: 'https://www.bilibili.com',
      onload() {
        setTimeout(() => {
          $('.bpx-player-ctrl-wide-enter, .toggle-btn, .bui-collapse-header, .tag-more').click();
        }, 3000);
      },
      selectors: {
        css: {
          '.video-data-list': ['margin', '0'],
          '.view-more': ['color', 'var(--text_link)'],
        },
        hides: [
          '.video-card-ad-small',
          '#slide_ad',
          '.act-end',
          '.fixed-nav',
          '.float-nav-exp > .nav-menu > *:not(.backup)',
          '.pop-live-small-mode',
          '.left-loc-entry',
          '.new-charge-btn',
          '.show-more',
          '.reply-decorate',
          '.login-tip',
          '.feed-card:has(.bili-video-card__info--ad)',
          '.bili-video-card:has(.bili-video-card__info--ad)',
          '.floor-card',
          '.palette-button-wrap > *:not(.top-btn)',
          '.bili-live-card',
          '.video-page-special-card-small',
          '.right-entry-item:has(.right-entry--vip)',
          '.right-entry-item:has(.header-upload-entry)',
          '.left-entry .v-popover-wrap:not(:first-child)',
          '.bpx-player-toast-wrap',
        ],
        removes: [],
        parents: ['.ad-floor-cover', '.download-entry'],
      },
    },
    {
      match: 'https://www.jianshu.com',
      selectors: {
        css: {},
        hides: ['.adModule', 'aside', 'footer', '.aside'],
        parents: [],
        removes: ['#indexCarousel', '.self-flow-ad', '#menu > div', '[aria-label="baidu-ad"]'],
      },
    },
  ];

  /** @type {Array<{ title: string, rules: RegExp, target: (query: string) => string, key: string }>} */
  const websites = [
    {
      title: 'Bing',
      rules: /https:\/\/www\.bing\.com\/search\?(?<query>.*)/,
      target: query => `https://www.bing.com/search?q=${query}`,
      key: 'q',
    },
    {
      title: 'Npm',
      rules: /https:\/\/www\.npmjs\.com\/search\?(?<query>.*)/,
      target: query => `https://www.npmjs.com/search?q=${query}`,
      key: 'q',
    },
    {
      title: 'Google翻译',
      rules: /https:\/\/translate\.google\.com\/\?(?<query>.*)/,
      target: query => `https://translate.google.com/?text=${query}`,
      key: 'text',
    },
    {
      title: '百度翻译',
      rules: /https:\/\/fanyi\.baidu\.com\/translate\?(?<query>.*)/,
      target: query => `https://fanyi.baidu.com/translate?query=${query}&lang=auto2zh`,
      key: 'query',
    },
    {
      title: '掘金',
      rules: /https:\/\/juejin\.cn\/search\?(?<query>.*)/,
      target: query => `https://juejin.cn/search?query=${query}`,
      key: 'query',
    },
    {
      title: '百度',
      rules: /https:\/\/www\.baidu\.com\/s\?(?<query>.*)/,
      target: query => `https://www.baidu.com/s?wd=${query}`,
      key: 'wd',
    },
    {
      title: 'Google',
      rules: /https:\/\/www\.google\.com(?:\.hk)?\/search\?(?<query>.*)/,
      target: query => `https://www.google.com/search?q=${query}`,
      key: 'q',
    },
  ];

  class App {
    /** @type {Site | null} @private */
    selectors = null;

    /**
     *
     * @param {string} href
     * @returns
     */
    constructor(href) {
      const [valid, site] = this.validate(href);

      if (!valid || !site) return;

      this.selectors = site;
      this.listen();

      site.onload && window.addEventListener('load', site.onload);
    }

    /**
     * 检查是否在sites列表中
     * @param {string} url
     * @returns {[boolean, Site | null]}
     * @private
     */
    validate(url) {
      const site = sites.find(({ match }) =>
        Array.isArray(match) ? match.some(link => url.startsWith(link)) : url.startsWith(match)
      );

      return site ? [true, site] : [false, null];
    }

    /**
     * 移除节点
     * @param {Array<string>} selectors
     * @private
     */
    removes(selectors) {
      $(selectors.join(',')).remove();
    }

    /**
     * 移除父节点
     * @param {Array<string>} selectors
     * @private
     */
    removeParents(selectors) {
      $(selectors.join(',')).parent().remove();
    }

    /**
     * 隐藏节点
     * @param {Array<string>} selectors
     * @private
     */
    hides(selectors) {
      $(selectors.join(',')).hide();
    }

    /**
     * @param {{[K: string]: Array<string>}} selectors
     * @private
     */
    setCss(selectors) {
      Object.keys(selectors).forEach(key => {
        const el = $(key);
        const stylesheet = [...selectors[key]];

        while (stylesheet.length) {
          const [name, value] = stylesheet.splice(0, 2);

          el.css(name, value);
        }
      });
    }

    /**
     * 监听Dom树
     * @private
     */
    listen() {
      const onChange = () => {
        this.removes(this.selectors?.selectors?.removes ?? []);
        this.hides(this.selectors?.selectors?.hides ?? []);
        this.removeParents(this.selectors?.selectors?.parents ?? []);
        this.setCss(this.selectors?.selectors?.css ?? {});
        this.selectors?.runner?.();
      };

      onChange();

      new MutationObserver(onChange.bind(this)).observe(document.body, { subtree: true, childList: true });
    }
  }

  class Slider {
    constructor() {}

    append() {}
  }

  new App(window.location.origin);
  new Slider();

  function getQuery() {
    for (const { rules, key } of websites) {
      const matches = window.location.href.match(rules);

      if (matches === null) continue;

      return function () {
        return parse(window.location.href.match(rules)?.groups?.query ?? '')[key];
      };
    }

    return () => '';
  }

  const query = getQuery();

  /**
   *
   * @param {string} string
   * @returns {Record<string, string>}
   */
  function parse(string) {
    return Object.fromEntries(string.split('&').map(item => item.split('=')));
  }

  const el = $('<div></div>');

  websites.forEach(({ title, target, rules, key }, index) => {
    const childEl = $('<a></a>');
    const iconEl = $('<span></span>');
    const titleEl = $('<span></span>');

    childEl.on('mouseover', function () {
      this.href = websites[index].target(query());
    });

    iconEl
      .text(title[0])
      .css('font-weight', 'bold')
      .css('font-size', 32)
      .css('transition', 'all 0.3s')
      .on('mouseover', function () {
        $(this).css('transform', 'scale(1.2)');
      })
      .on('mouseout', function () {
        $(this).css('transform', 'scale(1)');
      });

    titleEl.text(title).css('font-weight', 'medium');

    childEl
      .attr('target', '_blank')
      .css('display', 'flex')
      .css('justify-content', 'center')
      .css('flex-direction', 'column')
      .css('gap', 2)
      .css('text-align', 'center');

    childEl.append(iconEl).append(titleEl);
    el.append(childEl);
  });

  el.css('position', 'fixed')
    .css('left', 0)
    .css('top', 0)
    .css('bottom', 0)
    .css('width', 90)
    .css('transition', 'all 0.3s')
    .css('transform', 'translateX(-75%)')
    .css('z-index', 99999)
    .css('gap', 8)
    .css('display', 'flex')
    .css('flex-direction', 'column')
    .css('align-items', 'center')
    .css('border-radius', 8)
    .css('box-shadow', '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)')
    .css('backdrop-filter', 'blur(20px)')
    .css('padding', '24px 0')
    .css('overflow', 'auto')
    .addClass('extension__wrapper')
    .on('mouseover', function () {
      $(this).css('transform', 'translateX(-5%)');
    })
    .on('mouseout', function () {
      $(this).css('transform', 'translateX(-75%)');
    });

  const style = $('<style></style>');

  style.text('.extension__wrapper::-webkit-scrollbar {display: none;}');

  $('head').append(style);
  $('body').append(el);
})(window);
